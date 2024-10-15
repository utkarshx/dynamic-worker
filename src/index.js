// src/index.js
import hello from './nodes/hello';
import test from './nodes/test';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const nodes = [hello, test];
    const results = [];

    for (const node of nodes) {
        const result = await node();
        results.push(result);
    }

    return new Response(results.join('\n'), { status: 200 });
}