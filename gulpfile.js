var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),

    fs = require("fs"),
    path = require("path");

gulp.task("demo", function() {

    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: "demo"
        }));

});

gulp.task("test", function() {
    gulp.src("./")
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: "test"
        }));
});

gulp.task("seed", function() {

    gulp.src([
            "./src/md/index.js",
            "./src/**/*.js",
            "!./src/syntax/**/*.js",
            "!./src/syntax/dialects/**/*.js",
            "!./src/older/**/*.js"
        ])
        .pipe(plugins.concat("Md-seed.js"))
        .pipe(gulp.dest("./release/"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest("./release/min"));

});

/**
 *
 * @watch ./src/dialects/*.js
 *        ./src/syntax/*.js
 */
gulp.task("dialects", function() {

    function flat(json) {

        var map = {},
            arr = [];

        json.forEach(function (dialect) {
            dialect.syntax.forEach(function (syntax) {
                if (!(syntax in map)) {
                    map[syntax] = 1;
                    arr.push("./src/syntax/" + syntax + ".js");
                }
            });
        });

        return arr;

    }

    gulp.src([
            "./src/dialects/*.json"
        ])
        .pipe(plugins.foreach(function(steam, file) {

            var config = JSON.parse(fs.readFileSync(file.path, 'utf-8'));

            return gulp.src("./src/dialectBuilder/template.swig")
                .pipe(plugins.swig({
                    data: {
                        dialects: config
                    }
                }))
                .pipe(plugins.addSrc.prepend(flat(config)))
                .pipe(plugins.concat(path.basename(file.path, ".json") + ".js"));

        }))
        .pipe(gulp.dest("./release/dialects"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest("./release/min/dialects"));

});

gulp.task("full", function() {

    gulp.src("./release/dialects/**/*.js")
        .pipe(plugins.foreach(function (steam, file) {

            return steam
                .pipe(plugins.addSrc.prepend("./release/Md-seed.js"))
                .pipe(plugins.concat("Md-" + path.basename(file.path)));

        }))
        .pipe(gulp.dest("./release/full_version"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest("./release/min/full_version"));
});

gulp.task("default", function() {

});
