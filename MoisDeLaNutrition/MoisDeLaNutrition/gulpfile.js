/* gulpfile.js
------------------------------------- */
var gulp = require('gulp'),
    sass = require('gulp-sass');


var paths = {
    scss: './scss/',
    css: './Content/',
    templates: './scss/templates/'
}



// Sass Task
gulp.task('sass', function () {

    return gulp.src(paths.scss + 'application.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.css))

});

// ------------------------------------ Gulp Testing Message
gulp.task('message', function () {
    console.log('It\'s a trap!!!');
});

// ---------------------------------------------- Gulp Watch
gulp.task('watch:styles', function () {
    gulp.watch(paths.scss + '**/*.scss', gulp.series('sass'));
});

gulp.task('watch', gulp.series('sass',
    gulp.parallel('watch:styles')
));


// -------------------------------------------- Default task
gulp.task('default', gulp.series('sass',
    gulp.parallel('message', 'watch')
));