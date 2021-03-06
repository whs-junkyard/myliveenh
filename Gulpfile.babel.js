import path from 'path';
import childProcess from 'child_process';

import gulp from 'gulp';
import webpackModule from 'webpack';
import webpack from 'webpack-stream';
import file from 'gulp-file';
import named from 'vinyl-named';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import zip from 'gulp-zip';
import deepcopy from 'deepcopy';
import glob from 'glob-promise';
import uglify from 'gulp-uglify/minifier';
import uglifyJS from 'uglify-js';
import cssnano from 'cssnano';
import cssNesting from 'postcss-nesting';
import cssColor from 'postcss-color-function';

import chromeGenerator from './tools/chrome-manifest';
import getBackgroundScripts from './tools/get-background';
import getContentScripts from './tools/get-content-script';
import emojiDB from './tools/emojidb';

const dest = 'build';
const postcssConfig = () => {
	return [
		cssNesting(),
		cssColor(),
		cssnano(),
	];
};
const webpackConfig = {
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
			},
			{
				test: /\.json$/,
				loader: 'json',
			},
			{
				test: /\.txt$/,
				loader: 'raw',
			},
		],
	},
	resolve: {
		root: [
			path.resolve(path.join(__dirname, 'src')),
		],
	},
	plugins: [
		new webpackModule.optimize.OccurrenceOrderPlugin(),
	],
	postcss: postcssConfig,
};

gulp.task('default', ['generate-chrome-manifest', 'copy', 'copy-modules', 'build', 'build-settings', 'build-license']);
gulp.task('build', ['build-background', 'build-css', 'build-content-script', 'build-js']);

gulp.task('generate-chrome-manifest', async function(){
	return file(
		'manifest.json',
		JSON.stringify(await chromeGenerator()),
		{src: true}
	).pipe(gulp.dest(dest));
});

gulp.task('generate-background', (cb) => {
	getBackgroundScripts().then((backgrounds) => {
		return backgrounds.map(item => {
			item = path.join('..', item);
			let modName = path.relative('../src/', item).replace(/\//g, '_').replace(/\.js/, '');
			return `import ${modName} from ${JSON.stringify(item)};`;
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
	let config = deepcopy(webpackConfig);
	config.output = {
		filename: 'background.js',
	};

	return gulp.src(path.join(dest, 'background.js'))
		.pipe(webpack(config))
		.pipe(gulp.dest(dest));
});

gulp.task('build-css', () => {
	return gulp.src([
		'src/**/*.scss',
	], {base: './src/'})
		.pipe(postcss(postcssConfig()))
		.pipe(rename((file) => {
			file.extname = '.css';
			return file;
		}))
		.pipe(gulp.dest(dest));
});

gulp.task('build-content-script', (cb) => {
	let config = deepcopy(webpackConfig);
	config.plugins.push(new webpackModule.optimize.CommonsChunkPlugin({
		name: 'commons',
		minChunks: 3,
	}));

	getContentScripts().then((scripts) => {
		return gulp.src(Array.from(scripts.values()));
	}).then((source) => {
		let srcRoot = path.join(__dirname, 'src');

		return source.pipe(named((file) => {
			return path.relative(srcRoot, file.path).replace(/\.js$/, '');
		}))
			.pipe(webpack(config))
			.pipe(gulp.dest(dest))
			.on('end', cb);
	});
});

gulp.task('build-settings', () => {
	let config = deepcopy(webpackConfig);
	config.module.loaders.push({
		test: /\.css$/,
		loaders: ['style-loader', 'css-loader'],
	});
	config.module.loaders.push({
		test: /\.(eot|ttf|svg|otf)$/,
		loader: 'file-loader',
	});

	return gulp.src('src/core/settings.js')
		.pipe(named())
		.pipe(webpack(config))
		.pipe(gulp.dest(path.join(dest, 'settings')));
});

gulp.task('build-license', () => {
	let config = deepcopy(webpackConfig);
	config.module.loaders.push({
		test: /\.css$/,
		loaders: ['style-loader', 'css-loader'],
	});
	config.module.loaders.push({
		test: /\.(eot|ttf|svg|otf)$/,
		loader: 'file-loader',
	});

	return gulp.src('src/core/license.js')
		.pipe(named())
		.pipe(webpack(config))
		.pipe(gulp.dest(path.join(dest, 'settings')));
});

gulp.task('build-js', (cb) => {
	let config = deepcopy(webpackConfig);
	config.module.loaders.push({
		test: /\.css$/,
		loaders: ['style-loader', 'css-loader'],
	});
	config.module.loaders.push({
		test: /\.(eot|ttf|svg|otf)$/,
		loader: 'file-loader',
	});

	glob('./src/*/package.json').then((files) => {
		let build = [];
		for(let file of files){
			let metadata = require(file);
			if(metadata.build){
				build = build.concat(metadata.build.map((item) => {
					return path.join(path.dirname(file), item);
				}));
			}
		}

		gulp.src(build)
			.pipe(named((file) => {
				return path.relative('src', file.path).replace(/\.js$/, '');
			}))
			.pipe(webpack(config))
			.pipe(gulp.dest(dest))
			.on('end', cb);
	});
});

gulp.task('build-emoji-db', () => {
	return file(
		'emoji.json',
		JSON.stringify(emojiDB()),
		{src: true}
	).pipe(gulp.dest('src/emojipicker/'));
});

gulp.task('copy', () => {
	return gulp.src([
		'data/**/*',
		'settings/**/*',
	], {base: './'})
		.pipe(gulp.dest(dest));
});

gulp.task('copy-modules', () => {
	return gulp.src([
		'src/**/*',
		'!src/**/*.js',
		'!src/**/*.scss',
		'!src/**/package.json',
	], {base: './src/'})
		.pipe(gulp.src('src/core/stop_angular.js', {base: './src/'}))
		.pipe(gulp.dest(dest));
});

gulp.task('watch', () => {
	gulp.watch([
		'src/**/*.js',
		'src/**/*.scss',
	], ['build']);
	gulp.watch([
		'data/**/*',
		'settings/**/*',
	], ['copy']);
	gulp.watch([
		'src/**/*',
		'!src/**/*.js',
		'!src/**/*.scss',
	], ['copy-modules']);
	// gulp.watch([
	// 	'src/core/settings.js',
	// 	'settings/**/*'
	// ], ['build-settings']);
});

gulp.task('compress-js', ['default'], () => {
	return gulp.src(path.join(dest, '**/*.js'))
		.pipe(uglify({}, uglifyJS))
		.pipe(gulp.dest(dest));
});

gulp.task('release-src', (cb) => {
	childProcess.exec('tools/prepare-src.sh', {}, (err, stdout, stderr) => {
		if(err){
			return cb(err);
		}
		console.error(stderr);
		cb();
	});
});

gulp.task('release', ['default', 'compress-js'], () => {
	console.log('*** Make sure release folder is cleared, otherwise removed artifacts could be still present');

	let config = 'chrome';

	if(process.env.MOZ){
		config = 'moz';
	}

	return gulp.src(path.join(dest, '**/*'))
		.pipe(zip('release-' + config + '.zip'))
		.pipe(gulp.dest('.'));
});
