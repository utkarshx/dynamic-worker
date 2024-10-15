const { exec } = require('child_process');

const data = {
  functions: [
    {
      name: "test",
      code: "export default async function test() { return \"Helo 2\"; }",
      node_modules: []
    },
    {
      name: "hello",
      code: "import _ from 'underscore'; export default async function hello() { const sum = _.reduce([1, 2], (memo, num) => memo + num, 0); return `The sum is: ${sum}`; }",
      node_modules: ["underscore"]
    }
  ]
};

const jsonData = JSON.stringify(data);

exec(`curl -X POST http://localhost:3000/deploy -H "Content-Type: application/json" -d '${jsonData}'`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

