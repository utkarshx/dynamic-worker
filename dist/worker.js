async function hello() {
    return "Hello";
}

async function test() {
    return "Hello 2";
}

// src/index.js

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
