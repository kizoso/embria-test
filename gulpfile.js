'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
	notify = require('gulp-notify');


var path = {
	build: {
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		js: 'src/js/*.js',
		style: 'src/style/*.sass',
		img: 'src/img/*.*',
		fonts: 'src/fonts/*.*'
	},
	watch: {
		js: 'src/js/*.js',
		style: 'src/style/*.sass',
		img: 'src/img/*.*',
		fonts: 'src/fonts/*.*'
	},
	clean: './build'
};


var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "LS"
};

gulp.task('webserver', function () {
	browserSync(config);
});


gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
	gulp.src(path.src.style)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer())
		.pipe(concat('combined.css'))
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
	gulp.src(path.src.img)
		.pipe(plumber())
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
	gulp.src(path.src.fonts)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', [
  'js:build',
  'style:build',
  'image:build',
  'fonts:build'
]);


gulp.task('watch', function(){
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

gulp.task('push', ['clean'], function () {
  gulp.start('build');
});

gulp.task('default', ['build', 'watch']);