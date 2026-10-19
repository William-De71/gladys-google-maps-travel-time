// -----------------------------------------------------------------------------
// Client of the Google Maps Platform Routes API (v2), computeRoutes only.
//
// Documented contract (https://developers.google.com/maps/documentation/routes):
//   POST https://routes.googleapis.com/directions/v2:computeRoutes
//   headers  X-Goog-Api-Key (the key, never in the URL: URLs end up in logs)
//            X-Goog-FieldMask (required: the fields of the answer)
//   body     origin / destination: a Waypoint, `address` (text or plus code)
//            or `location.latLng`; travelMode DRIVE | TWO_WHEELER | BICYCLE |
//            WALK | TRANSIT; routingPreference TRAFFIC_AWARE (DRIVE and
//            TWO_WHEELER only); routeModifiers avoidTolls / avoidHighways /
//            avoidFerries (DRIVE and TWO_WHEELER only); languageCode (BCP-47).
//   answer   routes[0].duration and .staticDuration ("1234s"), .distanceMeters,
//            .description (the main roads), .warnings. No route: `{}`.
//
// Billing (checked on 2026-10-19 on developers.google.com, pricing and SKU
// details): one billable event per successful request, under the highest SKU
// whose features the request uses —
//   Compute Routes Essentials   no traffic: BICYCLE, WALK, TRANSIT, or DRIVE
//                               without traffic        10,000 free a month
//   Compute Routes Pro          routingPreference TRAFFIC_AWARE  5,000 free
//   Compute Routes Enterprise   two-wheeled vehicle routing      1,000 free
// Toll calculation and traffic on polylines are Enterprise features too: the
// field mask never asks for them. computeRouteMatrix is not used: it bills
// per element, so one matrix of N trips costs the same N events, with harder
// errors to tell apart.
// -----------------------------------------------------------------------------

const API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';
const TIMEOUT_MS = 15 * 1000;
// Only what the integration shows: a field outside the mask is not returned,
// and an Enterprise field (travelAdvisory.tollInfo, polyline traffic) would
// bill the request at the Enterprise rate.
const FIELD_MASK = [
  'routes.duration',
  'routes.staticDuration',
  'routes.distanceMeters',
  'routes.description',
  'routes.warnings',
].join(',');

const MODES = ['drive', 'two_wheeler', 'bicycle', 'walk', 'transit'];
const TRAVEL_MODES = {
  drive: 'DRIVE',
  two_wheeler: 'TWO_WHEELER',
  bicycle: 'BICYCLE',
  walk: 'WALK',
  transit: 'TRANSIT',
};
const SKUS = { ESSENTIALS: 'essentials', PRO: 'pro', ENTERPRISE: 'enterprise' };
// Free billable events per month and per SKU (Google Maps Platform pricing).
const FREE_USAGE = { essentials: 10000, pro: 5000, enterprise: 1000 };
// The modes that take live traffic (and the avoid options).
const TRAFFIC_MODES = ['drive', 'two_wheeler'];

/** @description Any failure of the Routes API. */
class RoutesError extends Error {
  /**
   * @param {string} message - The message (never contains the key).
   * @param {number|null} status - The HTTP status (null: network).
   * @param {string|null} [reason] - The google.rpc.ErrorInfo reason, or the status.
   */
  constructor(message, status, reason = null) {
    super(message);
    this.name = 'RoutesError';
    this.status = status;
    this.reason = reason;
  }
}

/**
 * @description The key is missing, invalid, restricted, or the project
 * cannot use the API (not enabled, no billing account). Retrying will not
 * help until the user acts: `reason` says what to fix.
 */
class ApiKeyError extends RoutesError {
  constructor(message, status, reason) {
    super(message, status, reason);
    this.name = 'ApiKeyError';
  }
}

/** @description Google refused for quota or rate (429 RESOURCE_EXHAUSTED). */
class QuotaError extends RoutesError {
  constructor(message, status, reason) {
    super(message, status, reason);
    this.name = 'QuotaError';
  }
}

/**
 * @description The request of one trip is wrong: an address Google cannot
 * place, a mode not available there, no route at all. The other trips go on.
 */
class TripError extends RoutesError {
  constructor(message, status, reason) {
    super(message, status, reason);
    this.name = 'TripError';
  }
}

