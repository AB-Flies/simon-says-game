const path = require('path');

module.exports = {
  entry: {
    app: './ts/app.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './ts/app.ts',
  },
};
