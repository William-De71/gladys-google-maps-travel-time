// The integration end to end, against the fake Gladys of the SDK and a fake
// fetch of the Routes API: the configuration buttons, the Discovery list, the
// clock (days, hours, interval, restart), the errors (refused key, 429,
// budget), the scene triggers and actions, the widgets and their buttons.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createFakeGladys } from '@gladysassistant/integration-sdk/testing';
import { createApp, ACTIONS } from '../src/app.js';
import { TRIGGERS } from '../src/events.js';
import { dataPaths, fakeFetch, route, keyError, silent } from './helpers/fixtures.js';

const manifest = JSON.parse(
  (await import('node:fs')).readFileSync(
    new URL('../gladys-assistant-integration.json', import.meta.url),
    'utf8',
  ),
);
const outputsOf = (key) =>
  manifest.scene_actions
    .find((a) => a.key === key)
    .outputs.map((o) => o.key)
    .sort();
const variablesOf = (key) =>
  manifest.scene_triggers
    .find((t) => t.key === key)
    .variables.map((v) => v.key)
    .sort();

const FORM = {
  name: 'Work',
  origin: '1 place de la Comédie, Lyon',
  destination: 'Gare Part-Dieu, Lyon',
  mode: 'drive',
  days: 'weekdays',
};

/**
 * @description A started integration on a controllable clock.
 * @param {object} [options] - Options.
 * @param {string} [options.at] - The instant (ISO): Monday 19 October 2026, 7:30 in Paris.
 * @param {object} [options.config] - The configuration.
 * @param {Array} [options.replies] - Replies of the fake fetch.
 * @param {object} [options.paths] - The /data files (to restart on them).
 * @returns {Promise<object>} `{ gladys, app, clock, fetchImpl, paths }`.
 */
async function start({
  at = '2026-10-19T05:30:00Z',
  config = {},
  replies,
  paths = dataPaths(),
  fetchImpl = fakeFetch(replies),
} = {}) {
  const clock = { now: new Date(at) };
  const gladys = createFakeGladys({ config: { language: 'en', api_key: 'AIzaTEST', ...config } });
  let n = 0;
  const app = createApp(gladys, {
    now: () => clock.now,
    timezone: 'Europe/Paris',
    fetchImpl,
    statePath: paths.state,
    usagePath: paths.usage,
    sleep: async () => {},
    newId: () => `e000000${(n += 1)}`.slice(-8),
    tickMs: 0,
    logger: silent,
  });
  await gladys.connect();
  return { gladys, app, clock, fetchImpl, paths };
}

const ok = (ack) => {
  assert.equal(ack.success, true, ack.error);
  return ack.data.message ?? ack.data.content ?? ack.data.outputs;
};
const later = (clock, minutes) => {
  clock.now = new Date(clock.now.getTime() + minutes * 60000);
};
const create = async (gladys) => {
  for (const device of gladys.fake.discoveredDevices) await gladys.fake.deviceCreated(device);
};
const last = (gladys, key) => gladys.fake.lastState(`ext:test-integration:trip:e0000001:${key}`);

test('no key: the status says what to do, and nothing goes out', async () => {
  const { gladys, app, fetchImpl } = await start({ config: { api_key: '' } });
  assert.equal(gladys.fake.connectionStatus.connected, false);
  assert.match(gladys.fake.connectionStatus.message.fr, /clé d’API Google Maps Platform/);
  ok(await gladys.fake.action(ACTIONS.ADD, FORM));
  await app.tick();
  assert.equal(fetchImpl.calls.length, 0);
  const widget = ok(await gladys.fake.widgetGet('trips', { language: 'en' }));
  assert.match(widget.components[0].text, /API key/);
});

