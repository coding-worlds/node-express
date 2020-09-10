const express = require('express')
const router = express.Router()
const controller = require('./analyze.controller')
router.post('/analyze', controller.analyze)
module.exports = router 