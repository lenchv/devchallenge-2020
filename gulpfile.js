const { src, dest, watch, series, parallel } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();
const html = require('gulp-html');
const babel = require('gulp-babel');

const files = { 
    scssPath: 'src/scss/**/*.scss',
	jsPath: 'src/js/**/*.js',
	htmlPath: 'src/index.html'
};

function scssTask(){    
    return src('src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(postcss([ autoprefixer(), cssnano() ]))
		.pipe(sourcemaps.write('.'))
        .pipe(dest('./dist/')
    );
}

function jsTask(){
    return src([
        files.jsPath
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.js'))
        .pipe(uglify())
		.pipe(sourcemaps.write('.'))
        .pipe(dest('dist')
    );
}

function htmlTask(){
	return src(files.htmlPath)
		.pipe(html())
		.pipe(dest('dist/'));
}

function cacheBustTask(){
    var cbString = new Date().getTime();
    return src(['src/index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('dist'));
}

function watchTask(){
	browserSync.init({
        server: './dist/'
	});

    watch([files.scssPath, files.jsPath, files.htmlPath],
        {interval: 1000, usePolling: true},
        series(
            parallel(scssTask, jsTask, htmlTask),
            cacheBustTask
        )
	).on('change', browserSync.reload); 
}

exports.default = series(
    parallel(scssTask, jsTask, htmlTask), 
    cacheBustTask,
    watchTask
);