test('add a trip: stored in Gladys, read at once in its hours, states once the device exists', async () => {
  const { gladys, fetchImpl } = await start();
  assert.match(gladys.fake.connectionStatus.message.en, /No trip yet/);
  const message = ok(await gladys.fake.action(ACTIONS.ADD, FORM));
  assert.match(
    message.en,
    /^Added: #1 Work — Car, Monday to Friday, 6-21, every 15 min \(≈ 1,300 requests a month\)/,
  );
  assert.match(message.fr, /Ouvrez maintenant l’onglet Découverte/);
  assert.equal(gladys.fake.config.trips.length, 1);
  assert.deepEqual(
    gladys.fake.discoveredDevices.map((d) => d.name),
    ['Work'],
  );
  assert.equal(fetchImpl.calls.length, 1, 'read at once: 7:30 on a Monday');
  assert.equal(gladys.fake.states.length, 0, 'no device yet');
  await create(gladys);
  assert.equal(last(gladys, 'duration'), 32);
  assert.equal(last(gladys, 'traffic_delay'), 7);
  assert.equal(last(gladys, 'route'), 'A6');
  assert.match(
    gladys.fake.connectionStatus.message.en,
    /1 trip\(s\)\. This month: 1 \/ 4,500 Pro requests/,
  );
  const refused = await gladys.fake.action(ACTIONS.ADD, { ...FORM, hours: 'tea time' });
  assert.equal(refused.success, false);
  assert.match(refused.error, /Hours not understood/);
});

test('the clock: every interval within the hours, never outside, nothing twice after a restart', async () => {
  const paths = dataPaths();
  const { gladys, app, clock, fetchImpl } = await start({ paths });
  ok(await gladys.fake.action(ACTIONS.ADD, { ...FORM, hours: '7-9', interval_minutes: 10 }));
  assert.equal(fetchImpl.calls.length, 1);
  later(clock, 5);
  await app.tick();
  assert.equal(fetchImpl.calls.length, 1, 'too soon');
  later(clock, 5);
  await app.tick();
  assert.equal(fetchImpl.calls.length, 2);
  // A restart keeps the last reading and the time of the last request.
  later(clock, 5);
  app.stop();
  const again = await start({
    paths,
    at: clock.now.toISOString(),
    config: { trips: gladys.fake.config.trips },
  });
  assert.equal(again.fetchImpl.calls.length, 0, 'read 5 minutes before the restart');
  const widget = ok(await again.gladys.fake.widgetGet('trips', { language: 'en' }));
  assert.match(widget.components[1].items[0].subtitle, /^32 min · 24\.5 km · via A6$/);
  later(again.clock, 5);
  await again.app.tick();
  assert.equal(again.fetchImpl.calls.length, 1);
  later(again.clock, 120);
  await again.app.tick();
  assert.equal(again.fetchImpl.calls.length, 1, 'after 9:00');
});

test('the route changes: one event at a scheduled reading, none after a manual one', async () => {
  const replies = [
    { status: 200, body: route() },
    { status: 200, body: route({ description: 'N7', duration: '2400s' }) },
    { status: 200, body: route({ description: 'A7' }) },
  ];
  const { gladys, app, clock } = await start({ replies });
  ok(await gladys.fake.action(ACTIONS.ADD, FORM));
  later(clock, 15);
  await app.tick();
  assert.equal(gladys.fake.sceneEvents.length, 1);
  const [{ key, data }] = gladys.fake.sceneEvents;
  assert.equal(key, TRIGGERS.ROUTE_CHANGED);
  assert.deepEqual(Object.keys(data).sort(), [...variablesOf(key), 'trip'].sort());
  assert.equal(data.trip, 'ext:test-integration:trip:e0000001');
  assert.deepEqual([data.previous_route, data.route, data.duration], ['A6', 'N7', 40]);
  later(clock, 2);
  const outputs = ok(await gladys.fake.sceneAction('refresh_trip', { trip: data.trip }));
  assert.equal(outputs.route, 'A7');
  assert.equal(gladys.fake.sceneEvents.length, 1, 'never an event from an action');
});

