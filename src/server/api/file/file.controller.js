var XLSX = require("xlsx");
var path = require('path')
var fs = require('fs')
const mongoose = require('mongoose')
const rcqrules = mongoose.model('rcqrules')
function readExcel(pathStr) {
  try {
    const str = pathStr || path.join(__dirname, `../../static/uploads/queryresult.xls`)
    const workbook = XLSX.readFile(str);
    // 获取 Excel 中所有表名
    const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
    // 根据表名获取对应某张表
    const worksheet = workbook.Sheets[sheetNames[0]];
    const headers = {};
    // 获取表头
    const H = ['ID', '标题', '状态', '提交人', '责任人', '提交日期', '严重性', '优先级']
    for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
      const cellName = String.fromCharCode(i);
      const cell = worksheet[cellName + '1'];
      if (!cell) {
        break;
      }
      if (H.includes(cell.v)) {
        headers[cellName] = cell.v;
      }
    }
    const data = [];
    const keys = Object.keys(worksheet);
    keys
      // 过滤以 ! 开头的 key
      .filter(k => k[0] !== '!')
      // 遍历所有单元格
      .forEach(k => {
        // 如 A11 中的 A
        let col = k.substring(0, 1);
        // 如 A11 中的 11
        let row = parseInt(k.substring(1));
        // 当前单元格的值
        let value = worksheet[k].v.trim();
        if (value === '') {
          return;
        }
        // 保存字段名
        if (row === 1) {
          return;
        }
        row -= 2;
        // 解析成 JSON
        if (!data[row]) {
          data[row] = {};
        }
        // 不在所需要的列名里
        const cellName = headers[col];
        if (!cellName) {
          return;
        }
        data[row][cellName] = value;
      });
    const result = [], errResult = []
    data.forEach(item => {
      if (Object.keys(item).length === H.length) {
        result.push(item)
      } else {
        H.forEach(k => {
          item[k] = item[k] || ''
        })
        errResult.push(item)
      }
    })
    return {
      error: 0,
      result,
      errResult
    }
  } catch (err) {
    console.log('readExcel', err)
    return {
      error: 1,
      result: 'data formatting error!'
    }
  }
}
function writeExcel(data) {   // 写入表格
  try {
    // var _headers = ['id', 'name', 'age', 'country', 'remark']  需要的数据格式
    if (data.length < 1) {
      return
    }
    var _headers = []
    for (var key in data[0]) {
      _headers.push(key)
    }
    var _data = data
    // var _data = [ { id: '1', 需要的数据格式
    //                 name: 'test1',
    //                 age: '30',
    //                 country: 'China',
    //                 remark: 'hello' },
    //               { id: '2',
    //                 name: 'test2',
    //                 age: '20',
    //                 country: 'America',
    //                 remark: 'world' },
    //               { id: '3',
    //                 name: 'test3',
    //                 age: '18',
    //                 country: 'Unkonw',
    //                 remark: '???' } ];
    // 为 _headers 添加对应的单元格位置
    // [ { v: 'id', position: 'A1' },
    //   { v: 'name', position: 'B1' },
    //   { v: 'age', position: 'C1' },
    //   { v: 'country', position: 'D1' },
    //   { v: 'remark', position: 'E1' } ]
    var headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
      // 转换成 worksheet 需要的结构
      // { A1: { v: 'id' },
      //   B1: { v: 'name' },
      //   C1: { v: 'age' },
      //   D1: { v: 'country' },
      //   E1: { v: 'remark' } }
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
    var data = _data
      // 匹配 headers 的位置，生成对应的单元格数据
      // [ [ { v: '1', position: 'A2' },
      //     { v: 'test1', position: 'B2' },
      //     { v: '30', position: 'C2' },
      //     { v: 'China', position: 'D2' },
      //     { v: 'hello', position: 'E2' } ],
      //   [ { v: '2', position: 'A3' },
      //     { v: 'test2', position: 'B3' },
      //     { v: '20', position: 'C3' },
      //     { v: 'America', position: 'D3' },
      //     { v: 'world', position: 'E3' } ],
      //   [ { v: '3', position: 'A4' },
      //     { v: 'test3', position: 'B4' },
      //     { v: '18', position: 'C4' },
      //     { v: 'Unkonw', position: 'D4' },
      //     { v: '???', position: 'E4' } ] ]
      .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
      // 对刚才的结果进行降维处理（二维数组变成一维数组）
      // [ { v: '1', position: 'A2' },
      //   { v: 'test1', position: 'B2' },
      //   { v: '30', position: 'C2' },
      //   { v: 'China', position: 'D2' },
      //   { v: 'hello', position: 'E2' },
      //   { v: '2', position: 'A3' },
      //   { v: 'test2', position: 'B3' },
      //   { v: '20', position: 'C3' },
      //   { v: 'America', position: 'D3' },
      //   { v: 'world', position: 'E3' },
      //   { v: '3', position: 'A4' },
      //   { v: 'test3', position: 'B4' },
      //   { v: '18', position: 'C4' },
      //   { v: 'Unkonw', position: 'D4' },
      //   { v: '???', position: 'E4' } ]
      .reduce((prev, next) => prev.concat(next))
      // 转换成 worksheet 需要的结构
      //   { A2: { v: '1' },
      //     B2: { v: 'test1' },
      //     C2: { v: '30' },
      //     D2: { v: 'China' },
      //     E2: { v: 'hello' },
      //     A3: { v: '2' },
      //     B3: { v: 'test2' },
      //     C3: { v: '20' },
      //     D3: { v: 'America' },
      //     E3: { v: 'world' },
      //     A4: { v: '3' },
      //     B4: { v: 'test3' },
      //     C4: { v: '18' },
      //     D4: { v: 'Unkonw' },
      //     E4: { v: '???' } }
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
    // 合并 headers 和 data
    var output = Object.assign({}, headers, data);
    // 获取所有单元格的位置
    var outputPos = Object.keys(output);
    // 计算出范围
    var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    // 构建 workbook 对象
    var wb = {
      SheetNames: ['mySheet'],
      Sheets: {
        'mySheet': Object.assign({}, output, { '!ref': ref })
      }
    };
    // 导出 Excel
    XLSX.writeFile(wb, '../../static/outputs/output.xlsx');
  } catch (err) {
    console.log('writeFile', err)
    return res.sendStatus(500)
  }
}
function RCQProcessing(data, pid) {   // RCQ数据处理
  try {
    let result = []
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      let edition = ''
      let createTime = ''
      if (item['标题'].match(/\d+(\.\d{1,2}){3}/)) {
        edition = item['标题'].replace(/\s+/, '').match(/\d+(\.\d{1,2}){3}/)[0]
      } else {
        edition = '0.0.0.0'
      }
      let time = item['提交日期'].replace(/[\u2E80-\u9FFF]/g, ',').split(",")
      if (item['提交日期'].match(/\u4e0b\u5348/) && parseInt(time[5]) !== 12) {
        createTime = time[0] + '-' + time[1] + '-' + time[2] + ' ' + (parseInt(time[5]) + 12) + ':' + ':' + time[6] + ':' + time[7]
      } else {
        createTime = time[0] + '-' + time[1] + '-' + time[2] + ' ' + time[5] + ':' + time[6] + ':' + time[7]
      }
      createTime = new Date(createTime).getTime()
      if (isNaN(createTime)) {
        console.log(createTime, item)
        continue
      }
      const obj = new rcqrules({
        pid: pid,
        bid: item['ID'],
        title: item['标题'],
        edition: edition,
        state: item['状态'],
        founder: item['提交人'],
        personliable: item['责任人'],
        seriousness: item['严重性'],
        description: item['标题'],
        createTime: createTime,
        priority: item['优先级'],
      })
      result.push(obj)
    }
    return result
  } catch (err) {
    console.log('RCQProcessing:', err)
    return res.sendStatus(500)
  }
}
function removeAny(pid) { // 清空对应项目表
  return new Promise((resolve, reject) => {
    try {
      if (!pid) {
        reject({ error: 1, result: 'Project ID does not exist!' })
      }
      rcqrules.remove({ pid: pid }, (err) => {
        if (err) {
          console.log('remove() failed.');
          reject({ error: 1, result: err })
        } else {
          console.log('---remove()---------------------------------------');
          resolve({ error: 0, 'result': 'suc' })
        }
      })
    } catch (err) {
      console.log('removeAny', err)
      reject({ error: 1, result: err })
    }
  })
}
function insertMany(data) {  // 保存数据
  return new Promise((resolve, reject) => {
    try {
      rcqrules.create(data, (err) => {
        if (err) {
          console.log('create() failed.');
          reject({ error: 1, result: err })
        } else {
          console.log('---create()---------------------------------------');
          console.log('All rcqrules devices saved.insertMany() saved.');
          resolve({ error: 0, 'result': 'suc' })
        }
      })
    } catch (err) {
      console.log('insertMany', err)
      reject({ error: 1, result: err })
    }
  })
}
exports.uploadFile = async (req, res) => {  // 上传文件
  try {
    const pid = req.params.id
    const file_path = path.join(__dirname, `../../static/uploads/`)
    fs.renameSync(file_path + req.file.filename, file_path + 'queryresult.xls')
    const data = readExcel()
    if (data.error === 0) {
      const result = RCQProcessing(data.result, pid)
      const r = await removeAny(pid)
      if (r.error) {
        return res.status(403).send(r)
      }
      const s = await insertMany(result)
      if (s.error) {
        return res.status(403).send(s)
      }
      res.send(data.errResult)
    } else {
      res.status(403).send(data)
    }
  } catch (err) {
    return res.status(403).send(err)
  }
}
exports.appendFile = async (req, res) => {
  try {
    const pid = req.params.id;
    const data = req.body;
    const result = RCQProcessing(data, pid);
    const s = await insertMany(result);
    if (s.error) {
      return res.status(403).send(s);
    }
    res.send('ok');
  } catch (err) {
    return res.status(403).send(err)
  }
}
exports.downloadFile = (req, res) => {  // 下载文件
  const data = readExcel(path)
  writeExcel(data)
  const file_path = path.join(__dirname, `../../static/outputs/`)
  const filename = 'output.xlsx'
  const filePath = file_path + filename;  // 文件存储的路径
  res.download(filePath)
}