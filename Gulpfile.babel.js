import gulp from 'gulp';
import webpack from 'webpack-stream';
import file from 'gulp-file';
import chromeGenerator from './tools/chrome-manifest';
import getBackgroundScripts from './tools/get-background';
import path from 'path';

const dest = 'build';
const webpackConfig = {
	// watch: true,
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
gulp.task('build', ['build-background']);

gulp.task('generate-chrome-manifest', async function(){
	return file(
		'manifest.json',
		JSON.stringify(await chromeGenerator(), null, '\t'),
		{src: true}
	).pipe(gulp.dest(dest));
});

gulp.task('generate-background', (cb) => {
	getBackgroundScripts().then((backgrounds) => {
		return backgrounds.map(item => {
			item = path.join('..', item);
			return `import ${path.basename(item).replace(/\.js/, '')} from ${JSON.stringify(item)};`;
		}).join('\n');
	}).then((script) => {
		// seems gulp does not understand a promise that return a stream
		return file(
			'background.js',
			script,
			{src: true}
		)
			.pipe(gulp.dest(dest))
			.on('end', cb);
	});
});
gulp.task('build-background', ['generate-background'], () => {
	let config = Object.assign({}, webpackConfig);
	config.output = {
		filename: 'background.js'
	};

	return gulp.src(path.join(dest, 'background.js'))
		.pipe(webpack(config))
		.pipe(gulp.dest(dest));
});

gulp.task('copy', () => {
	return gulp.src([
		'data/**/*'
	], {base: './'})
		.pipe(gulp.dest(dest));
});

gulp.task('watch', () => {
	gulp.watch('src/**/*.js', ['build']);
});