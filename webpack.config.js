const path = require('path');

module.exports = {
  // Set the mode explicitly (fixes the warning)
  mode: 'development', 

  entry: './src/index.js', 

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },

  module: {
    rules: [
      // Rule for handling CSS files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Rule for handling JavaScript files (fixes the 'import/export' error)
      {
        test: /\.js$/,
        exclude: /node_modules/, // Don't process code in node_modules
        use: {
          loader: 'babel-loader', // We'll install Babel next
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
};
