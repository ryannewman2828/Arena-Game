var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

gulp.task('scripts', function () {
    gulp.src(['./main/client/**/*.js', '!./main/client/app.min.js'])
        .pipe(concat('app.min.js'))
        //   .pipe(uglify()) // TODO: uncomment, this is for debugging purposes only
        .pipe(gulp.dest('./main/client'));
});

gulp.task('sass', function () {
    return gulp.src('./main/public/sass_stylesheets/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./main/public/stylesheets'));
});

gulp.task('watch', function () {
    gulp.watch(['./main/client/**/*.js', '!./main/client/app.min.js'], ['scripts']);
    gulp.watch('./main/public/sass_stylesheets/*.scss', ['sass']);
});

gulp.task('default', ['scripts', 'sass', 'watch']);