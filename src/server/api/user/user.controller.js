const _ = require('lodash')
const mongoose = require('mongoose')
const User = mongoose.model('User')
exports.register = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  try {
    if (username === '' || password === '') {
      return res.status(500).send('用户名或者密码不能为空')
    }
    const result = await User.findOne({username: username})
    if (result) {
      return res.status(500).send('用户名已经被注册')
    }
    const user = new User({
      username: username,
      password: password
    })
    user.save()
    return res.sendStatus(200)
  } catch (err) {
    return ctx.sendStatus(500)
  }
}