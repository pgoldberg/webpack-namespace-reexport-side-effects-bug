## Bug explanation

There's a bug in Webpack's `SideEffectsFlagPlugin` that causes nondeterministic build output. Depending on the order of `compilation.modules` (an unordered `Set`), the `SideEffectsFlagPlugin` will sometimes not remove a side-effect-free module from the graph when it's re-exporting a module via a namespace export.

In this example, `foo.js` re-exports `bar.js` via a namespace re-export (`export * as bar from "./bar.js"`). If `foo.js` is ordered after `bar.js` in `compilation.modules`, then it correctly gets removed from the module graph. However, if `bar.js` is ordered before `foo.js`, then `foo.js` _does not_ get removed from the graph.

Because this is a small bundle with small modules, the module order is pretty much guaranteed to be the same between runs. In order to repro the issue, I created two small plugins to ensure module orders that replicate the bug (`EnsureOrderForTreeShakingPlugin` and `WrongOrderForTreeShakingPlugin`).

#### When `foo.js` is ordered before `bar.js`, the `optimizeDependencies` hook callback in `SideEffectsFlagPlugin`:
1. Deactivates the connection between `app.js` and `foo.js` and creates a new one between `app.js` and `bar.js` (when processing `foo.js`'s `incomingConnections`)
2. Deactivates the new connection between `app.js` and `bar.js` and creates a new one between `app.js` and `baz.js` (when processing `bar.js`'s incomingConnections)

#### When `bar.js` is ordered before `foo.js`, the `optimizeDependencies` hook callback in `SideEffectsFlagPlugin`:
1. Does not create a new connection when processing `bar.js` (hits this code path: https://github.com/webpack/webpack/blob/64707c9c4fd5307d4997f0e73145ca26c5245bc3/lib/ModuleGraph.js#L229)
2. Deactivates the connection between `app.js` and `foo.js` and creates a new one between `app.js` and `bar.js` (when processing `foo.js`'s `incomingConnections`)

Because it never re-processes `bar.js`'s `incomingConnections`, it is never able to deactivate the connection between `app.js` and `bar.js` + create a new one between `app.js` and `baz.js`.