test('a refused key: status, one event, a retry an hour later, and a new key starts again', async () => {
  const { gladys, app, clock, fetchImpl } = await start({ replies: [keyError] });
  ok(await gladys.fake.action(ACTIONS.ADD, FORM));
  assert.equal(gladys.fake.connectionStatus.connected, false);
  assert.match(gladys.fake.connectionStatus.message.en, /API_KEY_INVALID.*copy it again/);
  later(clock, 1);
  await app.tick();
  await app.tick();
  const events = gladys.fake.sceneEvents.filter((e) => e.key === TRIGGERS.API_KEY_REFUSED);
  assert.equal(events.length, 1);
  assert.deepEqual(Object.keys(events[0].data).sort(), variablesOf(TRIGGERS.API_KEY_REFUSED));
  later(clock, 20);
  await app.tick();
  assert.equal(fetchImpl.calls.length, 1, 'waits before trying the key again');
  later(clock, 45);
  await app.tick();
  assert.equal(fetchImpl.calls.length, 2, 'an hour later');
  const test = await gladys.fake.action(ACTIONS.TEST_KEY);
  assert.equal(test.success, false);
  assert.match(test.error, /Google refuses the API key/);
});

test('the test button: one Essentials walk, and the key is accepted', async () => {
  const { gladys, fetchImpl } = await start({ config: { language: 'fr' } });
  const message = ok(await gladys.fake.action(ACTIONS.TEST_KEY));
  assert.match(message.fr, /La clé fonctionne.*32 min, 24\.5 km \(1 requête Essentials\)/);
  assert.equal(fetchImpl.calls[0].json.travelMode, 'WALK');
  const budget = ok(await gladys.fake.widgetGet('budget', { language: 'fr' }));
  assert.equal(budget.components.at(-1).items.at(-1).value, 'Acceptée');
});

test('429: a pause of 15 minutes for every trip', async () => {
  const replies = [
    { status: 429, body: { error: { status: 'RESOURCE_EXHAUSTED' } } },
    { status: 200, body: route() },
  ];
  const { gladys, app, clock, fetchImpl } = await start({ replies });
  ok(await gladys.fake.action(ACTIONS.ADD, FORM));
  ok(await gladys.fake.action(ACTIONS.ADD, { ...FORM, name: 'Gym', destination: 'Bron' }));
  assert.equal(fetchImpl.calls.length, 1, 'the second trip waits too');
  later(clock, 14);
  await app.tick();
  assert.equal(fetchImpl.calls.length, 1);
  later(clock, 2);
  await app.tick();
  assert.equal(fetchImpl.calls.length, 3);
});

test('the budget: intervals stretched to fit, alerts at 80 % then 100 %, once each', async () => {
  // 1 % of 5,000 Pro requests: a budget of 50.
  const { gladys, app, fetchImpl } = await start({ config: { budget_percent: 1 } });
  ok(await gladys.fake.action(ACTIONS.ADD, { ...FORM, interval_minutes: 5 }));
  const list = ok(await gladys.fake.action(ACTIONS.LIST));
  assert.match(list.en, /every 434 min .* \(stretched from 5 min to stay within the budget\)/);
  const compute = () =>
    gladys.fake.sceneAction('compute_route', {
      origin: 'Lyon',
      destination: 'Bron',
      mode: 'drive',
    });
  for (let i = 0; i < 39; i += 1) ok(await compute());
  await app.tick();
  await app.tick();
  for (let i = 0; i < 10; i += 1) ok(await compute());
  await app.tick();
  await app.tick();
  const alerts = gladys.fake.sceneEvents.filter((e) => e.key === TRIGGERS.BUDGET_ALERT);
  assert.deepEqual(
    alerts.map((a) => [a.data.level, a.data.used]),
    [
      ['warning', 40],
      ['exhausted', 50],
    ],
  );
  assert.deepEqual(Object.keys(alerts[0].data).sort(), variablesOf(TRIGGERS.BUDGET_ALERT));
  assert.equal(alerts[1].data.sku, 'pro');
  const refused = await compute();
  assert.equal(refused.success, false);
  assert.match(refused.error, /The 50 Pro requests of the month are used/);
  assert.equal(fetchImpl.calls.length, 50);
  // Other SKUs go on.
  ok(
    await gladys.fake.sceneAction('compute_route', {
      origin: 'Lyon',
      destination: 'Bron',
      mode: 'walk',
    }),
  );
});

