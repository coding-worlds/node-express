// 实例
const mongoose = require('mongoose')
const ProjectSchema = new mongoose.Schema({
  title: { // 项目标题
    type: String
  },
  pid: { // 项目ID
    type: Number
  },
  bugNumber: { // bug数量
    type: Number
  },
  createTime: { // 创建时间 
    type: String
  },
  updateTime : { // 更新时间
    type: String
  },
  updateNumber : { // 更新数量
    type: Number
  },
  isData : { // 是否有数据
    type: Boolean
  },
  description : { // 项目描述
    type: String,
    required: true
  }
}, {
    connection: 'Project', // 模型名称
    versionKey: false // 版本锁
    // _id: false  // ObjectId
  }
)
//语法
// mongoose.model(`文档名称`, Schema)
//实例
mongoose.model(`Project`, ProjectSchema)