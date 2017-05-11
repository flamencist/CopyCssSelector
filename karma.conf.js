module.exports = function (config) {
    config.set({
        browsers: ["PhantomJS"],
        frameworks: ["jasmine"],
        files: [
            "src/js/SelectorGenerator.js",
            "tests/**/*.spec.js"
        ]
    });
};