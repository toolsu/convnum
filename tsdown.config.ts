import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

const define = {
  __VERSION__: JSON.stringify(pkg.version),
}

export default defineConfig([
  // ESM + CJS builds, with bundled type declarations (.d.ts / .d.cts)
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    target: 'es2015',
    outDir: 'dist',
    dts: true,
    clean: true,
    sourcemap: true,
    treeshake: true,
    // Keep the published file names stable: index.js/.d.ts (ESM, the package is
    // "type": "module") and index.cjs/.d.cts (CJS)
    outExtensions: ({ format }) =>
      format === 'es'
        ? { js: '.js', dts: '.d.ts' }
        : { js: '.cjs', dts: '.d.cts' },
    define,
  },
  // Minified single-file IIFE build for <script> / unpkg usage
  {
    entry: ['src/index.ts'],
    format: 'iife',
    globalName: 'convnum',
    platform: 'browser',
    target: 'es2015',
    outDir: 'dist',
    outputOptions: { entryFileNames: 'index.global.js' },
    dts: false,
    clean: false,
    minify: true,
    sourcemap: false,
    treeshake: true,
    define,
  },
])
