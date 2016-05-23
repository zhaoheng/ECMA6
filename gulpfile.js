var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    path = require('path');

var glob = require("glob");  //遍历文件夹

var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

var dir = path.join(__dirname, "./resources/views/manager/");
var options = {
    jsDir: {
        director:  dir + "js/common/director.min.js",
        common:  dir + "js/common/common.js",
        zepto:  dir + "js/common/zepto.min.js",
        route: dir + "js/module/route.js",
        menu: dir + "js/vendor/menu.js",
    },
    cleanFile: function(){
        var res = [];
        res.push( dir + "js/dist/*.js" );
        res.push( "js/dist/component/*.js" );
        return res;
    },
    jsBuildFile: function () {
        var res = [];
        var self = options.jsDir;

        res.push(self.zepto);
        res.push(self.director);
        res.push(self.common);
        res.push(self.route);
        res.push(self.menu);

        return res;
    },
    webpackBuildFile: function(){
        var webpackFile = dir + "js/react/module/**/**/*.js";

        var webpackJs = glob.sync( webpackFile, {});
        //console.log( "webpackJs: " + webpackJs + "\n ");
        return webpackJs;
    },
    imagesBulidFile: []
}


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean','scripts', 'webpack', 'watch']);


// 额外传入gulp.task的阵列。这裡我们可以定义任务相依(task dependencies)。
// 在这个范例中，gulp.start开始任务前会先执行清理(clean)任务。
// Gulp中所有的任务都是并行(concurrently)执行，并没有先后顺序哪个任务会先完成，
// 所以我们需要确保clean任务在其他任务开始前完成。
//gulp.task('default', ['clean'], function () {
//    gulp.start('watch', 'scripts', 'images');
//});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch(options.jsBuildFile(), ['scripts']);
    gulp.watch(options.webpackBuildFile(), ['webpack']);
});

gulp.task("scripts", function () {
    gulp.src(options.jsBuildFile())
        .pipe(uglify())
        .pipe(concat("vender.min.js"))
        .pipe(gulp.dest( dir + "js/dist/"));
});

gulp.task("webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    // run webpack
    webpack(
        // configuration
        myConfig
        , function(err, stats) {
            // if(err) throw new gutil.PluginError("webpack", err);
            // gutil.log("[webpack]", stats.toString({
            //     // output options
            // }));
            callback();
        });
});


// Copy all static images
gulp.task('images', ['clean'], function () {
    return gulp.src(options.imagesBulidFile)
        // Pass in options to the task
        .pipe(cache(imagemin({optimizationLevel: 5, progressive: true, interlaced: true})))
        .pipe(gulp.dest('build/img'));
});

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function () {
    return gulp.src(options.cleanFile(), {read: false})
        .pipe(clean());
});
