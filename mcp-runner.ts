import fs from 'fs/promises';
import { spawn } from 'child_process';
import axios from 'axios';

async function main() {
  const prompts = await fs.readFile('prompts.txt', 'utf-8');
  // const mcp = spawn('npx', ['@executeautomation/playwright-mcp-server', '--http', '--port', '6270'], {
  //   stdio: 'inherit'
  // });

  const path = require('path');
  const mcpPath = path.resolve(
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright-mcp-server.cmd' : 'playwright-mcp-server'
);

const mcp = spawn(mcpPath, ['--http', '--port', '6270'], {
  stdio: 'inherit'
});

  await new Promise(r => setTimeout(r, 10000));

  const outcomes = [];

  for (const prompt of prompts.split('\n').filter(Boolean)) {
    try {
      const response = await axios.post('http://127.0.0.1:6270', {
        tool: 'execute-code',
        prompt,
        contextTools: ['init-browser', 'navigate', 'click', 'type', 'validate-url'],
        captureFailure: true
      });
      outcomes.push(response.data);
    } catch (error) {
      if (error instanceof Error) {
        outcomes.push({ error: error.message });
      } else {
        outcomes.push({ error: String(error) });
      }
    }
  }

  mcp.kill();

  const failed = outcomes.filter(o => o.error);
  if (failed.length > 0) {
    await fs.mkdir('logs', { recursive: true });
    await fs.writeFile('logs/failures.json', JSON.stringify(failed, null, 2));
    console.error('Failures:', failed);
    process.exit(1);
  }
}

main();