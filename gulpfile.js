const fs = require('fs');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('page', function() {
  gulp.src('src/page.js')
  .pipe(uglify())    //uglify
  .pipe(rename("page.min.js"))
  .pipe(gulp.dest('dist/page'));
  gulp.src('style/page.min.css')
  .pipe(gulp.dest('dist/page'))
});

gulp.task('mini', ['page']);
