let gulp = require('gulp')
let pump = require('pump')
let concat = require('gulp-concat');
let uglify = require('gulp-uglify-es').default;


gulp.task('minifyjs', (callback) => {
    pump([
        gulp.src('app/**/**/*.js'),
        uglify(),
        concat('bundle.js'),
        gulp.dest('')
    ],callback)
});

gulp.task('normaljs', (callback) => {
    pump([
        gulp.src('app/**/**/*.js'),
        concat('bundle.js'),
        gulp.dest('')
    ],callback)
});

gulp.task("watchjs", () => {
    gulp.watch("app/**/**/*.js", ['normaljs'])
})
