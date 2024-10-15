// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/worker.js',
        format: 'es',
    },
    plugins: [
        resolve(),
        commonjs(),
    ],
};