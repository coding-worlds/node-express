const express = require('express')
const router = express.Router()
const controller = require('./porject.controller')
router.post('/create', controller.createProject)
router.delete('/:id', controller.deleteProject)
router.put('/:id', controller.updateProject)
router.get('/list', controller.getAllProject)
router.get('/:id', controller.getOneProject)
module.exports = router