import gulp from 'gulp';
import del from 'del';
import env from 'gulp-env';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';

const dest = 'build/';

gulp.task('default', ['copy', 'compile']);

gulp.task('clean', () => {
	return del(dest);
});

gulp.task('compile', () => {
	let webpack = require('webpack');
	let config = require('./webpack.config.js');

	config.plugins.push(new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('production'),
		},
	}));
	config.plugins.push(new webpack.optimize.DedupePlugin());
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		minimize: true,
		compress: {
			warnings: false,
		},
	}));
	
	env.set({
		NODE_ENV: 'production',
	});

	return gulp.src('src/init.js')
		.pipe(webpackStream(config))
		.pipe(gulp.dest(dest));
});

gulp.task('copy', () => {
	return gulp.src([
		'./index.html',
	], {base: './'})
		.pipe(gulp.dest(dest));
});
