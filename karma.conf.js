module.exports = function (config) {
    config.set({
        browsers: ["PhantomJS"],
        frameworks: ["jasmine"],
        files: [
            "src/js/selector-generator.js",
            "tests/**/*.spec.js"
        ]
    });
};