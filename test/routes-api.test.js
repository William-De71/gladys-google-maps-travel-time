// The Routes API client against a fake fetch: the request (headers, field
// mask, waypoints, traffic, modifiers), the answer, the errors and the
// billing counter.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  API_URL,
  FIELD_MASK,
  createRoutesApi,
  requestBody,
  waypointOf,
  readRoute,
  classifyError,
  skuOf,
  ApiKeyError,
  QuotaError,
  TripError,
  BudgetExceededError,
  RoutesError,
} from '../src/routes-api.js';
import { createUsage } from '../src/usage.js';
import { WORK, SCHOOL, RIDE, fakeFetch, route, keyError, silent } from './helpers/fixtures.js';

const usage = (percent = 90) =>
  createUsage({ path: null, getPercent: () => percent, logger: silent });
const client = (fetchImpl, counter = usage(), key = 'AIzaTEST') =>
  createRoutesApi({ getApiKey: () => key, usage: counter, fetchImpl, logger: silent });

test('a car trip: POST with the key and the field mask in headers, live traffic', async () => {
  const fetchImpl = fakeFetch();
  const counter = usage();
  const reading = await client(fetchImpl, counter).route(WORK, 'fr');
  const [call] = fetchImpl.calls;
  assert.equal(call.url, API_URL);
  assert.equal(call.method, 'POST');
  assert.equal(call.headers['X-Goog-Api-Key'], 'AIzaTEST');
  assert.equal(call.headers['X-Goog-FieldMask'], FIELD_MASK);
  assert.doesNotMatch(call.url, /AIza/, 'never the key in the URL');
  assert.deepEqual(call.json, {
    origin: { address: '1 place de la Comédie, Lyon' },
    destination: { address: 'Gare Part-Dieu, Lyon' },
    travelMode: 'DRIVE',
    languageCode: 'fr',
    units: 'METRIC',
    routingPreference: 'TRAFFIC_AWARE',
  });
  assert.deepEqual(reading, {
    duration: 1920,
    staticDuration: 1500,
    delay: 420,
    distanceMeters: 24530,
    description: 'A6',
    warnings: [],
    sku: 'pro',
  });
  assert.equal(counter.used('pro'), 1);
});

test('the field mask never asks for an Enterprise field (tolls, traffic on polylines)', () => {
  assert.doesNotMatch(FIELD_MASK, /toll|polyline|travelAdvisory|\*/);
});

test('a bicycle trip has no traffic nor modifiers; coordinates become a LatLng', () => {
  const body = requestBody(SCHOOL, 'en');
  assert.equal(body.travelMode, 'BICYCLE');
  assert.equal(body.routingPreference, undefined);
  assert.deepEqual(body.origin, { location: { latLng: { latitude: 45.764, longitude: 4.8357 } } });
  assert.deepEqual(requestBody({ ...SCHOOL, avoidTolls: true }, 'en').routeModifiers, undefined);
  assert.deepEqual(requestBody(RIDE, 'de').routeModifiers, { avoidHighways: true });
  assert.equal(requestBody(RIDE, 'xx-weird').languageCode, 'en');
});

test('waypoints: coordinates in range only, anything else is an address', () => {
  assert.deepEqual(waypointOf('-33.86;151.2'), {
    location: { latLng: { latitude: -33.86, longitude: 151.2 } },
  });
  assert.deepEqual(waypointOf('95, 10'), { address: '95, 10' });
  assert.deepEqual(waypointOf('8FVC9G8F+6X'), { address: '8FVC9G8F+6X' });
});

test('billing SKU of each mode', () => {
  assert.deepEqual(['drive', 'two_wheeler', 'bicycle', 'walk', 'transit'].map(skuOf), [
    'pro',
    'enterprise',
    'essentials',
    'essentials',
    'essentials',
  ]);
});

test('answers: no traffic delay without traffic, never negative, no route is an error', () => {
  assert.equal(readRoute(route({ staticDuration: '2000s' }), 'drive').delay, 0);
  const walk = readRoute(route({ duration: '900s', staticDuration: '600s' }), 'walk');
  assert.deepEqual([walk.staticDuration, walk.delay], [900, 0]);
  const empty = readRoute(route({ description: undefined, distanceMeters: undefined }), 'drive');
  assert.deepEqual([empty.description, empty.distanceMeters], ['', 0]);
  assert.throws(() => readRoute({}, 'drive'), TripError);
});

test('errors: key, quota, trip, other; a failure is never counted', async () => {
  assert.ok(classifyError(keyError.status, keyError.body) instanceof ApiKeyError);
  assert.equal(classifyError(keyError.status, keyError.body).reason, 'API_KEY_INVALID');
  const unregistered = classifyError(403, {
    error: {
      code: 403,
      message: 'Method doesn’t allow unregistered callers',
      status: 'PERMISSION_DENIED',
    },
  });
  assert.ok(unregistered instanceof ApiKeyError);
  const disabled = classifyError(403, {
    error: { status: 'PERMISSION_DENIED', details: [{ reason: 'SERVICE_DISABLED' }] },
  });
  assert.equal(disabled.reason, 'SERVICE_DISABLED');
  assert.ok(classifyError(429, { error: { status: 'RESOURCE_EXHAUSTED' } }) instanceof QuotaError);
  const bad = classifyError(400, {
    error: { message: 'Invalid waypoint', status: 'INVALID_ARGUMENT' },
  });
  assert.ok(bad instanceof TripError);
  assert.ok(!(classifyError(503, null) instanceof TripError));

  const counter = usage();
  await assert.rejects(client(fakeFetch([keyError]), counter).route(WORK, 'en'), ApiKeyError);
  await assert.rejects(
    client(fakeFetch([new Error('ECONNRESET')]), counter).route(WORK, 'en'),
    RoutesError,
  );
  await assert.rejects(
    client(fakeFetch(), counter, '').route(WORK, 'en'),
    (err) => err.reason === 'API_KEY_MISSING',
  );
  assert.equal(counter.used('pro'), 0);
  // A 200 without a route is billed, then reported.
  await assert.rejects(
    client(fakeFetch([{ status: 200, body: {} }]), counter).route(WORK, 'en'),
    TripError,
  );
  assert.equal(counter.used('pro'), 1);
});

test('a spent budget stops the requests of its SKU only', async () => {
  const counter = usage(0.02); // 1 request per SKU
  const fetchImpl = fakeFetch();
  const api = client(fetchImpl, counter);
  await api.route(WORK, 'en');
  await assert.rejects(api.route(WORK, 'en'), BudgetExceededError);
  await api.route(SCHOOL, 'en');
  assert.equal(fetchImpl.calls.length, 2);
});
