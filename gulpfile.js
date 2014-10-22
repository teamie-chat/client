(function() {
  
  'use strict';
  
  var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    del = require('del'),
    jshintStylish = require('jshint-stylish'),
    filesToWatch = [
      '.jshintrc',
      'demo/index.html',
      'src/**/*.html',
      'src/**/*.js',
      'src/**/*.css'
    ],
    releaseDir = 'release';

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
    del([ 'release/**', 'release' ], cb);
  });

  gulp.task('build:html', function() {
    gulp.src([ 'src/**/*.html' ])
      .pipe(plugins.angularTemplatecache('templates.js', {
        root: 'src/',
        module: 'tChat',
        standalone: false
      }))
      .pipe(gulp.dest(releaseDir));
  });

  gulp.task('build:css-js', function(cb) {
    gulp.src([ 'src/demo/index.html' ])
      .pipe(plugins.usemin({
        html: [
          plugins.replace('teamie-chat.css', 'teamie-chat.min.css'),
          plugins.replace('teamie-chat.js', 'teamie-chat.min.js')
        ]
      }))
      .pipe(gulp.dest(releaseDir + '/demo'))
      .on('end', function() {
        cb();
      });
  });

  gulp.task('build:concat', function(cb) {
    gulp.src([ 'release/*.js' ])
      .pipe(plugins.concat('teamie-chat.js'))
      .pipe(gulp.dest(releaseDir))
      .on('end', function() {
        cb();
      });
  });

  gulp.task('build:minify-js', function(cb) {
    gulp.src([ 'release/teamie-chat.js' ])
      .pipe(plugins.rename('teamie-chat.min.js'))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(releaseDir))
      .on('end', cb);
  });

  gulp.task('build:minify-css', function(cb) {
    gulp.src([ 'release/teamie-chat.css' ])
      .pipe(plugins.rename('teamie-chat.min.css'))
      .pipe(plugins.minifyCss())
      .pipe(gulp.dest(releaseDir))
      .on('end', cb);
  });

  gulp.task('build:rm', function(cb) {
    del([ 'release/templates.js' ], cb);
  });

  gulp.task('build', function() {
    plugins.runSequence(
      'clean',
      'build:html',
      'build:css-js',
      'build:concat',
      [ 'build:minify-js', 'build:minify-css' ],
      'build:rm'
    );
  });

  gulp.task('default', [ 'lint:soft', 'cs', 'serve', 'watch' ]);

})();