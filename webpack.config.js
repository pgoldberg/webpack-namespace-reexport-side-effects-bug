const path = require('node:path');
const EnsureOrderForTreeShakingPlugin = require('./plugins/EnsureOrderForTreeShakingPlugin.js');
const WrongOrderForTreeShakingPlugin = require('./plugins/WrongOrderForTreeShakingPlugin.js');

module.exports = [
  {
    mode: 'production',
    entry: { app: ['./app/index.js'] },
    output: {
      path: path.resolve(__dirname, './build/correct'),
    },
    optimization: {
      minimizer: [],
    },
    plugins: [new EnsureOrderForTreeShakingPlugin()],
  },
  {
    mode: 'production',
    entry: { app: ['./app/index.js'] },
    output: {
      path: path.resolve(__dirname, './build/incorrect'),
    },
    optimization: {
      minimizer: [],
    },
    plugins: [new WrongOrderForTreeShakingPlugin()],
  },
];
