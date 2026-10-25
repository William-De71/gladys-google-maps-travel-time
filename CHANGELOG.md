# Changelog

All notable changes to this integration are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions
follow [Semantic Versioning](https://semver.org/). This file is generated at
each release from the Conventional Commits: do not edit it by hand.

## [0.3.0] - 2026-10-25

### Added

- require Gladys 5.3 and declare catalog keywords ([834bb17](https://github.com/William-De71/gladys-google-maps-travel-time/commit/834bb1756aa76e3212ee7ae8714cb76d7ba7c303))

## [0.2.0] - 2026-10-25

### Added

- list the integration under the new Transport shelf of the catalog ([17a37a2](https://github.com/William-De71/gladys-google-maps-travel-time/commit/17a37a2956376cc8bf0728daeeb22f75be3fc50c))

## [0.1.1] - 2026-10-24

### Security

- **security:** build the image on Node.js 24.22.1 or later ([803b316](https://github.com/William-De71/gladys-google-maps-travel-time/commit/803b3165ee45decbf5d71fafb30451592bec518f))

## [0.1.0] - 2026-10-19

### Added

- Trips declared from the configuration with plain forms ("Add a trip", "Edit a trip", "Remove a trip", "List the trips"), no JSON: name, from and to (address, place, plus code or coordinates), travel mode (car, motorcycle / scooter, bicycle, walking, public transport), avoid tolls, motorways and ferries, days and hours of reading, own interval and delay threshold.
- One device per trip through the Google Maps Platform Routes API: travel time (with live traffic by car and two-wheeler), time without traffic, traffic delay, distance and main roads.
- Readings on the integration's own clock, only on the days and hours of each trip; a monthly budget per request type (Essentials, Pro, Enterprise), 90 % of Google's free usage by default, with intervals stretched rather than going over; "Test the API key" button.
- Scene triggers: the route of a trip changes, the monthly budget is almost or fully used, Google refuses the API key.
- Scene actions: compute a route between any two places now, read a trip now; both return travel time, delay, distance, route and a summary sentence.
- Dashboard widgets: travel times of the trips (with delay badges, Google Maps links and a refresh button), one trip, requests of the month.
- English, French, German and Spanish everywhere: settings, devices, widgets, scenes and documentation.

[0.3.0]: https://github.com/William-De71/gladys-google-maps-travel-time/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/William-De71/gladys-google-maps-travel-time/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/William-De71/gladys-google-maps-travel-time/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/William-De71/gladys-google-maps-travel-time/releases/tag/v0.1.0
