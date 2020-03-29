const gulp = require('gulp');
const babel = require('gulp-babel');


gulp.task('default', () => gulp.src([
  './**/*.{js,jsx}',
  '!./dist/**',
  '!babel.config.js',
  '!gulpfile.js',
])
  .pipe(babel())
  .pipe(gulp.dest('dist')));
