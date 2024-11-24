const gulp = require('gulp');
const concat = require('gulp-concat');
const riot = require('gulp-riot');

gulp.task('riot', () => {
  return riotTask(process.argv.indexOf('-w') > 0);
});

function riotTask(watch = false) {
  const tagSrc = './public/lib/tags/src/**/*.tag';

  if (watch) {
    gulp.watch(tagSrc, (e) => {
      console.log('File ' + e.path + ' was ' + e.type + '...');
      
      riotTask();
    })
  }

  return gulp.src(tagSrc)
    .pipe(riot())
    .pipe(concat('tags.js'))
    .pipe(gulp.dest('./public/lib/tags/dist'));
}