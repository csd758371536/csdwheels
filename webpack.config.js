var path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    "babel-polyfill",
    path.join(__dirname, './src/main.es6')
  ],
  output: {
    path: path.join(__dirname, './bundle'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname , 'src'),
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
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
