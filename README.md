@weather-stuff-us/server-express - express server for weather-stuff-us
================================================================================

An express server providing access to weather data via the
[National Weather Service][].

Weather data is only available for locations in the United States.

[National Weather Service]: https://forecast-v3.weather.gov/documentation


usage
================================================================================

Start the server one of:

    node server.js
    npm start

See https://github.com/weather-stuff-us/server-utils for details on
environment variables that change logging behavior.

The server will be started on the port specified by the `PORT` environment
variable, or 3000 if not specified.


license
================================================================================

This package is licensed under the MIT license.  See the [LICENSE.md][] file
for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md][] file for more information.


[LICENSE.md]: LICENSE.md
[CONTRIBUTING.md]: CONTRIBUTING.md