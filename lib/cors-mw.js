'use strict'

// enable CORS

module.exports = corsMW

const AllowHeaders = [
  'Origin',
  'X-Requested-With',
  'Content-Type',
  'Accept'
].join(', ')

function corsMW (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', AllowHeaders)
  next()
}
