// build/generateIndex.js
const fs = require('fs');
const path = require('path');

const nodesDir = path.resolve(__dirname, '../src/nodes');
const indexPath = path.resolve(__dirname, '../src/index.js');

const files = fs.readdirSync(nodesDir).filter(file => file.endsWith('.js'));

const imports = files.map(file => {
    const moduleName = path.basename(file, '.js');
    return `import ${moduleName} from './nodes/${file}';`;
}).join('\n');

const nodesArray = files.map(file => path.basename(file, '.js')).join(', ');

const indexContent = `
${imports}

const nodes = [${nodesArray}];

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const results = [];

    for (const nodeFunction of nodes) {
        const result = await nodeFunction();
        results.push(result);
    }

    return new Response(results.join('\\n'), { status: 200 });
}
`;

fs.writeFileSync(indexPath, indexContent);