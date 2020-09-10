  // 实例
const mongoose = require('mongoose')
const rcqrules = new mongoose.Schema({
  pid: { // 项目ID
    type: Number
  },
  bid: { // BUG编号
    type: String
  },
  title: { // BUG标题
    type: String
  },
  edition: { // BUG版本
    type: String
  },
  state: { // 状态
    type: String
  },
  founder: { // 提交者
    type: String
  },
  personliable: { // 归属者
    type: String
  },
  seriousness: { // 重要级
    type: String
  },
  description: { // 描述
    type: String
  },
  createTime: { // 提交时间
    type: Number
  },
  priority: { // BUG优先级
    type: String
  }
}
, {
  connection: 'rcqrules', // 模型名称
  versionKey: false, // 版本锁
})
//语法
// mongoose.model(`文档名称`, Schema)
//实例
mongoose.model(`rcqrules`, rcqrules)