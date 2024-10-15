import 'dotenv/config';
import fs from 'fs/promises';

async function deployWorker(filePath) {
  const accessToken = process.env.DEPLOY_ACCESS_TOKEN;
  const orgId = process.env.DEPLOY_ORG_ID;
  const API = "https://api.deno.com/v1";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // Read the worker code from the specified file path
  const workerCode = await fs.readFile(filePath, 'utf-8');

  // Create a new project
  const pr = await fetch(`${API}/organizations/${orgId}/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: null, // randomly generates project name
    }),
  });

  const project = await pr.json();

  // Deploy the worker code to the new project
  const dr = await fetch(`${API}/projects/${project.id}/deployments`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      entryPointUrl: "main.ts",
      assets: {
        "main.ts": {
          "kind": "file",
          "content": workerCode,
          "encoding": "utf-8",
        },
      },
      envVars: {},
    }),
  });

  const deployment = await dr.json();

  console.log(dr.status);
  console.log(
    "Visit your site here:",
    `https://${project.name}-${deployment.id}.deno.dev`,
  );
}