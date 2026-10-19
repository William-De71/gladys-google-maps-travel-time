# Changelog

All notable changes to this integration are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions
follow [Semantic Versioning](https://semver.org/). This file is generated at
each release from the Conventional Commits: do not edit it by hand.

## [0.1.0] - 2026-10-19

### Added

- Trips declared from the configuration with plain forms ("Add a trip", "Edit a trip", "Remove a trip", "List the trips"), no JSON: name, from and to (address, place, plus code or coordinates), travel mode (car, motorcycle / scooter, bicycle, walking, public transport), avoid tolls, motorways and ferries, days and hours of reading, own interval and delay threshold.
- One device per trip through the Google Maps Platform Routes API: travel time (with live traffic by car and two-wheeler), time without traffic, traffic delay, distance and main roads.
- Readings on the integration's own clock, only on the days and hours of each trip; a monthly budget per request type (Essentials, Pro, Enterprise), 90 % of Google's free usage by default, with intervals stretched rather than going over; "Test the API key" button.
- Scene triggers: the route of a trip changes, the monthly budget is almost or fully used, Google refuses the API key.
- Scene actions: compute a route between any two places now, read a trip now; both return travel time, delay, distance, route and a summary sentence.
- Dashboard widgets: travel times of the trips (with delay badges, Google Maps links and a refresh button), one trip, requests of the month.
- English, French, German and Spanish everywhere: settings, devices, widgets, scenes and documentation.

[0.1.0]: https://github.com/William-De71/gladys-google-maps-travel-time/releases/tag/v0.1.0
