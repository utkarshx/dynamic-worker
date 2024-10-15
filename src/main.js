import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { installNunjucks } from "hono-nunjucks";
import templates from "./templates/precompiled.mjs";
import deployWorker from '../src/deploy.js';
import { execSync } from 'child_process';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Hono();

app.use("*", installNunjucks({ templates }));

app.post('/deploy', async (c) => {
    const data = await c.req.json();
    const uid = uuidv4();
    const workspaceDir = path.resolve(__dirname, `../workspace/${uid}`);
    const nodesDir = path.join(workspaceDir, 'nodes');
    const t = c.get("t");

    // Create workspace and nodes directories
    fs.mkdirSync(nodesDir, { recursive: true });

    // Create nodes
    createNodes(data.functions, nodesDir);

    // Create index.js
    createIndexJs(nodesDir, workspaceDir, t);

    // Create rollup.config.js
    createRollupConfig(workspaceDir, t);

    // Create package.json
    createPackageJson(workspaceDir, t);

    // Install the required node modules in the workspace directory
    execSync('npm install', { cwd: workspaceDir, stdio: 'inherit' });

    // Initialize and install node modules for each function
    data.functions.forEach(func => {
        const funcDir = path.join(nodesDir, func.name);
        // Initialize a new npm package in each node directory
        execSync('npm init -y', { cwd: funcDir, stdio: 'inherit' });
        // Install the required node modules for each function
        if (func.node_modules.length > 0) {
            execSync(`npm install ${func.node_modules.join(' ')}`, { cwd: funcDir, stdio: 'inherit' });
        }
    });



    // Run rollup to bundle the project
    execSync('npx rollup -c', { cwd: workspaceDir, stdio: 'inherit' });

    await deployWorker(path.join(workspaceDir, 'dist','worker.js'));

    return c.text(`Deployment created with UID: ${uid}`);
});

function createPackageJson(workspaceDir, t) {
    const packageJsonTemplate = t.render("package.json");
    const packageJsonPath = path.join(workspaceDir, 'package.json');
    fs.writeFileSync(packageJsonPath, packageJsonTemplate);
}

function createRollupConfig(workspaceDir, t) {
    const rollupConfigTemplate = t.render("rollup.config.js");
    const rollupConfigPath = path.join(workspaceDir, 'rollup.config.js');
    fs.writeFileSync(rollupConfigPath, rollupConfigTemplate);
}

function createNodes(functions, nodesDir) {
    functions.forEach(func => {
        const funcDir = path.join(nodesDir, func.name);
        fs.mkdirSync(funcDir, { recursive: true });
        const funcFilePath = path.join(funcDir, 'index.js');
        fs.writeFileSync(funcFilePath, func.code);
    });
}

function createIndexJs(nodesDir, workspaceDir, t) {
    const folders = fs.readdirSync(nodesDir).filter(folder => {
        const folderPath = path.join(nodesDir, folder);
        return fs.statSync(folderPath).isDirectory();
    });

    const imports = folders.map(folder => {
        return `import ${folder} from './nodes/${folder}/index.js';`;
    }).join('\n');

    const nodesArray = folders.join(', ');

    // Define the template data
    const templateData = {
        imports,
        nodesArray
    };

    const indexContent = t.render("indexTemplate", templateData);
    const indexPath = path.join(workspaceDir, 'index.js');
    fs.writeFileSync(indexPath, indexContent);
}

serve(app);