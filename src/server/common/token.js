const jwt = require('jsonwebtoken') // 使用jwt签名
const visa = 'RCQ_analyze' // 签证
const whitelist = ['/api/login'] // 白名单
exports.createToken = (user) => {
  const token = jwt.sign(user, visa,{
    expiresIn: 60 * 5 // 授权失效5分钟
  })
  console.log(token)
  return token
}


exports.verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  // 判断是否为白名单api
  if (whitelist.includes(req.url)) {
    next()
  } else {
    if (token) {
      jwt.verify(token, visa, function(err, decoded) {
        if (err) {
          return res.json({ 
            code: -1,
            message: '无效的token'
          }) 
        } else {
          // 如果验证通过，在req中写入解密结果
          req.decoded = decoded
          next() //继续下一步路由
        }
      })
    } else {
      return res.status(403).send({
        code: -1,
        message: '没有找到token' 
      })
    }
  }
}