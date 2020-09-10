'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./user.controller')
router.post('/register', controller.register)
module.exports = router
