/*global __dirname*/
const fs = require("fs");
const gulp = require("gulp");
const crx = require("gulp-crx-pack");
const manifest = require("./src/manifest.json");
const Server = require("karma").Server;
const zip = require("gulp-zip");
const shell = require("gulp-shell");
const eslint = require("gulp-eslint");
const src = __dirname + "\\src";
const jsonEditor = require("gulp-json-editor");

gulp.task("crx", function () {
    return gulp.src("./src")
        .pipe(crx({
            privateKey: fs.readFileSync("./certs/key.pem", "utf8"),
            filename: manifest.name + ".crx"
        }))
        .pipe(gulp.dest("./build"));
});

gulp.task("zip", function () {
    return gulp.src("./src/**")
        .pipe(zip(manifest.name + ".zip"))
        .pipe(gulp.dest("./build"));
});

gulp.task("test", function (done) {
    return new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});

gulp.task("increment", function () {
    var numbers = manifest.version.split(".");
    numbers[3]++;
    var version = numbers.join(".");
    return gulp.src(["./src/manifest.json"])
        .pipe(jsonEditor({
            "version": version
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task("chrome", shell.task(["\"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe\" --load-extension=" + src]));

gulp.task("eslint", function () {
    return gulp.src(["./src/js/**/*.js", "./tests/*.spec.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task("default", ["test", "increment", "zip", "crx"]);