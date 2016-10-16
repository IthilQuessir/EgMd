var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

gulp.task("demo", function () {

    gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: "demo"
    }));

});

gulp.task("test", function () {
    gulp.src("./")
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: "test"
        }));
});
