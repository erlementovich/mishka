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
    path = {
        dist: {
            server: 'dist/',
            dist: 'dist',
            html: 'dist/',
            css: 'dist/css/',
            js: 'dist/js/',
            img: 'dist/image',
        },
        app: {
            html: 'app/*.html',
            scss: 'app/scss/main.scss',
            js: 'app/js/main.js',
            img: 'app/image/**/*.*'
        },
        watch: {
            html: ['app/templates/*.html', 'app/*.html'],
            scss: 'app/scss/**/*.scss',
            js: 'app/js/**/*.*',
            img: 'app/image/**/*.*'
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
gulp.task('img', function () {
    return gulp.src(path.app.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream());
})
//watch
gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.parallel('html'));
    gulp.watch(path.watch.scss, gulp.parallel('sass'));
    gulp.watch(path.watch.js, gulp.parallel('js'))
    gulp.watch(path.watch.img, gulp.parallel('img'))
})

//build all
gulp.task('build',
    gulp.series('del', gulp.parallel('html', 'sass', 'js', 'img'))
)

//gulp
gulp.task('default',gulp.parallel('html', 'sass', 'js', 'img','watch','server'))