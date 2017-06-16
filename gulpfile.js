/**
 * Created by steven on 21/02/2016.
 */
var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var ftp = require('gulp-ftp');
var replace=require('gulp-replace');
var concatCss = require('gulp-concat-css');

gulp.task('clean', function(){
    del('dist/**/*');
});

gulp.task('copyFiles', function(){
    //gulp.src(['./*.html']) // path to your files
    //    .pipe(gulp.dest('dist'));



});

gulp.task('processCss', function(){
    return gulp.src('css/*.css')
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest('dist'));
});

gulp.task('replaceReference', function(){
    gulp.src(['./index.html'])
        .pipe(replace('css/CustomBootstrap.css','bundle.css'))
        .pipe(gulp.dest('dist'));

});

gulp.task('pushToVSProject', function(){
    gulp.src(['./*.html']) // path to your files

        .pipe(gulp.dest('../Screen2Solution/Screen2AzureWeb'));
});

// task
gulp.task('default',function(){
   runSequence('clean', 'copyFiles', 'processCss', 'replaceReference');
});

