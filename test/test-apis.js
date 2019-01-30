'use strict'

const childProcess = require('child_process')

const pDefer = require('p-defer')

const weatherAPI = require('@weather-stuff-us/server-api')

const delay = require('./lib/delay')
const getJSON = require('./lib/get-json')
const runTest = require('./lib/test-runner')(__filename)

const schemas = weatherAPI.schemas

const PORT = process.env.PORT || '33000'
const URL_PREFIX = `http://localhost:${PORT}/api/v1`
const LOCATION_PARM = 'location=35.70539,-78.7963'

let serverProcess
let serverProcessPromise

// start the server
runTest(async function startServer (t) {
  const env = Object.assign({}, process.env, { PORT })
  const opts = {
    env,
    encoding: 'utf8',
    windowsHide: true
  }

  const deferred = pDefer()
  serverProcessPromise = deferred.promise
  serverProcess = childProcess.exec('node server', opts, serverCallback)

  // give the server a second to start
  await delay(1000)

  t.pass('server started')
  t.end()

  function serverCallback (error, stdout, stderr) {
    deferred.resolve({ error, stdout, stderr })
  }
})

// api test
runTest(async function astroInfo (t) {
  const result = await getJSON(`${URL_PREFIX}/astro/info?${LOCATION_PARM}`)

  try {
    await schemas.validate(result, schemas.astroInfo)
    t.pass('result structurally sound')
  } catch (err) {
    t.fail(`invalid result: ${err.message}`)
  }

  t.end()
})

// api test
runTest(async function forecastSummary (t) {
  const result = await getJSON(`${URL_PREFIX}/forecast/summary?${LOCATION_PARM}`)

  try {
    await schemas.validate(result, schemas.forecastSummary)
    t.pass('result structurally sound')
  } catch (err) {
    t.fail(`invalid result: ${err.message}`)
  }

  t.end()
})

// api test
runTest(async function forecastTimeSeries (t) {
  const result = await getJSON(`${URL_PREFIX}/forecast/time-series?${LOCATION_PARM}`)

  try {
    await schemas.validate(result, schemas.forecastTimeSeries)
    t.pass('result structurally sound')
  } catch (err) {
    t.fail(`invalid result: ${err.message}`)
  }

  t.end()
})

// api test
runTest(async function locationInfo (t) {
  const result = await getJSON(`${URL_PREFIX}/location/info?${LOCATION_PARM}`)

  try {
    await schemas.validate(result, schemas.locationInfo)
    t.pass('result structurally sound')
  } catch (err) {
    t.fail(`invalid result: ${err.message}`)
  }

  t.end()
})

// stop the server
runTest(async function stopServer (t) {
  serverProcess.kill()

  const { error, stdout, stderr } = await serverProcessPromise

  t.equal(error, null, 'error should be null')
  t.equal(stderr, '', 'stderr should be empty')

  t.ok(stdout.length > 0, 'should be some stdout')

  t.match(stdout, `http server is listening at port ${PORT}`)
  t.match(stdout, `200 GET /api/v1/astro/info`)
  t.match(stdout, '200 GET /api/v1/forecast/summary')
  t.match(stdout, '200 GET /api/v1/forecast/time-series')
  t.match(stdout, '200 GET /api/v1/location/info?location')
  t.match(stdout, 'received signal SIGTERM, shutting down')

  t.end()
})
