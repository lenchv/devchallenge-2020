const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const html = require('gulp-html');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache')
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

const scss = () => {
    return gulp.src('src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));
};

gulp.task('scss', scss);

gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.js'))
        .pipe(uglify())
		.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist')
    );
});

gulp.task('html', () => {
	return gulp.src('src/index.html')
		.pipe(html())
		.pipe(gulp.dest('dist/'));
});

gulp.task('favicon', () => {
	return gulp.src('src/favicon.ico')
		.pipe(gulp.dest('dist/'));
});

gulp.task('images', () => {
    return gulp.src('src/assets/images/**/*.jpg')
        .pipe(cache(imagemin({
            jpegRecompress: true,
            mozjpeg: true,
        })))
        .pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('svgSprite', () => {
    return gulp.src('src/assets/icons/*.svg')
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
                mode: {
                    defs: {
                        sprite: '../icons.svg'
                    }
                },
            }
        ))
        .on('error', console.error)
        .pipe(gulp.dest('dist/assets/icons'));
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });
});

gulp.task('clean:dist', (callback) => {
    del.sync('dist');
    callback();
});

gulp.task('cache:clear', (callback) => {
    return cache.clearAll(callback);
});

gulp.task('serve', () => {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch('src/scss/**/*.scss', gulp.series('scss')).on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', gulp.series('js')).on('change', browserSync.reload);
    gulp.watch('src/index.html', gulp.series('html')).on('change', browserSync.reload);
});

exports.build = gulp.series(
    'clean:dist',
    'cache:clear',
    gulp.parallel('scss', 'js', 'html', 'images', 'svgSprite', 'favicon'),
);

exports.start = gulp.series('browserSync');

exports.watch = gulp.series(
    gulp.parallel('scss', 'js', 'html', 'images', 'svgSprite', 'favicon'),
    'serve'
);
