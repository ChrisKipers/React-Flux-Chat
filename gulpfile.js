var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling etc.
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var concat = require('gulp-concat');
var compass = require('gulp-compass');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var es = require('event-stream');
var react = require('gulp-react');

// gulp.task('browserify', function() {
//     var bundler = browserify({
//         entries: ['./public/src/js/main.js'], // Only need initial file, browserify finds the deps
//         transform: [reactify], // We want to convert JSX to normal javascript
//         debug: true, // Gives us sourcemapping
//         cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
//     });
//     var watcher  = watchify(bundler);

//     return watcher
//     .on('update', function () { // When any files update
//         var updateStart = Date.now();
//         console.log('Updating!');
//         watcher.bundle() // Create new bundle that uses the cache for high performance
//         .pipe(source('main.js'))
//         // This is where you add uglifying etc.
//         .pipe(gulp.dest('./public/build/js/'));
//         console.log('Updated!', (Date.now() - updateStart) + 'ms');
//     })
//     .bundle() // Create the initial bundle when starting the task
//     .pipe(source('main.js'))
//     .pipe(gulp.dest('./public/build/js/'));
// });

gulp.task('browserify', function() {
    return browserify({
        entries: ['./public/src/js/main.js'], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/build/js/'));
});

gulp.task('compass', function() {
  gulp.src('./public/src/scss/*.scss')
    .pipe(compass({
      config_file: './config/compass-config.rb',
      css: 'public/build/css',
      sass: 'public/src/scss'
    }))
    .pipe(gulp.dest('./public/build/css'));
});

gulp.task('lint', function() {
  var serverJSFile = gulp.src('./app.js');
  var jsFilePipe = gulp.src('./public/src/js/**/*.js');
  var jsxFilePipe = gulp.src('./public/src/js/**/*.jsx').pipe(react());
  return es.merge(serverJSFile, jsFilePipe, jsxFilePipe)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['browserify', 'compass']);