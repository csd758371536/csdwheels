var path = require('path');

module.exports = {
  // 模式配置
  mode: 'development',
  // 入口文件
  entry: {
    pagination: './src/pagination/pagination.js',
    calendar: './src/calendar/calendar.js'
  },
  // 出口文件
  output: {
    path: path.resolve('lib'),
    filename: "[name].js"
  },
  // // 对应的插件
  // plugins: [],
  // // 开发服务器配置
  // devServer: {},
  // // 处理对应模块
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       include: path.join(__dirname , 'src'),
  //       exclude: /node_modules/,
  //       use: ['babel-loader']
  //     }
  //   ]
  // }
}



// const fs = require('fs');
// const gulp = require('gulp');
// const uglify = require('gulp-uglify');
// const rename = require("gulp-rename");

// gulp.task('page', function() {
//   gulp.src('src/pagination/pagination.js')
//   .pipe(uglify())    //uglify
//   .pipe(rename("pagination.min.js"))
//   .pipe(gulp.dest('dist/pagination'));
//   gulp.src('style/pagination/pagination.min.css')
//   .pipe(gulp.dest('dist/pagination'))
// });

// gulp.task('mini', ['page']);
