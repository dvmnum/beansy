"use strict";

const {src, dest} = require("gulp")
const gulp = require("gulp")
const autoprefixer = require("gulp-autoprefixer")
const cssbeautify = require("gulp-cssbeautify")
const removeComments = require("gulp-strip-css-comments")
const rename = require("gulp-rename")
const rigger = require("gulp-rigger")
const sass = require("gulp-sass")(require('sass'))
const cssnano = require("gulp-cssnano")
const sourcemaps = require("gulp-sourcemaps")
const uglify = require("gulp-uglify")
const plumber = require("gulp-plumber")
const panini = require("panini")
const imagemin = require("gulp-imagemin")
const webp = require("gulp-webp")
const multiDest = require("gulp-multidest")
const del = require("del")
const notify = require("gulp-notify")
const browserSync = require("browser-sync").create()

const webpackStream = require('webpack-stream');

// paths
const srcPath = "src/"
const distPath = "dist/"

const path = {
    build: {
        html:   distPath,
        css:    distPath + "assets/styles/",
        js:     distPath + "assets/js/",
        images: distPath + "assets/images/",
        fonts:  distPath + "assets/fonts/"
    },
    src: {
        html:   srcPath + "*.html",
        css:    srcPath + "assets/styles/*.scss",
        js:     srcPath + "assets/js/*.js",
        images: srcPath + "assets/images/**/*.{jpeg,png,svg,gif,ico,webp,webmanifest,xml.json}",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html:   srcPath + "**/*.html",
        css:    srcPath + "assets/styles/**/*.scss",
        js:     srcPath + "assets/js/**/*.js",
        images: srcPath + "assets/images/**/*.{jpeg,png,svg,gif,ico,webp,webmanifest,xml.json}",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clean: "./" + distPath
}

function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    })
}

function html() {
    panini.refresh()
    return src(path.src.html, {base: srcPath})
        .pipe(plumber())
        .pipe(panini({
            root: srcPath,
            layouts: srcPath + "tpl/layouts",
            partials: srcPath + "tpl/partials"
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function css() {
    return src(path.src.css, {base: srcPath + "assets/styles/"})
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title:   "SCSS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function js() {
    return src(path.src.js, {base: srcPath + "assets/js/"})
        .pipe(sourcemaps.init())
        .pipe(plumber(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        })))
        .pipe(webpackStream({
            mode: "production",
            output: {
              filename: 'main.js',
            }
          }))
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function images() {
    return src(path.src.images, {base: srcPath + "assets/images/"})
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 85, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        /* .pipe(webp()) */
        /* .pipe(multiDest([distPath + "assets/images/", srcPath + "assets/images/"])) */
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function fonts() {
    return src(path.src.fonts, {base: srcPath + "assets/fonts/"})
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function clean() {
    return del(path.clean)
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.watch.fonts], fonts)
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts))
const watch = gulp.parallel(build, watchFiles, serve)

exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.fonts = fonts
exports.clean = clean

exports.build = build
exports.watch = watch
exports.default = watch