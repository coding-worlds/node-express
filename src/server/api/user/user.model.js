/**
 * 用户表
 */
'use strict'

const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  // userid: Number, // 用户id
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  } // 用户密码
})
mongoose.model('User', UserSchema)
