var gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  reactify = require('reactify'),
  compass = require('gulp-compass'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  es = require('event-stream'),
  react = require('gulp-react'),
  livereload = require('gulp-livereload');

var jsHintConfig = require('./config/jshint-config.json');
var package = require('./package');

gulp.task('browserify', function () {
  var bundle = browserify({
    entries: ['./public/src/js/main.js'], // Only need initial file, browserify finds the deps
    transform: [reactify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var dependencyNames = Object.keys(package.dependencies);
  dependencyNames.forEach(function (dependencyName) {
    bundle.external(require.resolve(dependencyName, {expose: dependencyName}));
  });

  bundle.bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/build/js/'))
    .pipe(livereload());
});

gulp.task('browserify-lib', function () {
  var bundle = browserify();
  var dependencyNames = Object.keys(package.dependencies);
  dependencyNames.forEach(function (dependencyName) {
    bundle.require(dependencyName);
  });
  bundle.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/build/js'));
});

gulp.task('compass', function () {
  return gulp.src('./public/src/scss/*.scss')
    .pipe(compass({
      config_file: './config/compass-config.rb',
      css: 'public/build/css',
      sass: 'public/src/scss'
    }))
    .pipe(gulp.dest('./public/build/css'))
    .pipe(livereload());
});

gulp.task('lint', function () {
  var serverJSFile = gulp.src('./app.js');
  var jsFilePipe = gulp.src('./public/src/js/**/*.js');
  var jsxFilePipe = gulp.src('./public/src/js/**/*.jsx').pipe(react());
  return es.merge(serverJSFile, jsFilePipe, jsxFilePipe)
    .pipe(jshint(jsHintConfig))
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./public/src/js/**/*.js', ['lint', 'browserify']);
  gulp.watch('./public/src/js/**/*.jsx', ['lint', 'browserify']);
  gulp.watch('./public/src/scss/**/*.scss', ['compass']);
});

gulp.task('default', ['lint', 'browserify-lib', 'browserify', 'compass']);
gulp.task('build', ['browserify-lib', 'browserify', 'compass']);