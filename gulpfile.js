//vars
const
    gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    rigger = require("gulp-rigger"),
    autoprefixer = require("autoprefixer"),
    browserSync = require('browser-sync').create(),
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    cssnano = require("gulp-cssnano"),
    imagemin = require("gulp-imagemin"),
    babel = require("gulp-babel"),
    babelCore = require("babel-core"),
    babelEnv = require("babel-preset-env"),
    del = require("del"),
    rename = require("gulp-rename"),
    svgmin = require("gulp-svgmin"),
    svgstore = require("gulp-svgstore"),
    path = {
        dist: {
            server: 'dist/',
            dist: 'dist',
            html: 'dist/',
            css: 'dist/css/',
            js: 'dist/js/',
            img: 'dist/image',
            font: 'dist/fonts/'
        },
        app: {
            html: 'app/*.html',
            scss: 'app/scss/main.scss',
            js: 'app/js/main.js',
            img: 'app/image/**/*.{png,jpg,gif}',
            svg: 'app/image/**/*.svg',
            font: 'app/fonts/*.ttf'
        },
        watch: {
            html: 'app/templates/**/*.html',
            scss: 'app/scss/**/*.scss',
            js: 'app/js/**/*.*',
            img: 'app/image/**/*.*',
            svg: 'app/image/**/*.svg',
            font: 'app/fonts/*.ttf'
        }
    };
sass.compiler = require("node-sass");

//browserSync
gulp.task('server', function () {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: path.dist.server
        }
    });
});

//delete dist
gulp.task('del', function () {
    return del(path.dist.dist);
});

//html
gulp.task('html', function () {
    return gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rigger())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.html))
        .pipe(browserSync.stream());
});

//scss
gulp.task('sass', function () {
    return gulp.src(path.app.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.stream());
});

//js
gulp.task('js', function () {
    return gulp.src(path.app.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rigger())
        .pipe(babel({
            presets: [babelEnv]
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(browserSync.stream());
})

//images
gulp.task("img", function () {
    return gulp.src(path.app.img)
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.jpegtran({ progressive: true })
        ]))
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream());
});
//svg
gulp.task("svg", function () {
    return gulp.src(path.app.svg)
        .pipe(svgmin())
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream());
});

//fonts
gulp.task('font',function(){
    return gulp.src(path.app.font)
    .pipe(gulp.dest(path.dist.font))
    .pipe(browserSync.stream());
});
//watch
gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.parallel('html'))
    gulp.watch(path.watch.scss, gulp.parallel('sass'))
    gulp.watch(path.watch.js, gulp.parallel('js'))
    gulp.watch(path.watch.img, gulp.parallel('img'))
    gulp.watch(path.watch.svg, gulp.parallel('svg'))
    gulp.watch(path.watch.font, gulp.parallel('font'))
})

//build all
gulp.task('build',
    gulp.series('del', gulp.parallel('html', 'sass', 'js', 'img', 'svg','font'))
)

//gulp
gulp.task('default', gulp.parallel('html', 'sass', 'js', 'img', 'svg', 'watch', 'server','font'))