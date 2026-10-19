// Shared fixtures of the tests: a few trips of a household, a fake fetch of
// the Routes API, a silent logger. Tests never touch the network.

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const silent = { info() {}, warn() {}, error() {}, debug() {} };

// Only what the device builders use from the SDK client.
const fakeGladys = {
  externalIds: (type, id) => {
    const device = `ext:test-integration:${type}:${id}`;
    return { device, feature: (key) => `${device}:${key}` };
  },
};

const trip = (values) => ({
  mode: 'drive',
  avoidTolls: false,
  avoidHighways: false,
  avoidFerries: false,
  days: 'weekdays',
  hours: [[360, 1260]],
  interval: null,
  threshold: null,
  ...values,
});

const WORK = trip({
  id: 'a1b2c3d4',
  name: 'Work',
  origin: '1 place de la Comédie, Lyon',
  destination: 'Gare Part-Dieu, Lyon',
});
const SCHOOL = trip({
  id: 'b2c3d4e5',
  name: 'School',
  origin: '45.7640, 4.8357',
  destination: 'Lycée du Parc, Lyon',
  mode: 'bicycle',
  hours: [
    [420, 540],
    [960, 1080],
  ],
});
const RIDE = trip({
  id: 'c3d4e5f6',
  name: 'Ride',
  origin: 'Lyon',
  destination: 'Annecy',
  mode: 'two_wheeler',
  days: 'weekend',
  avoidHighways: true,
});
const TRIPS = [WORK, SCHOOL, RIDE];

// A reading as the Routes API client returns it (seconds and meters).
const READING = {
  duration: 1920,
  staticDuration: 1500,
  delay: 420,
  distanceMeters: 24530,
  description: 'A6',
  warnings: [],
};

/**
 * @description A temporary directory for the /data files.
 * @returns {{ state: string, usage: string }} The paths (the files do not exist).
 */
function dataPaths() {
  const dir = mkdtempSync(join(tmpdir(), 'travel-time-'));
  return { state: join(dir, 'state.json'), usage: join(dir, 'usage.json') };
}

/**
 * @description A fake fetch of computeRoutes: answers the queued replies in
 * order (the last one forever), and records the requests.
 * @param {Array<object|Function>} replies - `{ status, body }`, or
 *   `(request) => ({ status, body })`, or an Error to throw.
 * @returns {Function & { calls: object[] }} The fetch.
 */
function fakeFetch(replies = [{ status: 200, body: route() }]) {
  const queue = [...replies];
  const calls = [];
  const impl = async (url, options) => {
    const request = { url, ...options, json: JSON.parse(options.body) };
    calls.push(request);
    let reply = queue.length > 1 ? queue.shift() : queue[0];
    if (typeof reply === 'function') reply = reply(request);
    if (reply instanceof Error) throw reply;
    return {
      ok: reply.status >= 200 && reply.status < 300,
      status: reply.status,
      json: async () => reply.body,
    };
  };
  impl.calls = calls;
  return impl;
}

/**
 * @description A computeRoutes answer.
 * @param {object} [values] - Overrides of the route.
 * @returns {object} The body.
 */
function route(values = {}) {
  return {
    routes: [
      {
        duration: '1920s',
        staticDuration: '1500s',
        distanceMeters: 24530,
        description: 'A6',
        ...values,
      },
    ],
  };
}

const keyError = {
  status: 400,
  body: {
    error: {
      code: 400,
      message: 'API key not valid. Please pass a valid API key.',
      status: 'INVALID_ARGUMENT',
      details: [
        {
          '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
          reason: 'API_KEY_INVALID',
          domain: 'googleapis.com',
        },
      ],
    },
  },
};

export {
  silent,
  fakeGladys,
  trip,
  WORK,
  SCHOOL,
  RIDE,
  TRIPS,
  READING,
  dataPaths,
  fakeFetch,
  route,
  keyError,
};
