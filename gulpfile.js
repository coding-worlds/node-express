var gulp = require('gulp')
var del = require('del')
var path = require('path')
var exec = require('child_process').exec
var GulpSSH = require('gulp-ssh')
var runSequence = require('gulp-sequence')

var remothost = {
  config: {
    host: '192.168.22.179',
    port: 22,
    username: 'root',
    password: '123456'
  },
  dir: {
    path: '/www/ErrorAnalyze/src/server'
  },
  rm: [
    `rm -rf /www/ErrorAnalyze/src/server/`,
  ],
  start: [
    `pm2 start /www/ErrorAnalyze/src/server/index.js`
  ]
}
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: remothost.config
})

// 1.打包前端代码
gulp.task('build:client', function (cb) {
  exec('npm run build', function (err) {
    if (err) return cb(err) // 返回 error
    cb() // 完成 task
  })
})
// 2. 删除server端views目录下的代码
gulp.task('clean:views', function (cb) {
  return del(['./src/server/views/**/*'], cb) // 匹配server/views/内所有文件
})
// 3.copy dist 到 server端views目录下
gulp.task('copy:views', function (cb) {
  return gulp.src('./dist/**/*')
    .pipe(gulp.dest('./src/server/views'))
})
// // 4.压缩server代码
// gulp.task('build:zipserver', function (cb) {
//   return gulp.src('./server/**')
//     .pipe(zip('server.zip'))
//     .pipe(gulp.dest('./zipfiles'))
// })
// 5.上传服务器
gulp.task('uploadSSH', function (cb) {
  return gulp.src('./src/server/**')
  .pipe(gulpSSH.dest(remothost.dir.path))
})
// 6.删除服务器先有代码
gulp.task('cleanSSH', function (cb) {
  return gulpSSH.shell(remothost.rm)
})
// 7.启动项目
gulp.task('startSSH', function (cb) {
  return gulpSSH.shell(remothost.start)
})

gulp.task('update:server', function(cb) {  
  runSequence('cleanSSH', 'uploadSSH', 'startSSH', cb);
})
gulp.task('update:client', function(cb) {  
runSequence('build:client', 'clean:views', 'copy:views', 'update:server', cb);
})

