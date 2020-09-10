const mongoose = require('mongoose')
const rcqrules = mongoose.model('rcqrules')
function dispose(array, obj, type, key, result, types){ // 二次处理数据
  array.forEach(item => {
    if (item[type] === key || type === 'total') {
      obj.totalNum++
      if (item.state === 'Submitted') {
        obj.state.Submitted++
      } else if (item.state === 'Assigned') {
        obj.state.Assigned++
      } else if (item.state === 'Opened') {
        obj.state.Opened++
      }  else if (item.state === 'Resolved') {
        obj.state.Resolved++
      }  else if (item.state === 'Released') {
        obj.state.Released++
      }  else if (item.state === 'Failed') {
        obj.state.Failed++
      }  else if (item.state === 'Monitored') {
        obj.state.Monitored++
      }  else if (item.state === 'Postponed') {
        obj.state.Postponed++
      }  else if (item.state === 'Closed') {
        obj.state.Closed++
      }
      if (item.seriousness === '1-Critical') {
        obj.BUGGrade['1-Critical']++
      } else if (item.seriousness === '2-Important') {
        obj.BUGGrade['2-Important']++
      } else if (item.seriousness === '3-Secondary') {
        obj.BUGGrade['3-Secondary']++
      } else if (item.seriousness === '4-Normal') {
        obj.BUGGrade['4-Normal']++
      } else if (item.seriousness === '5-Low') {
        obj.BUGGrade['5-Low']++
      }
      if (item.priority === '1-Resolve Immediately') {
        obj.BUGPriority['1-Resolve Immediately']++
      } else if (item.priority === '2-Give High Attention') {
        obj.BUGPriority['2-Give High Attention']++
      } else if (item.priority === '3-Normal Queue') {
        obj.BUGPriority['3-Normal Queue']++
      } else if (item.priority === '4-Low Priority') {
        obj.BUGPriority['4-Low Priority']++
      }
    }
  })
  obj.resolvedNum = obj.state.Resolved + obj.state.Released +obj.state.Closed
  obj.unsolvedNum = obj.totalNum - obj.resolvedNum
  if(types) {
    const obj1 = {}
    obj1[key] = obj
    result[types].push(obj1)
  }
}
function analyze (data) { // 数据的初步处理
  let editions = new Set()
  let personliables = new Set()
  var obj = {
    totalNum: 0,
    unsolvedNum: 0,
    resolvedNum: 0,
    state: {
      Submitted: 0,
      Assigned: 0,
      Opened: 0,
      Resolved: 0,
      Released: 0,
      Failed: 0,
      Monitored: 0,
      Postponed: 0,
      Closed: 0
    },
    BUGGrade: {
      '1-Critical': 0,
      '2-Important': 0,
      '3-Secondary': 0,
      '4-Normal': 0,
      '5-Low': 0
    },
    BUGPriority: {
      '1-Resolve Immediately': 0,
      '2-Give High Attention': 0,
      '3-Normal Queue': 0,
      '4-Low Priority': 0
    }
  }
  let result = new Object(obj)
  result.editions = []
  result.personliables = []
  data.forEach(item => {
    editions.add(item.edition)
    personliables.add(item.personliable)
  })
  dispose(data, result, 'total', '', result)
  editions.forEach((edition) => {
    const obj = {
      totalNum: 0,
      unsolvedNum: 0,
      resolvedNum: 0,
      state: {
        Submitted: 0,
        Assigned: 0,
        Opened: 0,
        Resolved: 0,
        Released: 0,
        Failed: 0,
        Monitored: 0,
        Postponed: 0,
        Closed: 0
      },
      BUGGrade: {
        '1-Critical': 0,
        '2-Important': 0,
        '3-Secondary': 0,
        '4-Normal': 0,
        '5-Low': 0
      },
      BUGPriority: {
        '1-Resolve Immediately': 0,
        '2-Give High Attention': 0,
        '3-Normal Queue': 0,
        '4-Low Priority': 0
      }
    }
    dispose(data, obj, 'edition', edition, result, 'editions')
  })
  personliables.forEach((personliable) => {
    const obj = {
      totalNum: 0,
      unsolvedNum: 0,
      resolvedNum: 0,
      state: {
        Submitted: 0,
        Assigned: 0,
        Opened: 0,
        Resolved: 0,
        Released: 0,
        Failed: 0,
        Monitored: 0,
        Postponed: 0,
        Closed: 0
      },
      BUGGrade: {
        '1-Critical': 0,
        '2-Important': 0,
        '3-Secondary': 0,
        '4-Normal': 0,
        '5-Low': 0
      },
      BUGPriority: {
        '1-Resolve Immediately': 0,
        '2-Give High Attention': 0,
        '3-Normal Queue': 0,
        '4-Low Priority': 0
      }
    }
    dispose(data, obj, 'personliable', personliable, result, 'personliables')
  })
  return result
}
function findData (condition) { // 筛选数据
  return new Promise((resolve, reject) =>{
    var obj = {}
    for(var i in condition) {
      if (i !== 'pid') {
        if (condition[i].length !== 0 && condition[i].constructor === Array) {
          if (i === 'createTime') {
            obj[i] = { '$gt': parseInt(condition[i][0]), '$lt': parseInt(condition[i][1])}
          } else {
            obj[i] = {'$in': condition[i]}
          }
        }
      } else {
        obj[i] = condition[i]
      }   
    }
    console.log(condition, obj)
    if (Object.keys(obj).length === 0) {
      return reject({code: 403, 'result': 'data  error'})
    }
    rcqrules.find(obj, function (err, docs) {
      if (err) {
        console.log('findData err', err)
        reject({code: 403, 'result': err})
      } else {
        resolve({code: 200, 'result': docs})
      }
    })
  })
}
exports.analyze = async (req, res) => {   // 统计数据
  try {
    const data = await findData(req.body)
    if (data.code === 200) {
      const result = analyze(data.result)
      res.send({code: 200, 'result': result, lists: data.result})
    } else {
      res.status(data.code).send(data)
    }
  } catch (err) {
    res.status(500).send(err)
  }
}
