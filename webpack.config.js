module.exports = function (env) {
  var config = {
    entry: './src/client/index.ts',
    output: {
      path: __dirname + '/docs',
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['node_modules', 'web_modules']
    },
    devServer: {
      contentBase: 'docs',
      proxy: {
        '/api/**': {
          target: 'http://localhost:3000'
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /(node_modules|web_modules)/,
          loader: 'awesome-typescript-loader'
        }
      ]
    }
  };
  if (env == null || !env.build) {
    config.devtool = 'source-map';
  }
  return config;
}
