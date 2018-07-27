const fs = require('fs');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('page', function() {
  gulp.src('src/es5/pagination/pagination.js')
  .pipe(uglify())    //uglify
  .pipe(rename("pagination.min.js"))
  .pipe(gulp.dest('dist/pagination'));
  gulp.src('style/pagination/pagination.min.css')
  .pipe(gulp.dest('dist/pagination'))
});

gulp.task('mini', ['page']);
