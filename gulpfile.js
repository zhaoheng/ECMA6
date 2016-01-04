/**
 * Created by zhaoheng on 2015/11/17 17:41.
 * Last Modified by zhaoheng on 2015/11/17 17:41.
 */

var gulp = require('gulp');

var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task("default", function () {
    return gulp.src("app.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task("sourcemap", function () {
    return gulp.src("app.js")
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(concat("all.js"))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist"));
});
