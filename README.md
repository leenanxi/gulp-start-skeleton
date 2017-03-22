# Gulp Start  Skeleton

Minimal Gulp Projects, include sass, server, watch

### How to start
```bash
npm install
bower install
gulp
```

### Gulp file

```javascript
var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var imagemin = require('gulp-image');
var autoprefixer = require('gulp-autoprefixer');
var usemin = require('gulp-usemin');

var paths = {
    port: 8000,
    scss: ['./src/assets/styles/*.scss'],
    css: ['./src/assets/styles/*.css'],
    html: ['src/**/*.html'],
    images: './src/assets/images/**/*.*',
    copy: ['./src/assets/fonts/**', './src/assets/json/**'],
    dev: './src',
    dist: './dist'
};

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

gulp.task('clean', function () {
    return del.sync(['dist/**/*']);//Clean must be sync to avoid from errors
});

gulp.task('copy', ['clean'], function () {
    return gulp.src(paths.copy, {base: paths.dev})
        .pipe(gulp.dest('./dist'));
});

gulp.task('images', function () {
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/assets/images/'));
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
            css: [cleanCSS()],
            js: [uglify()],
            inlinejs: [uglify()],
            inlinecss: [cleanCSS(), 'concat']
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());

});

gulp.task('sass', function () {
    return gulp.src(paths.scss, {base: "./"})
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        .pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    console.log('Gulp watching changes!');
    gulp.watch(paths.styles, ['sass']);
    gulp.watch(paths.html.concat(paths.css), ['html']);
});

gulp.task('default', ['clean', 'copy', 'html', 'sass', 'connectDist', 'connectDev', 'watch']);
```
