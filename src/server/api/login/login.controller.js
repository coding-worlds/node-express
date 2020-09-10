const mongoose = require('mongoose')
const User = mongoose.model('User')
const createToken = require('../../common/token').createToken
exports.login = async (req, res, next) => {
  const userInfo = {
    username: req.body.username,
    password: req.body.password
  }
  try {
    if (userInfo.username === '' || userInfo.password === '') {
      return res.status(500).send('用户名或者密码不能为空')
    }
    const result = await User.findOne(userInfo)
    if (result) {
      userInfo._id = result._id
      console.log(userInfo)
      userInfo.token = createToken(userInfo)
      return res.status(200).send(userInfo)
    } else {
      return res.status(500).send('无此用户')
    }
  } catch ( err) {
    return res.sendStatus(500)
  }
}