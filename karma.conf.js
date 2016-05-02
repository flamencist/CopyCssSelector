module.exports = function(config) {
  config.set({
    browsers:  ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'src/js/cssPath.js',
      'tests/domParser.js',
      'tests/fakeElementSelectors.js',
      'tests/**/*.spec.js'
    ]
  });
};