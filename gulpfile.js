var gulp            = require('gulp'); 
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass');
var notify          = require("gulp-notify");
var pug 		    = require('gulp-pug');
var rename 		    = require('gulp-rename');
var clean           = require('gulp-clean');
var autoprefixer 	= require('gulp-autoprefixer');
var gcmq 	  	 	= require('gulp-group-css-media-queries');
var concat          = require('gulp-concat');
let uglify          = require('gulp-uglify-es').default;


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
	});
});

gulp.task('styles', function() {
	// return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	return gulp.src('src/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.gcmq', prefix : '' }))
	.pipe(autoprefixer(['last 5 versions']))
	// .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.stream())
});

gulp.task('pug', function(){
    return gulp.src(['src/pug/*.pug','!src/pug/_layouts/*.*'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}))
});

// gulp.task('scripts', function() {
// 	return gulp.src([
// 		// 'node_modules/jquery/dist/jquery.min.js', // Optional jQuery
// 		'src/js/navMenu.js', // JS library example
// 		// 'app/js/_custom.js', // Always at the end
// 		])
// 	.pipe(concat('scripts.min.js'))
// 	.pipe(uglify()) // Mifify js (opt.)
// 	.pipe(gulp.dest('dist/js'))
// 	.pipe(browserSync.reload({ stream: true }))
// });

gulp.task('gcmq', async function () {
    gulp.src('src/css/main.gcmq.css')
        .pipe(gcmq())
        .pipe(rename("main.css"))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('copy-img', function() {
    return gulp.src('./src/img/*.{png,svg,jpg}')
        .pipe(gulp.dest('./dist/imgs'));
});

gulp.task('copy-font', function() {
    return gulp.src('./src/font/**/*.{woff,woff2,eof}')
        .pipe(gulp.dest('./dist/fonts'));
});


// gulp.task('rename', function() {
//     return gulp.src('src/css/main.gcmq.css')
//     .pipe(rename("main.css"))
//     .pipe(gulp.dest('./dist/css'));
// });

gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch(['src/sass/**/*.sass', './src/pug/modules/**/*.sass'], gulp.parallel('styles'));
    gulp.watch(['src/css/main.gcmq.css'], gulp.parallel('gcmq'));
	gulp.watch('src/pug/**/*.pug', gulp.parallel('pug'));
});

gulp.task('default', gulp.parallel('styles', 'gcmq', 'pug', 'browser-sync', 'watch'));
gulp.task('copy', gulp.parallel('copy-img', 'copy-font'));