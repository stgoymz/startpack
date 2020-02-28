const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtract = require('mini-css-extract-plugin');
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
    extensions: ['.js', '.ts']
  },
  entry: {
    app: ['@babel/polyfill', './src/index.ts'],
  },
  output: {
    path: path.join(basePath, distPath),
    filename: '[chunkhash][name].js'
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },      
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader',
        ]
      },
      {
        test: /\.ts/,
        exclude: /node_modules/,
        use: ['ts-loader'],
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
              outputPath: 'assets/img/',
              publicPath: 'assets/img/',
            },
          },
        ],
      },        
    ]
  },  
  plugins: [
    new MiniCSSExtract({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),    
  ]  
  .concat(htmlPlugins)
};

module.exports = webpackInitConfig;