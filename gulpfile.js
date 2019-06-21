/*global __dirname*/
const fs = require("fs");
const gulp = require("gulp");
const crx = require("gulp-crx-pack");
const manifest = require("./src/manifest.json");
const Server = require("karma").Server;
const zip = require("gulp-zip");
const shell = require("gulp-shell");
const eslint = require("gulp-eslint");
const del = require("del");
const src = __dirname + "\\src";
const jsonEditor = require("gulp-json-editor");
const selectorGeneratorSrc = "./node_modules/selector-generator/selector-generator.js";

gulp.task("clean", function(){
    return del(["./src/js/selector-generator.js"]);
});

gulp.task("copy",["clean"], function(){
    return gulp.src(selectorGeneratorSrc)
        .pipe(gulp.dest("./src/js"));
});
gulp.task("crx",["build"], function () {
    return gulp.src("./src")
        .pipe(crx({
            privateKey: fs.readFileSync("./certs/key.pem", "utf8"),
            filename: manifest.name + ".crx"
        }))
        .pipe(gulp.dest("./build"));
});

gulp.task("zip",["build"], function () {
    return gulp.src("./src/**")
        .pipe(zip(manifest.name + ".zip"))
        .pipe(gulp.dest("./build"));
});

gulp.task("test", ["copy"],function (done) {
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});

gulp.task("build",["copy","increment"]);
gulp.task("pack",["zip", "crx"]);

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

gulp.task("eslint", ["copy"], function () {
    return gulp.src(["./src/js/**/*.js", "./tests/*.spec.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task("default", ["test","eslint","build","pack"]);