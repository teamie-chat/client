(function() {
  
  'use strict';
  
  var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    jshintStylish = require('jshint-stylish'),
    filesToWatch = [
      '.jshintrc',
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

  gulp.task('cs', function() {
    gulp.src([ 'src/**/*.js' ])
      .pipe(plugins.jscs());
  });

  gulp.task('lint:soft', function() {
    gulp.src([ 'src/**/*.js' ])
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter(jshintStylish));
  });

  gulp.task('lint:strict', function() {
    gulp.src([ 'src/**/*.js' ])
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter(jshintStylish))
      .pipe(plugins.jshint.reporter('fail'));
  });

  gulp.task('reserve', function() {
    gulp.src(filesToWatch)
      .pipe(plugins.connect.reload());
  });

  gulp.task('watch', function() {
    gulp.watch(filesToWatch, [ 'reserve' ]);
  });

  gulp.task('clean', function(cb) {
    gulp.src('release', { read: false })
      .pipe(plugins.clean())
      .on('end', function() {
          cb();
      });
  });

  gulp.task('build', function() {
    gulp.src([ 'demo.html' ])
      .pipe(plugins.usemin({
        js: [ plugins.uglify() ],
        css: [ plugins.minifyCss() ]
      }))
      .pipe(gulp.dest('release'));
  });

  gulp.task('release', [ 'clean', 'build' ]);

  gulp.task('default', [ 'lint:soft', 'cs', 'serve', 'watch' ]);

})();