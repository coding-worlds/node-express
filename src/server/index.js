const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const mongoose = require('mongoose')
// 引入history模块
const history = require('connect-history-api-fallback')

// 引入配置
const config = require('../../config')

// 加载所有mongoose.model
require('./common/load.model')


const app = express()
// 连接数据库
mongoose.Promise = require('bluebird') // global.Promise
mongoose.connect(config.backend.mongo.uri, config.backend.mongo.options, (err) => {
  if (err) {
    console.log('连接数据库失败')
  } else {
    console.log(`服务已经启动，监听端口${config.backend.mongo.uri}`)
    require('./common/admin') // 创建admin
  }
})

// 引入history模式让浏览器进行前端路由页面跳转
app.use(history())

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(path.join(__dirname, '../static')))

// 引入路由列表
const router = require('./routes')

// 拦截token
// app.use(require('./common/token').verifyToken)

// 访问api
router(app)

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  console.log(err)
  res.send(err.message)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// 设置监听端口
const SERVER_PORT = config.backend.port
app.listen(SERVER_PORT, () => {
  console.info(`服务已经启动，监听端口${SERVER_PORT}`)
})
// export default app
