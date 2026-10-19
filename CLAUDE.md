# CLAUDE.md

Project rules for coding assistants (Claude Code reads this file) and for human
contributors.

## What this is

A Gladys Assistant **external integration** that follows the user's usual trips
with the travel time of Google Maps: a Node.js service (Node 22+, ESM, no build
step) that runs in its own sandboxed Docker container and talks to Gladys
through
[`@gladysassistant/integration-sdk`](https://github.com/GladysAssistant/integration-sdk-js),
its only runtime dependency. The trips are typed in plain forms (configuration
buttons, no JSON) and stored with `setConfig` in the Gladys configuration. The
travel times come from the official Google Maps Platform **Routes API**
(`computeRoutes`) with the user's own API key. Transport: cloud.

## Commands

```bash
npm install
npm test                                  # node --test, the built-in runner
node --test test/app.test.js              # one file
DEBUG=gladys-integration-sdk npm test     # with the SDK debug logs
npm run lint                              # ESLint
npm run format:check                      # Prettier, as the CI runs it
npm run format                            # Prettier, fix in place
npx github:GladysAssistant/integration-store . --skip-image-check   # store checks
scripts/build-cover.sh                    # cover.jpg from docs/assets/cover.svg
docs/illustrations/render.sh              # docs/assets/widgets.<lang>.png
node .github/scripts/release.mjs next     # the version the next release would get
```

## Architecture

```
index.js                SDK wiring only (new GladysIntegration + createApp)
src/app.js              every handler, registered before connect(); the clock (tick),
                        readings, errors (refused key, 429, budget), status
src/routes-api.js       the Routes API client: body, field mask, SKU of a request,
                        answer, error classes; the key only in a header
src/usage.js            requests of the month per SKU and their budget, /data/usage.json
src/schedule.js         days, hours ("6-10, 16-20"), the monthly plan, stretched intervals
src/trips.js            the trips: forms -> trips, checks, serialized setConfig writes
src/state.js            last reading, last request, last error of each trip, the 429
                        pause and the fired-event flags, /data/state.json
src/device.js           one device per trip, its features and states
src/events.js           scene trigger payloads and scene action outputs
src/widgets.js          trips, trip and budget dashboard widgets, refresh buttons
src/config.js           configuration (key, interval, threshold, budget, language)
src/i18n.js             runtime texts, en / fr / de / es
src/time.js             timezone helpers (TZ given by the supervisor)
gladys-assistant-integration.json   manifest
docs/{en,fr,de,es}.md   user documentation, re-hosted by the store
docs/illustrations/     generated widget images (render.sh, gen.mjs, render.js)
.github/scripts/release.mjs         version, changelog, bump (tested in test/)
```

## Rules

- **External ids are forever**, and so is every key users store: a trip's
  random identifier (8 hex digits, given at creation, never its name nor its
  addresses), the feature keys (`duration`, `duration_no_traffic`,
  `traffic_delay`, `distance`, `route`), feature `category` / `type` / `unit` /
  `min` / `max`, the keys of `config_schema`, `actions` and their fields, the
  internal config keys (`trips`, `last_language`), the widgets and their
  settings, the widget button actions (`refresh`, `refresh_all`), scene
  triggers (fields, options, variables) and scene actions (fields, outputs).
  `test/structure.test.js` compares them to
  `test/fixtures/discovery.baseline.json`: never update the baseline to make a
  test pass without a documented migration.
- **Category / type pairs**: `duration` / `integer` (minutes),
  `distance-sensor` / `decimal` (km; `integer` has no icon in the front) and
  `text` / `text`, from the SDK constants.
- **`should_poll` stays false**: the integration reads the trips on its own
  clock (a tick every 30 s; a trip is due on its days, in its hours, once its
  interval elapsed since its last request — kept in /data across restarts).
- **Every request is billed.** The SKU of a request decides its price and its
  free usage: `TRAFFIC_AWARE` (car) is Pro, two-wheeler is Enterprise, the
  other modes are Essentials. Never add an Enterprise field to the field mask
  (`travelAdvisory.tollInfo`, traffic on polylines) nor a Pro feature to an
  Essentials trip without saying so in the docs. A button or an action never
  reads a trip read less than a minute ago.
- **The budget** of a SKU is `budget_percent` % of its free usage, counted per
  UTC month in `/data/usage.json`; the plan stretches the intervals of a SKU
  whose trips would spend more than 90 % of it.
- **The API key** is a `secret`: never logged, never in a URL, never in /data,
  never in a scene variable. Never log the addresses either (the trip name is
  enough).
- **Scene events**: one per transition (route changed at a scheduled reading;
  budget at 80 % then 100 %, once a month; key refused, once until it works);
  never as the consequence of an action or a button.
- **The registry** is written through `setConfig` one change at a time, and
  applied in memory only once Gladys saved it.
- **Gladys does not pass DEBUG / LOG_LEVEL to the container**: never tell a
  store user to set them; "List the trips" is the diagnostic button.
- **The container rootfs is read-only.** Write only under `/data`.
- **Four languages.** Every user-facing text (manifest, runtime messages in
  `src/i18n.js`, `docs/*.md`, README) exists in English, French, German and
  Spanish. `test/i18n.test.js` checks it.
- **Widget images.** After any change to the content of a widget, run
  `docs/illustrations/render.sh` again and look at the four PNG files.
- **Versions belong to the Release workflow**: never edit `version` in
  `package.json`, the lockfile or the manifest, nor the `docker_image` tag.
  The version stays below 1.0.0 until the maintainer runs the Release workflow
  with `release-as: 1.0.0`.
- **Changelog.** Never edit CHANGELOG.md by hand, it is generated at the
  release. Write the PR title as the line the user will read.
- **Commits and PR titles** follow Conventional Commits, in English: `feat` ->
  minor, `fix` / `perf` -> patch, `!` or `BREAKING CHANGE:` -> major (minor
  below 1.0.0); `docs`, `chore`, `ci`, `test`, `style`, `refactor`, `build`
  release nothing.
- **Manifest.** Texts are objects `{ "en", "fr", "de", "es" }`; the catalog
  `description` holds 10 to 100 characters per language; the file stays under
  100 KB; at most 10 configuration actions. A field older cores do not know
  needs a higher `gladys_version` minimum (see `src/constants.js` of the
  integration-store): widgets and scenes need `>=5.1.0`; a widget button with a
  form would need `>=5.2.0` (none here). Transport: `["cloud"]`.
- **Forum drafts** (`.github/forum-*.md`) are never committed.
- **Style.** Prettier formats, ESLint catches mistakes. Comments explain why,
  in English. Tests never touch the network.
