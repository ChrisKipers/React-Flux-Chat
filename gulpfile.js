var gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  reactify = require('reactify'),
  sass = require('gulp-sass'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  es = require('event-stream'),
  react = require('gulp-react'),
  livereload = require('gulp-livereload'),
  uglifyjs = require('gulp-uglifyjs'),
  uglifycss = require('gulp-uglifycss'),
  clean = require('gulp-clean'),
  jasmine = require('gulp-jasmine'),
  karma = require('karma');

var jsHintConfig = require('./config/jshint-config.json');
var package = require('./package');

gulp.task('browserify', function () {
  var bundle = browserify({
    entries: ['./public/src/js/main.js'], // Only need initial file, browserify finds the deps
    transform: [reactify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  getFrontendDependencies().forEach(function (dependencyName) {
    bundle.external(require.resolve(dependencyName, {expose: dependencyName}));
  });

  return bundle.bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/build/js/'))
    .pipe(livereload());
});

gulp.task('browserify-lib', function () {
  var bundle = browserify();
  getFrontendDependencies().forEach(function (dependencyName) {
    bundle.require(dependencyName);
  });
  return bundle.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/build/js'));
});

gulp.task('sass', function () {
  return gulp.src('./public/src/scss/*.scss')
    .pipe(sass())
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

gulp.task('uglify-js', ['browserify', 'browserify-lib'], function () {
  return gulp.src('./public/build/js/*.js')
    .pipe(uglifyjs('main.min.js', {
      outSourceMap: true
    }))
    .pipe(gulp.dest('./public/dist/js'));
});

gulp.task('uglify-css', ['sass'], function () {
  return gulp.src('./public/build/css/main.css')
    .pipe(uglifycss())
    .pipe(gulp.dest('./public/dist/css/'));
});

gulp.task('clean', function () {
  return gulp.src(['./public/build', './public/dist'])
    .pipe(clean());
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./public/src/js/**/*.js', ['lint', 'browserify']);
  gulp.watch('./public/src/js/**/*.jsx', ['lint', 'browserify']);
  gulp.watch('./public/src/scss/**/*.scss', ['sass']);

  return karma.server.start({
    configFile: __dirname + '/config/karma.conf.js'
  });
});

gulp.task('test', function () {
  return karma.server.start({
    configFile: __dirname + '/config/karma.conf.js',
    singleRun: true
  });
});

gulp.task('default', ['watch']);
gulp.task('compile', ['lint', 'browserify-lib', 'browserify', 'sass']);
gulp.task('build', ['uglify-js', 'uglify-css']);

function getFrontendDependencies() {
  var backendOnlyDependencies = ['jade', 'express', 'socket.io', 'sillyname'];
  var dependencyNames = Object.keys(package.dependencies);
  return dependencyNames.filter(function (dependencyName) {
    return backendOnlyDependencies.indexOf(dependencyName) === -1;
  });
}