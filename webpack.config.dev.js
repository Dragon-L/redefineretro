const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ip = require('ip');
const lostIp = ip.address();
const PORT = 3000;
const config = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://' + lostIp + ':' + PORT,
    path.resolve(__dirname, './app/index.js')
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'http://' + lostIp + ':' + PORT + '/' // 引用路径
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [ 'babel' ,'eslint-loader']
      },
      {
        test: /\.css$/,
        loaders: [ 'style', 'css?sourceMap' ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/i,
        loader: 'file-loader?name=fonts/[name]-[hash].[ext]'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        loaders: [
          'url?limit=10000&name=img/[hash:8].[name].[ext]', // 图片小于8k就转化为 base64, 或者单独作为文件
          'image-webpack'
        ]
      }
    ]
  },
  eslint: {
    configFile: './.eslintrc'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.html',
      filename: 'index.html',
      inject: true,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({ url: 'http://' + lostIp + ':' + PORT }),
    new DashboardPlugin()
  ]
};

module.exports = config;