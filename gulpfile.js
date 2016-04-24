//global require
var fs = require("fs");
var gulp = require("gulp");
var crx = require("gulp-crx-pack");
var manifest = require("./src/manifest.json");

gulp.task("crx", function () {
    return gulp.src('./src')
      .pipe(crx({
          privateKey: fs.readFileSync("./certs/key.pem", "utf8"),
          filename: manifest.name + ".crx"
      }))
      .pipe(gulp.dest("./build"));
});

gulp.task("default", ["crx"]);