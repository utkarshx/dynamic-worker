async function hello() {
    return "Hello";
}

async function test() {
    return "Hello 2";
}

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
