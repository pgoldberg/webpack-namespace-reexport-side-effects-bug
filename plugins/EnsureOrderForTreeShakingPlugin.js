class EnsureOrderForTreeShakingPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'EnsureOrderForTreeShakingPlugin',
      (compilation) => {
        compilation.hooks.seal.tap('EnsureOrderForTreeShakingPlugin', () => {
          const moduleArray = Array.from(compilation.modules);
          const fooIndex = moduleArray.findIndex((m) => m.request.includes('foo.js'));
          const barIndex = moduleArray.findIndex((m) => m.request.includes('bar.js'));
          if (fooIndex < barIndex) {
            return;
          }
          const sortedModules = Array.from(compilation.modules).sort((a, _b) =>
            a.request.includes('foo.js') ? -1 : 1
          );
          compilation.modules = new Set(sortedModules);
        });
      }
    );
  }
}

module.exports = EnsureOrderForTreeShakingPlugin;
