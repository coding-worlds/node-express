/**
 * Main application routes
 */

'use strict'

module.exports = function (app) {
  app.use('/api/login', require('./api/login'))
  app.use('/api/user', require('./api/user'))
  app.use('/api/file', require('./api/file'))
  app.use('/api/project', require('./api/project'))
  app.use('/api/analyze', require('./api/analyze'))
}