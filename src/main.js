import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { installNunjucks } from "hono-nunjucks";
import templates from "./templates/precompiled.mjs";




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Hono();

app.use("*", installNunjucks({templates}) );

app.post('/deploy', async (c) => {
  const data = await c.req.json();
  const uid = uuidv4();
  const workspaceDir = path.resolve(__dirname, `../workspace/${uid}`);
  const nodesDir = path.join(workspaceDir, 'nodes');

  // Create workspace and nodes directories
  fs.mkdirSync(nodesDir, { recursive: true });

  // Create nodes
  createNodes(data.functions, nodesDir);

  // Create index.js
  createIndexJs(nodesDir, workspaceDir, c);

  return c.text(`Deployment created with UID: ${uid}`);
});

function createNodes(functions, nodesDir) {
  functions.forEach(func => {
    const funcDir = path.join(nodesDir, func.name);
    fs.mkdirSync(funcDir, { recursive: true });
    const funcFilePath = path.join(funcDir, 'index.js');
    fs.writeFileSync(funcFilePath, func.code);
  });
}

function createIndexJs(nodesDir, workspaceDir, c) {
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

    const t = c.get("t");
  
    // Render the template using Nunjucks
    const indexContent = t.render("indexTemplate", templateData);
  
    const indexPath = path.join(workspaceDir, 'index.js');
    fs.writeFileSync(indexPath, indexContent);
}

serve(app);