module.exports = function (config) {
    config.set({
        browsers: ["PhantomJS"],
        frameworks: ["jasmine"],
        files: [
            "src/js/selectorGenerator.js",
            "tests/**/*.spec.js"
        ]
    });
};