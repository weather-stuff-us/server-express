'use strict'

module.exports = handler

const weatherAPI = require('@weather-stuff-us/server-api')
const locationParms = require('../location-parms')

const logger = require('@weather-stuff-us/server-utils').createLogger(__filename)

async function handler (req, res, next) {
  const location = locationParms(req, res)
  if (location == null) return

  const [lat, lon] = location

  try {
    var result = await weatherAPI.locationInfo(lat, lon)
  } catch (err) {
    if (err.invalidInputValue) return res.status(400).send({ error: err.message })

    logger.error(`error getting location info: ${err.message}`)
    return res.status(500).send({ error: `server error` })
  }

  res.send(result)
}
