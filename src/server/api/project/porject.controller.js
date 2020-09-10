const mongoose = require('mongoose')
const ProjectSchema = mongoose.model('Project')

// 数据库中不能直接插入数据，只能往集合(collections)中插入数据。不需要专门创建集合，只 需要写点语法插入数据就会创建集合：
/**
 * 创建项目
 */
exports.createProject = async (req, res) => {
  // req请求
  // res响应
  const title = req.body.title
  const des = req.body.description
  try {
    if (title === '' || des === '') {
      return res.status(500).send('保存失败')
    }
    const result = await ProjectSchema.findOne({ title: title })
    if (result) return res.status(500).send('项目名重复')
    const pid = await ProjectSchema.find({ 'pid': { "$gte": -1}})
    const project = new ProjectSchema({
      title: title,
      pid: pid.length === 0 ? 1 : pid[pid.length - 1].pid + 1,
      bugNumber: 0,
      createTime: Date.parse(new Date()),
      updateTime: Date.parse(new Date()),
      updateNumber: 0,
      isData: false,
      description: des
    })
    project.save((err, doc) => {
      const result = {
        title: doc.title,
        pid: doc. pid,
        bugNumber: doc.bugNumber,
        createTime: doc.createTime,
        updateTime: doc.updateTime,
        updateNumber: doc.updateNumber,
        isData: doc.isData,
        description: doc.description
      }
      err ? res.sendStatus(500) : res.status(200).send(result)
    })
  } catch (err) {
    return res.sendStatus(500)
  }
}

/**
 * 删除指定项目
 */
exports.deleteProject = async (req, res) => {
  //查找并删除
  // Model.findByIdAndRemove(id, [options], [callback])
  // Model.findOneAndRemove(conditions, [options], [callback])
  const pid = req.params.id
  try {
    await ProjectSchema.findOneAndRemove({ pid: pid }, (err, doc) => {
      err ? res.sendStatus(500) : res.sendStatus(200)
    })
  } catch (err) {
    return res.sendStatus(500)
  }
}

/**
 * 修改指定项目
 */
exports.updateProject = async (req, res) => {
  //查找并更新
  // Model.findByIdAndUpdate(id, [update], [options], [callback])
  // Model.findOneAndUpdate([conditions], [update], [options], [callback])
  const pid = req.params.id
  const args = {
    title: req.body.title,
    description: req.body.description
  }
  try {
    await ProjectSchema.findOneAndUpdate({ pid: pid }, args, {new: true}, (err) => {
      err ? res.sendStatus(500) : res.sendStatus(200)
    })
  } catch (err) {
    return res.sendStatus(500)
  }
}

/**
 * 获取指定项目
 */
exports.getOneProject = async (req, res) => {
  const pid = req.params.id
  try {
    const result = await ProjectSchema.findOne({ pid: pid }, { '_id': 0 })
    return res.status(200).send(result)
  } catch (err) {
    return res.sendStatus(500)
  }
}

/**
 * 获取所有项目列表
 */
exports.getAllProject = async (req, res) => {
  try {
    await ProjectSchema.find({}, { '_id': 0 }, (err, docs) => {
      err ? res.sendStatus(500) : res.status(200).send(docs)
    })
  } catch (error) {
    return res.sendStatus(500)
  }
}
