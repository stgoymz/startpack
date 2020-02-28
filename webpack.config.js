const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');

const basePath = __dirname;
const distPath = 'dist';
const indextInput = './src/index.html';
const indexOutput = 'index.html';

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HTMLWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    });
  });
}
const htmlPlugins = generateHtmlPlugins('./src/templates/views');

const webpackInitConfig = {
  mode: 'development',
  resolve: {
    extensions: ['.js']
  },
  entry: {
    app: ['./src/index.js'],
  },
  output: {
    path: path.join(basePath, distPath),
    filename: '[chunkhash][name].js'
  },
  plugins: [
    // new ExtractTextPlugin('css/styles.css')
  ]  
  .concat(htmlPlugins)
};

module.exports = webpackInitConfig;