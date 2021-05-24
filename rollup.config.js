import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isDev = process.env.ROLLUP_WATCH;
const isProd = process.env.NODE_ENV === 'production';

function bundle(file, format) {
  return {
    sourcemap: false,
    name: 'smoo',
    format,
    file,
  };
}

export default {
  input: isProd ? 'src/main.js' : 'e2e/main.js',
  output: isProd ? [
    bundle('dist/smoo.js', 'cjs'),
    bundle('dist/smoo.es.js', 'es'),
    bundle('dist/smoo.min.js', 'umd'),
  ] : bundle('docs/test.js', 'iife'),
  external: isProd ? ['svelte', 'svelte/store', 'svelte/internal'] : [],
  plugins: [
    svelte({
      emitCss: false,
      compilerOptions: {
        dev: isDev,
      },
      onwarn: (warning, handler) => {
        if (warning.code === 'module-script-reactive-declaration') return;
        handler(warning);
      },
    }),
    resolve(),
    commonjs(),
    isProd && terser(),
  ],
};
