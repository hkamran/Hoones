var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var tar = require('gulp-tar');
var p = require('./package.json')

var dir = {
  src: 		'./src/**/*',
  assets:	'./assets/**/*',
  roms:		'./roms/**/*',
  target:	'./target/**/*'
};

gulp.task('clean', function() {
  return del(['target']);
});

gulp.task('src', function() {
	return gulp.src(dir.src)
		.pipe(gulp.dest('target/'));
});

gulp.task('assets', function() {
	return gulp.src(dir.assets)
		.pipe(gulp.dest('target/assets/'));
});

gulp.task('roms', function() {
	return gulp.src(dir.roms)
		.pipe(gulp.dest('target/roms/'));
});

gulp.task('package', function() {
	var name = "Hoones-" + p.version + ".tar";
	return gulp.src(['!target/' + name, dir.target])
		.pipe(tar(name))
		.pipe(gulp.dest('target/'));
});

gulp.task('build', ['assets', 'src', 'roms']);

gulp.task('watch', function() {
  gulp.watch(dir.src, ['build']);
});

gulp.task('default', function(callback) {
	runSequence('clean',
				'build',
				'package',
				 callback);
});