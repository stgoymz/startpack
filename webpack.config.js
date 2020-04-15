const path = require('path');
const fs = require('fs');
const webfontsGenerator = require('webfonts-generator');
const prodConfig = require('./webpack.config.prod.js');
const devConfig = require('./webpack.config.dev.js');

function getIconsFilesSvg(templateDir) {
	const svgFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
	const files = svgFiles.map((file) => {
		let string;
		if (file.includes('.svg')) {
			string = `src/assets/icons/${file}`;
		}
		return string;
	});
	return files.filter((item) => typeof item === 'string');
}

const filesSvg = getIconsFilesSvg('./src/assets/icons');

webfontsGenerator({
	files: filesSvg,
	dest: 'src/assets/fonts',
	cssDest: 'src/scss/project/_icons.scss',
	fontName: 'project-icons',
	cssFontsUrl: 'assets/fonts/',
	types: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
	html: false,
	templateOptions: {
		baseSelector: '.ico',
		classPrefix: 'ico-',
	},
}, (error) => {
	if (error) {
		// eslint-disable-next-line no-console
		console.log('Fuck!', error);
	} else {
		// eslint-disable-next-line no-console
		console.log('fillet!, we have the icons');
	}
});

function webpackEnviromentSelector(env) {
	if (env.production) return prodConfig;
	if (env.devConfig) return devConfig;
	return devConfig;
}
module.exports = webpackEnviromentSelector;
