const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');

// https://thesocietea.org/2016/01/building-es6-javascript-for-the-browser-with-gulp-babel-and-more/

const loginJsxPath = './client/jsx/LoginForm.jsx';
//const indexJsxPath = './client/jsx/Index.jsx';
const jsDestPath = './public/javascripts';

gulp.task('compile-jsx-login', function () {
    return browserify({ entries: loginJsxPath, extensions: ['.jsx'], debug: false })
        .transform('babelify', { presets: ['es2015', 'react'] })
        .bundle()
        .pipe(source('login.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(jsDestPath));
});

/*
gulp.task('index-jsx-transform', function () {
    return browserify({ entries: indexJsxPath, extensions: ['.jsx'], debug: false })
        .transform('babelify', { presets: ['es2015', 'react'] })
        .bundle()
        .pipe(source('index.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(jsDestPath));
}); */

//gulp.task('default', ['login-jsx-transform', 'index-jsx-transform']);