/** @description The monthly budget of a SKU is spent. */
class BudgetExceededError extends RoutesError {
  /**
   * @param {string} sku - The SKU.
   * @param {number} budget - Its budget.
   */
  constructor(sku, budget) {
    super(`Monthly budget of ${budget} ${sku} requests reached`, null, 'BUDGET_EXCEEDED');
    this.name = 'BudgetExceededError';
    this.sku = sku;
  }
}

// ErrorInfo reasons that point at the key or the Cloud project.
const KEY_REASONS = new Set([
  'API_KEY_INVALID',
  'API_KEY_EXPIRED',
  'API_KEY_SERVICE_BLOCKED',
  'API_KEY_IP_ADDRESS_BLOCKED',
  'API_KEY_HTTP_REFERRER_BLOCKED',
  'API_KEY_ANDROID_APP_BLOCKED',
  'API_KEY_IOS_APP_BLOCKED',
  'SERVICE_DISABLED',
  'BILLING_DISABLED',
  'CONSUMER_INVALID',
  'PERMISSION_DENIED',
]);

/**
 * @description The SKU a trip is billed under.
 * @param {string} mode - The travel mode of the trip.
 * @returns {string} essentials, pro or enterprise.
 * @example
 * skuOf('drive'); // -> 'pro'
 */
function skuOf(mode) {
  if (mode === 'two_wheeler') return SKUS.ENTERPRISE;
  if (mode === 'drive') return SKUS.PRO;
  return SKUS.ESSENTIALS;
}

/**
 * @description Read a Google error body ({ error: { code, message, status, details } }).
 * @param {object|null} body - The parsed body.
 * @returns {{ message: string, status: string|null, reason: string|null }} The error.
 */
function readError(body) {
  const error = body?.error ?? {};
  const details = Array.isArray(error.details) ? error.details : [];
  const info = details.find((detail) => typeof detail?.reason === 'string');
  return {
    message: typeof error.message === 'string' ? error.message.slice(0, 300) : '',
    status: typeof error.status === 'string' ? error.status : null,
    reason: info?.reason ?? null,
  };
}

/**
 * @description Turn an HTTP failure into the right error class.
 * @param {number} httpStatus - The HTTP status.
 * @param {object|null} body - The parsed body.
 * @returns {RoutesError} The error.
 * @example
 * classifyError(400, { error: { message: 'API key not valid.', details: [{ reason: 'API_KEY_INVALID' }] } });
 */
function classifyError(httpStatus, body) {
  const { message, status, reason } = readError(body);
  const text = `Routes API ${httpStatus}${status ? ` ${status}` : ''}${message ? `: ${message}` : ''}`;
  // A bad key answers 400 INVALID_ARGUMENT with the API_KEY_INVALID reason.
  if (reason !== null && KEY_REASONS.has(reason)) {
    return new ApiKeyError(text, httpStatus, reason);
  }
  if (httpStatus === 401 || httpStatus === 403 || /api key/i.test(message)) {
    return new ApiKeyError(text, httpStatus, reason ?? status ?? 'PERMISSION_DENIED');
  }
  if (httpStatus === 429) {
    return new QuotaError(text, httpStatus, reason ?? status);
  }
  if (httpStatus === 400 || httpStatus === 404) {
    return new TripError(text, httpStatus, reason ?? status);
  }
  return new RoutesError(text, httpStatus, reason ?? status);
}

/**
 * @description A Waypoint from what the user typed: "48.8566, 2.3522" is a
 * point, anything else an address (or a plus code) Google places itself.
 * @param {string} text - The typed place.
 * @returns {object} The Waypoint.
 * @example
 * waypointOf('45.76,4.83'); // -> { location: { latLng: { latitude: 45.76, longitude: 4.83 } } }
 */
function waypointOf(text) {
  const value = String(text ?? '').trim();
  const point = /^(-?\d{1,2}(?:\.\d+)?)\s*[,;]\s*(-?\d{1,3}(?:\.\d+)?)$/.exec(value);
  if (point) {
    const latitude = Number(point[1]);
    const longitude = Number(point[2]);
    if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) {
      return { location: { latLng: { latitude, longitude } } };
    }
  }
  return { address: value };
}

/**
 * @description The body of a computeRoutes request for a trip.
 * @param {object} trip - `{ origin, destination, mode, avoidTolls, avoidHighways, avoidFerries }`.
 * @param {string} language - The language of the texts ('en', 'fr'…).
 * @returns {object} The body.
 */
