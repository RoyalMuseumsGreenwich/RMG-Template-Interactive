const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

var kiosk;						//	Flag to set when compiling for 'kiosk production' with $ gulp kiosk

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
	let stream = kiosk ? gulp.src(rootDirs.src + 'sass/*.scss') : gulp.src([rootDirs.src + 'sass/*.scss', '!' + rootDirs.src + 'sass/kiosk.scss']);
	stream.pipe(concat('styles.scss'))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(rootDirs.dist + 'css'))
		.pipe(browserSync.reload({
			stream: true
		}));
		done();
});

//	Scripts
gulp.task('scripts', (done) => {
	del([rootDirs.dist + 'js/kiosk.js']).then(paths => {
		console.log('Deleted:\n', paths.join('\n'));
		let stream = kiosk ? gulp.src(rootDirs.src + 'js/*.js') : gulp.src([rootDirs.src + 'js/*.js', '!' + rootDirs.src + 'js/kiosk.js']);
		stream.pipe(gulp.dest(rootDirs.dist + 'js'));
			done();
		})
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
gulp.task('default', gulp.series((done) => {kiosk = false; done();}, ['copyHtml', 'sass', 'scripts', 'lib'], browserSyncWatch));

//	Build for kiosk mode
gulp.task('kiosk', gulp.series((done) => {kiosk = true; done();}, ['copyHtml', 'sass', 'scripts', 'lib'], browserSyncWatch));


function browserSyncWatch() {
	browserSync.init({
		server: {
			baseDir: rootDirs.dist
		}
	});
	gulp.watch(rootDirs.src + '*.html', gulp.series('watch-html'));
	gulp.watch(rootDirs.src + 'sass/*.scss', gulp.series('watch-sass'));
	gulp.watch(rootDirs.src + 'js/*.js', gulp.series('watch-js'));
	gulp.watch(rootDirs.src + 'lib/**/*.*', gulp.series('watch-lib'));
}



//	*******************************************************************
//	Notes
//	*******************************************************************

//	Globbing - 4 common patterns:
//	*.scss						=	Any .scss files in root folder
//	**/*.scss					=	Any .scss files in root folder and its children
//	!not-me.scss			= Exclude 'not-me.scss' from match	
//	*.+(scss|sass)		=	Matches any .scss or .sass files in root folder


