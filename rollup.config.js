// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/worker.js',
        format: 'es',
    },
    plugins: [resolve()],
};