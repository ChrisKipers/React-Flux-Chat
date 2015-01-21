module.exports = function (config) {
  config.set({
    files: [
      '../tests/**/*.spec.js',
      '../tests/**/*.spec.jsx'
    ],
    frameworks: ['browserify', 'jasmine', 'es5-shim'],
    preprocessors: {
      '../tests/**/*.spec.js': ['browserify'],
      '../tests/**/*.spec.jsx': ['browserify']
    },
    browsers: ['PhantomJS', 'Chrome'],
    browserify: {
      debug: true,
      transform: ['reactify']
    }
  });
};