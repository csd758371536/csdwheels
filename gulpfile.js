const fs = require('fs');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('mini', function() {
  gulp.src('src/csdutils.js')
  .pipe(uglify())    //uglify
  .pipe(rename("csdutils.min.js"))
  .pipe(gulp.dest('dist/'))
});
