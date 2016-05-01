//global require, __dirname
const fs = require("fs");
const gulp = require("gulp");
const crx = require("gulp-crx-pack");
const manifest = require("./src/manifest.json");
const Server = require("karma").Server;
const zip = require('gulp-zip');

gulp.task("crx", function () {
    return gulp.src("./src")
      .pipe(crx({
          privateKey: fs.readFileSync("./certs/key.pem", "utf8"),
          filename: manifest.name + ".crx"
      }))
      .pipe(gulp.dest("./build"));
});

gulp.task("zip", function(){
    return gulp.src("./src")
        .pipe(zip(manifest.name + ".zip"))
        .pipe(gulp.dest('./build'));
});

gulp.task("test", function (done) {
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});

gulp.task("default", ["zip","crx"]);