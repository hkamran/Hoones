var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var tar = require('gulp-tar');
var p = require('./package.json')

var dir = {
  src: 		'./src/**/*',
  target:	'./target/**/*'
};

gulp.task('clean', function() {
  return del(['target']);
});

gulp.task('src', function() {
	return gulp.src(dir.src)
		.pipe(gulp.dest('target/'));
});

gulp.task('package', function() {
	var name = "Hoones-" + p.version + ".tar";
	return gulp.src(['!target/' + name, dir.target])
		.pipe(tar(name))
		.pipe(gulp.dest('target/'));
});

gulp.task('build', ['clean', 'src']);

gulp.task('watch', function() {
  gulp.watch(dir.src, ['clean', 'build']);
});

gulp.task('default', function(callback) {
	runSequence('clean',
				'build',
				'package',
				 callback);
});