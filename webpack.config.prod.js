const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtract = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const fs = require('fs');

const basePath = __dirname;
const distPath = 'dist';

function generateHtmlPlugins(templateDir) {
	const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
	return templateFiles.map((item) => {
		const parts = item.split('.');
		const name = parts[0];
		const extension = parts[1];
		return new HTMLWebpackPlugin({
			filename: `${name}.html`,
			template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
			minify: true,
		});
	});
}
const htmlPlugins = generateHtmlPlugins('./src/templates/views');

const webpackInitConfig = {
	mode: 'production',
	devtool: 'none',
	resolve: {
		extensions: ['.js', '.ts'],
	},
	entry: {
		app: ['@babel/polyfill', './src/index.js'],
	},
	output: {
		path: path.join(basePath, distPath),
		filename: '[name]-[chunkhash].js',
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: 'pug-loader',
			},
			{
				test: /\.js/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
					'eslint-loader',
				],
			},
			{
				test: /\.ts/,
				exclude: /node_modules/,
				use: ['ts-loader'],
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				loader: 'file-loader',
				options: {
					name: 'assets/fonts/[name].[ext]',
				},
			},
			{
				test: /\.css/,
				exclude: /node_modules/,
				use: [
					MiniCSSExtract.loader,
					'css-loader',
					'postcss-loader',
				],
			},
			{
				test: /\.scss/,
				exclude: /node_modules/,
				use: [
					MiniCSSExtract.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/img/',
							publicPath: 'assets/img/',
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCSSExtract({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new CopyPlugin([
			{
				from: `${basePath}/src/assets`,
				to: 'assets',
				ignore: ['icons/**/*'],
			},
		]),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
		}),
		new OptimizeCssAssetsPlugin(),
	]
		.concat(htmlPlugins),
};

module.exports = webpackInitConfig;