test('list, edit and remove; an edit of the mode says to update the device', async () => {
  const { gladys } = await start({ at: '2026-10-18T10:00:00Z' });
  ok(await gladys.fake.action(ACTIONS.ADD, FORM));
  const edited = ok(
    await gladys.fake.action(ACTIONS.EDIT, { trip: '#1', mode: 'bicycle', hours: '7-9' }),
  );
  assert.match(edited.en, /Changed: #1 Work — Bicycle, Monday to Friday, 7-9/);
  assert.match(edited.en, /click “Update” on the Discover tab/);
  const list = ok(await gladys.fake.action(ACTIONS.LIST));
  assert.match(list.en, /^1 trip\(s\), timezone Europe\/Paris/);
  assert.match(list.en, /last reading: never/);
  ok(await gladys.fake.action(ACTIONS.REMOVE, { trip: 'work' }));
  assert.deepEqual(gladys.fake.config.trips, []);
  assert.match(ok(await gladys.fake.action(ACTIONS.LIST)).en, /No trip yet/);
});

test('scene action compute_route: the declared outputs only, scalars', async () => {
  const { gladys, fetchImpl } = await start();
  const outputs = ok(
    await gladys.fake.sceneAction('compute_route', {
      origin: 'Lyon',
      destination: 'Grenoble',
      mode: 'drive',
      avoid_tolls: true,
    }),
  );
  assert.deepEqual(Object.keys(outputs).sort(), outputsOf('compute_route'));
  assert.equal(outputs.summary, 'Lyon → Grenoble: 32 min, 7 min of traffic, 24.5 km via A6.');
  assert.deepEqual(fetchImpl.calls[0].json.routeModifiers, { avoidTolls: true });
  const refused = await gladys.fake.sceneAction('compute_route', { origin: '', destination: 'x' });
  assert.equal(refused.success, false);
});

test('widgets: the trips, one trip, the refresh buttons and their toasts', async () => {
  const { gladys, clock, fetchImpl } = await start();
  ok(await gladys.fake.action(ACTIONS.ADD, FORM));
  await create(gladys);
  const trips = ok(await gladys.fake.widgetGet('trips', { language: 'de' }));
  assert.equal(trips.components[1].items[0].badge.text, '+7 Min.');
  const id = 'ext:test-integration:trip:e0000001';
  const one = ok(await gladys.fake.widgetGet('trip', { language: 'es', settings: { trip: id } }));
  assert.equal(one.components[0].text, 'Work');
  // Read a moment ago: the button keeps the reading, no request.
  const toast = ok(await gladys.fake.widgetAction('trip', 'refresh', { trip: 'e0000001' }));
  assert.match(toast.en, /^Refreshed: Work: 32 min/);
  assert.equal(fetchImpl.calls.length, 1);
  later(clock, 2);
  const all = ok(
    await gladys.fake.widgetAction('trips', 'refresh_all', { trips: ['e0000001', 'nope'] }),
  );
  assert.equal(all.fr, 'Actualisé : Work : 32 min, dont 7 min de trafic, 24,5 km par A6.');
  assert.equal(fetchImpl.calls.length, 2);
  assert.ok(gladys.fake.widgetRefreshes.length > 0);
  const gone = ok(
    await gladys.fake.widgetGet('trip', {
      language: 'en',
      settings: { trip: 'ext:x:trip:ffffffff' },
    }),
  );
  assert.match(gone.components[0].text, /no longer exists/);
});
