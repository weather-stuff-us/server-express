'use strict'

module.exports = handler

const weatherAPI = require('@weather-stuff-us/server-api')
const locationParms = require('../location-parms')

const logger = require('@weather-stuff-us/server-utils').createLogger(__filename)

const MS_IN_AN_HOUR = 1000 * 60 * 60
const MS_IN_A_DAY = MS_IN_AN_HOUR * 24

async function handler (req, res, next) {
  const location = locationParms(req, res)
  if (location == null) return

  const [lat, lon] = location

  const sDate = new Date(Date.now())
  const eDate = new Date(Date.now() + MS_IN_A_DAY * 14)

  try {
    var result = await weatherAPI.astroInfo(lat, lon, sDate, eDate)
  } catch (err) {
    if (err.invalidInputValue) return res.status(400).send({ error: err.message })

    logger.error(`error getting astro info: ${err.message}`)
    return res.status(500).send({ error: `server error` })
  }

  res.send(result)
}
