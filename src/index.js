
import hello from './nodes/hello/index.js';
import test from './nodes/test/index.js';

const nodes = [hello, test];

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const results = [];

    for (const nodeFunction of nodes) {
        const result = await nodeFunction();
        results.push(result);
    }

    return new Response(results.join('\n'), { status: 200 });
}
