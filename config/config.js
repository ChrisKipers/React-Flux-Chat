var cssFiles;
var jsFiles;

if (process.env.NODE_ENV === 'prod') {
  jsFiles = ['dist/js/main.min.js'];
  cssFiles = ['dist/css/main.css'];
} else {
  jsFiles = ['build/js/bundle.js', 'build/js/main.js'];
  cssFiles = ['build/css/main.css'];
}

module.exports = {
  port: process.env.PORT || 3000,
  jsFiles: jsFiles,
  cssFiles: cssFiles,
  sessionSecret: process.env.SECRET || 'terrible-secret-1234'
};