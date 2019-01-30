'use strict'

module.exports = {
  mount
}

const compression = require('compression')

const requestIdMW = require('../request-id-mw')
const requestLoggerMW = require('../request-logger-mw')

const logger = require('@weather-stuff-us/server-utils').createLogger(__filename)

// manually require handlers for check-deps, etc
require('./GET-astro-info')
require('./GET-forecast-summary')
require('./GET-forecast-time-series')
require('./GET-location-info')

const endpoints = [
  { method: 'GET', uri: 'astro/info' },
  { method: 'GET', uri: 'forecast/summary' },
  { method: 'GET', uri: 'forecast/time-series' },
  { method: 'GET', uri: 'location/info' }
]

function mount (app) {
  // add compression where needed
  const compressor = compression()

  for (let endpoint of endpoints) {
    const method = endpoint.method.toLowerCase()
    const uri = `/api/v1/${endpoint.uri}`

    const handler = require(`./${endpoint.method}-${endpoint.uri.replace(/\//g, '-')}`)
    app[method](uri, requestIdMW, requestLoggerMW, compressor, handler)
    logger.info(`added http endpoint ${endpoint.method} ${uri}`)
  }
}
