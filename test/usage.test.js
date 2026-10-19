// The monthly counter of billable requests, per SKU, kept across restarts.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { createUsage, budgetOf } from '../src/usage.js';
import { dataPaths, silent } from './helpers/fixtures.js';

test('budgets: a share of the free usage of each SKU', () => {
  assert.deepEqual(
    ['essentials', 'pro', 'enterprise'].map((sku) => budgetOf(sku, 90)),
    [9000, 4500, 900],
  );
  assert.equal(budgetOf('pro', 200), 10000);
  assert.equal(budgetOf('enterprise', 0.01), 1);
});

test('counts per SKU, survives a restart, starts again each month', () => {
  const { usage: path } = dataPaths();
  let time = Date.parse('2026-10-31T23:00:00Z');
  const make = () => createUsage({ path, getPercent: () => 90, now: () => time, logger: silent });
  const first = make();
  first.record('pro');
  first.record('pro');
  first.record('essentials');
  const again = make();
  assert.deepEqual(
    [again.used('pro'), again.used('essentials'), again.used('enterprise')],
    [2, 1, 0],
  );
  assert.equal(again.remaining('pro'), 4498);
  assert.equal(again.exhausted('pro'), false);
  time = Date.parse('2026-11-01T00:00:01Z');
  assert.equal(again.used('pro'), 0);
  assert.equal(again.month(), '2026-11');
});

test('an unreadable file starts from zero', () => {
  const { usage: path } = dataPaths();
  writeFileSync(path, '{ nope');
  const usage = createUsage({ path, getPercent: () => 90, logger: silent });
  assert.equal(usage.used('pro'), 0);
});
