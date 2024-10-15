// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/worker.js',
        format: 'es',
    },
    plugins: [
        resolve({
            browser: true, // Resolve for browser environment
            preferBuiltins: false, // Do not prefer Node.js built-ins
        }),
        commonjs(), // Convert CommonJS modules to ES6
        terser(), // Minify the output
    ],
};