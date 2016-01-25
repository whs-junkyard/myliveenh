import gulp from 'gulp';
import webpack from 'webpack-stream';
import file from 'gulp-file';
import chromeGenerator from './tools/chrome-manifest';
import path from 'path';

const dest = 'build';
const webpackConfig = {
	watch: true,
	output: {
		filename: 'background.js'
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
			}
		]
	},
	resolve: {
		root: [
			path.resolve(path.join(__dirname, 'src'))
		]
	}
};

gulp.task('default', ['generate-chrome-manifest', 'copy', 'build']);

gulp.task('generate-chrome-manifest', () => {	
	return file('manifest.json', JSON.stringify(chromeGenerator(), null, '\t'), {src: true})
		.pipe(gulp.dest(dest));
});

gulp.task('build', () => {
	gulp.src('src/chrome/background.js', {base: './'})
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest(dest));
});

gulp.task('copy', () => {
	return gulp.src([
		'data/**/*'
	], {base: './'})
		.pipe(gulp.dest(dest));
});

gulp.task('watch', () => {
	gulp.watch('tools/chrome-manifest.js', ['generate-chrome-manifest']);
	gulp.watch('src/**/*.js', ['build']);
});