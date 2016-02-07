var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		app: 'init.js'
	},
	output: {
		path: __dirname,
		filename: 'public/[name].js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules|bower_components/,
				loader: 'babel',
			},
			{
				test: /\.css$/,
				loaders: [
					'style-loader',
					'css-loader'
				]
			},
		]
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(true),
	],
	resolve: {
		'root': path.join(__dirname, 'src')
	},
};
