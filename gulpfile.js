const gulp = require('gulp');
const babel = require('gulp-babel');


gulp.task('default', () => gulp.src([
  './**/*.{js,jsx}',
  '!./lib/**',
  '!babel.config.js',
  '!gulpfile.js',
])
  .pipe(babel())
  .pipe(gulp.dest('lib')));
