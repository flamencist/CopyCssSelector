module.exports = function(config) {
  config.set({
    browsers: ['Chrome', 'IE'],
    frameworks: ['jasmine'],
    files: [
      'src/js/cssPath.js',
	  '!src/js/devtools.js',
      'tests/domParser.js',
      'tests/fakeElementSelectors.js',
      'tests/**/*.spec.js'
    ]
  });
};