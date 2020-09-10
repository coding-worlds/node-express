'use strict'
const express = require('express')
const router = express.Router()
const controller = require('./file.controller')
var path = require('path')
const multer = require('multer')
// const upload = multer({ dest: 'src/static/uploads/' })
const upload = multer({ dest: path.join(__dirname, `../../static/uploads/`) })
router.get('/downloadFile', controller.downloadFile)
router.post('/upload/:id', upload.single('my_file'), controller.uploadFile)
router.put('/append/:id', controller.appendFile)
module.exports = router
