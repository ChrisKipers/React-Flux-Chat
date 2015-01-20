module.exports = function (config) {
  config.set({
    files: [
      '../tests/**/*.spec.js'
    ],
    frameworks: ['browserify', 'jasmine', 'es5-shim'],
    preprocessors: {
      '../tests/**/*.spec.js': ['browserify']
    },
    browsers: ['PhantomJS'],
    browserify: {
      debug: true,
      transform: ['reactify']
    }
  });
};