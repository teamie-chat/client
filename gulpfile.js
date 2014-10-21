(function() {
  'use strict';
  
  var gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      filesToWatch = [
        'demo/index.html',
        'src/**/*.html',
        'src/**/*.js',
        'src/**/*.css'
      ];

  gulp.task('serve', function() {
    plugins.connect.server({
      root: '.',
      port: 12044,
      livereload: true
    });
  });

  gulp.task('reserve', function() {
    gulp.src(filesToWatch)
      .pipe(plugins.connect.reload());
  });

  gulp.task('watch', function() {
    gulp.watch(filesToWatch, [ 'reserve' ]);
  });

  gulp.task('default', [ 'serve', 'watch' ]);

})();