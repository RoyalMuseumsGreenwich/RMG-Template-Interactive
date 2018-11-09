const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

//	Folder structure
var rootDirs = {
	src: 'src/',
	dist: 'dist/'
}

gulp.task('message', () => {
	return console.log("Gulp start!");
});

//	Copy all HTML files from 'src' to 'dist' (creates new folder if it doesn't already exist)
gulp.task('copyHtml', (done) => {
	gulp.src(rootDirs.src + '*.html')
		.pipe(gulp.dest(rootDirs.dist));
		done();
});

//	Compile Sass
gulp.task('sass', (done) => {
	gulp.src(rootDirs.src + 'sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(rootDirs.dist + 'css'))
		.pipe(browserSync.reload({
			stream: true
		}));
		done();
});

//	Scripts
gulp.task('scripts', (done) => {
	gulp.src(rootDirs.src + 'js/*.js')
		// .pipe(concat('main.js'))
		// .pipe(uglify())
		.pipe(gulp.dest(rootDirs.dist + 'js'));
		done();
});

gulp.task('lib', (done) => {
	gulp.src(rootDirs.src + 'lib/*.*')
		.pipe(gulp.dest(rootDirs.dist + 'lib'));
		done();
});


//	Trigger browserSync reload on change events
gulp.task('watch-html', gulp.series(['copyHtml'], (done) => {
	browserSync.reload();
	done();
}));
gulp.task('watch-sass', gulp.series(['sass'], (done) => {
	browserSync.reload();
	done();
}));
gulp.task('watch-js', gulp.series(['scripts'], (done) => {
	browserSync.reload();
	done();
}));
gulp.task('watch-lib', gulp.series(['lib'], (done) => {
	browserSync.reload();
	done();
}));

//	Main task - run ~$ gulp to run task array, start browserSync and watch for further changes
gulp.task('default', gulp.series(['copyHtml', 'sass', 'scripts', 'lib'], () => {
	browserSync.init({
		server: {
			baseDir: rootDirs.dist
		}
	});
	gulp.watch(rootDirs.src + '*.html', gulp.series('watch-html'));
	gulp.watch(rootDirs.src + 'sass/*.scss', gulp.series('watch-sass'));
	gulp.watch(rootDirs.src + 'js/*.js', gulp.series('watch-js'));
	gulp.watch(rootDirs.src + 'lib/**/*.*', gulp.series('watch-lib'));
}));


//	*******************************************************************
//	Notes
//	*******************************************************************

//	Globbing - 4 common patterns:
//	*.scss						=	Any .scss files in root folder
//	**/*.scss					=	Any .scss files in root folder and its children
//	!not-me.scss			= Exclude 'not-me.scss' from match	
//	*.+(scss|sass)		=	Matches any .scss or .sass files in root folder


