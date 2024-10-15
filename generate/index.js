// build/generateIndex.js
const fs = require('fs');
const path = require('path');

const nodesDir = path.resolve(__dirname, '../src/nodes');
const indexPath = path.resolve(__dirname, '../src/index.js');

const folders = fs.readdirSync(nodesDir).filter(folder => {
    const folderPath = path.join(nodesDir, folder);
    return fs.statSync(folderPath).isDirectory();
});

const imports = folders.map(folder => {
    return `import ${folder} from './nodes/${folder}/index.js';`;
}).join('\n');

const nodesArray = folders.join(', ');

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