function requestBody(trip, language) {
  const body = {
    origin: waypointOf(trip.origin),
    destination: waypointOf(trip.destination),
    travelMode: TRAVEL_MODES[trip.mode] ?? 'DRIVE',
    languageCode: /^[a-z]{2}$/.test(language) ? language : 'en',
    units: 'METRIC',
  };
  if (TRAFFIC_MODES.includes(trip.mode)) {
    // Live traffic, departure now (the default departureTime).
    body.routingPreference = 'TRAFFIC_AWARE';
    const modifiers = {
      ...(trip.avoidTolls ? { avoidTolls: true } : {}),
      ...(trip.avoidHighways ? { avoidHighways: true } : {}),
      ...(trip.avoidFerries ? { avoidFerries: true } : {}),
    };
    if (Object.keys(modifiers).length > 0) {
      body.routeModifiers = modifiers;
    }
  }
  return body;
}

/**
 * @description Seconds of a protobuf Duration ("1234s", "12.5s").
 * @param {unknown} value - The duration.
 * @returns {number|null} The seconds.
 */
function seconds(value) {
  const match = /^(\d+(?:\.\d+)?)s$/.exec(String(value ?? ''));
  return match ? Number(match[1]) : null;
}

/**
 * @description The reading of a trip from a computeRoutes answer.
 * @param {object} body - The answer.
 * @param {string} mode - The travel mode.
 * @returns {{ duration: number, staticDuration: number, delay: number,
 *   distanceMeters: number, description: string, warnings: string[] }} Seconds and meters.
 * @throws {TripError} When there is no route.
 */
function readRoute(body, mode) {
  const route = Array.isArray(body?.routes) ? body.routes[0] : undefined;
  const duration = seconds(route?.duration);
  if (!route || duration === null) {
    throw new TripError('No route found between these places', 200, 'NO_ROUTE');
  }
  const traffic = TRAFFIC_MODES.includes(mode);
  const staticDuration = traffic ? (seconds(route.staticDuration) ?? duration) : duration;
  return {
    duration,
    staticDuration,
    delay: Math.max(0, duration - staticDuration),
    distanceMeters: Number.isFinite(route.distanceMeters) ? route.distanceMeters : 0,
    description: typeof route.description === 'string' ? route.description.slice(0, 200) : '',
    warnings: Array.isArray(route.warnings)
      ? route.warnings.filter((w) => typeof w === 'string').map((w) => w.slice(0, 200))
      : [],
  };
}

/**
 * @description Create the Routes API client.
 * @param {object} options - Options.
 * @param {Function} options.getApiKey - `() => string`.
 * @param {object} options.usage - The usage counter (usage.js).
 * @param {Function} [options.fetchImpl] - `fetch` (injected by the tests).
 * @param {object} [options.logger] - Logger.
 * @returns {{ route: Function }} `route(trip, language) => Promise<reading>`.
 * @example
 * const api = createRoutesApi({ getApiKey: () => key, usage });
 */
function createRoutesApi({ getApiKey, usage, fetchImpl = fetch, logger = console }) {
  return {
    /**
     * @description Compute the route of a trip, now.
     * @param {object} trip - The trip.
     * @param {string} language - Language of the texts.
     * @returns {Promise<object>} The reading (readRoute) and its `sku`.
     */
    async route(trip, language) {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new ApiKeyError('No API key configured', null, 'API_KEY_MISSING');
      }
      const sku = skuOf(trip.mode);
      if (usage.exhausted(sku)) {
        throw new BudgetExceededError(sku, usage.budget(sku));
      }
      let response;
      try {
        response = await fetchImpl(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': FIELD_MASK,
          },
          body: JSON.stringify(requestBody(trip, language)),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
      } catch (err) {
        throw new RoutesError(`Routes API unreachable: ${err.message}`, null);
      }
      let body;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      if (!response.ok) {
        throw classifyError(response.status, body);
      }
      // A successful answer is billed, a route found or not.
      usage.record(sku);
      logger.debug?.(`Routes API OK (${usage.used(sku)} ${sku} request(s) this month)`);
      return { ...readRoute(body, trip.mode), sku };
    },
  };
}

export {
  API_URL,
  FIELD_MASK,
  MODES,
  TRAVEL_MODES,
  TRAFFIC_MODES,
  SKUS,
  FREE_USAGE,
  RoutesError,
  ApiKeyError,
  QuotaError,
  TripError,
  BudgetExceededError,
  skuOf,
  readError,
  classifyError,
  waypointOf,
  requestBody,
  seconds,
  readRoute,
  createRoutesApi,
};
