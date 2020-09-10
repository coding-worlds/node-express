// 查找是否表中有admin用户
const mongoose = require('mongoose')
const User = mongoose.model('User')
const createAdmin = async () => {
  const result = await User.findOne({username: 'admin'})
  if (result) {
    console.log('---- mongo has created admin. could use admin----')
    return
  }
  const admin = new User({
    username: 'admin',
    password: 'admin'
  })
  admin.save()
  console.log('---- create admin ----')
}
createAdmin()