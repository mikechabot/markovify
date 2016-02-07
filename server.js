var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  hot: true,
  historyApiFallback: true
}).listen(3040, 'localhost', function (error, result) {
  if (error) {
    console.log(err);
  }
  console.log('Listening at localhost:3040');
});
