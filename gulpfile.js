var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-image');
var usemin = require('gulp-usemin');

var paths = {
    port: 8000,
    scss: ['./src/assets/styles/*.scss'],
    css: ['./src/assets/styles/*.css'],
    html: ['src/*.html','src/views/**/.html'],
    images: './src/assets/images/**/*.*',
    copy: ['./src/assets/fonts/**', './src/assets/json/**'],
    dev: './src',
    dist: './dist'
};


gulp.task('clean', function () {
    return del.sync(['dist/**/*']);//Clean must be sync to avoid from errors
});

gulp.task('copy', ['clean'], function () {
    return gulp.src(paths.copy, {base: paths.dev})
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
    return gulp.src(paths.scss, {base: "./"})
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    var options = {
        removeComments: false,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeOptionalTags: false
    };
    return gulp.src(paths.html, {base: paths.dev})
        .pipe(usemin({
            // html: [ htmlmin(options) ], //bugs for multi html, so put it blew
            css: [cleancss()],
            js: [uglify()],
            inlinejs: [uglify()],
            inlinecss: [cleancss(), 'concat']
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload());

});

gulp.task('images', function () {
    gulp.src(paths.images, {base: paths.dev})
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist));
});


gulp.task('connectDev', function () {
    connect.server({
        name: 'Dev App',
        root: paths.dev,
        port: paths.port,
        livereload: true
    });
});

gulp.task('connectDist', function () {
    connect.server({
        name: 'Dist App',
        root: paths.dist,
        port: paths.port + 1,
        livereload: true
    });
});

gulp.task('watch', function () {
    console.log('Gulp watching changes!');
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.html.concat(paths.css), ['html']);
});

gulp.task('default', ['clean', 'copy', 'sass','html', 'images', 'connectDist', 'connectDev', 'watch']);
