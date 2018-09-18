const fs = require('fs');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('page', gulp.parallel(() => {
  return gulp.src('src/es5/pagination/pagination.js')
  .pipe(uglify())    //uglify
  .pipe(rename("pagination.min.js"))
  .pipe(gulp.dest('dist/pagination'))
}, () => {
  return gulp.src('style/pagination/pagination.min.css')
  .pipe(gulp.dest('dist/pagination'))
}));

gulp.task('carousel', gulp.parallel(() => {
  return gulp.src('src/es5/carousel/carousel.js')
  .pipe(uglify())    //uglify
  .pipe(rename('carousel.min.js'))
  .pipe(gulp.dest('dist/carousel'))
}, () => {
  return gulp.src('src/es5/carousel/carousel-mobile.js')
  .pipe(uglify())    //uglify
  .pipe(rename('carousel-mobile.min.js'))
  .pipe(gulp.dest('dist/carousel'))
}, () => {
  return gulp.src('style/carousel/carousel.min.css')
  .pipe(gulp.dest('dist/carousel'))
}, () => {
  return gulp.src('style/carousel/carousel-mobile.min.css')
  .pipe(gulp.dest('dist/carousel'))
}));

gulp.task('calendar', gulp.parallel(() => {
  return gulp.src('src/es5/calendar/calendar.js')
  .pipe(uglify())    //uglify
  .pipe(rename("calendar.min.js"))
  .pipe(gulp.dest('dist/calendar'))
}, () => {
  return gulp.src('style/calendar/calendar.min.css')
  .pipe(gulp.dest('dist/calendar'))
}));

gulp.task('mini', gulp.parallel('page', 'carousel', 'calendar'));
