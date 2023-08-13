class WrongOrderForTreeShakingPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'WrongOrderForTreeShakingPlugin',
      (compilation) => {
        compilation.hooks.seal.tap('WrongOrderForTreeShakingPlugin', () => {
          const sortedModules = Array.from(compilation.modules).sort((a, _b) =>
            a.request.includes('bar.js') ? -1 : 1
          );
          compilation.modules = new Set(sortedModules);
        });
      }
    );
  }
}

module.exports = WrongOrderForTreeShakingPlugin;
