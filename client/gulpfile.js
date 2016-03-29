/**
 * Created by lejoss on 20/11/15.
 */

var gulp         = require('gulp'),
    concat       = require('gulp-concat'),
    jshint       = require('gulp-jshint'),
    //opn        = require('opn'),
    server       = require('gulp-develop-server'),
    concatCss    = require('gulp-concat-css'),
    compress     = require('gulp-uglify'),
    compressCss  = require('gulp-uglifycss');

gulp.task('bundle-vendors', function() {
    gulp.src([
        'bower_components/dist/jquery.min.js',
        'bower_components/bootstrap/dist/js/bootstrap/bootstrap.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-aria/angular-aria.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-material/angular-material.min.js',
        'bower_components/ui-router/release/angular-ui-router.min.js',
        'bower_components/lodash/lodash.min.js',
        'bower_components/d3/d3.min.js'

    ])
        .pipe(concat('vendors.js'))
        //.pipe(compress())
        .pipe(gulp.dest('build/vendors'));
});

gulp.task('bundle-js', function() {
    gulp.src([
        'app/app.js',
        'app/components/**/*.module.js',
        'app/components/**/*.controller.js',
        'app/components/**/*.service.js',
        'app/components/**/*.directive.js',
        'app/core/*.module.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //.pipe(compress())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('build/scripts'))
});

gulp.task('bundle-css', function () {
   return gulp.src([
       'app/styles/*.css',
       'bower_components/bootstrap/dist/css/bootstrap.min.css',
       'bower_components/angular-material/angular-material.css'
   ])
       .pipe(concatCss('app-styles.min.css'))
       .pipe(compressCss())
       .pipe(gulp.dest('build/styles'))
});

gulp.task('bundle-app', ['bundle-js', 'bundle-css', 'bundle-vendors']);


gulp.task('dev', function() {
    gulp.watch(['./app/**/*.js'], ['bundle-js']);
});

/*
gulp.task('server:start', function() {
    server.listen({
        path:'../server/app/app.js'
    })
});

gulp.task('open-browser', function() {
    opn('http://localhost:3000/');
});


gulp.task('dev', ['server:start', 'watch', 'open-browser']);*/
