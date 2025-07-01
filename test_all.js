#!/usr/bin/env node
import { spawn } from 'child_process';

const { OPENAI_API_KEY } = process.env;
if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable must be set to run model and benchmark tests.');
  process.exit(1);
}

function runCommand(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${cmd} ${args.join(' ')}`);
    const proc = spawn(cmd, args, { shell: false, stdio: ['inherit', 'pipe', 'pipe'], ...options });
    let failed = false;
    proc.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);
      if (!failed && /fail/i.test(text)) {
        failed = true;
        const msg = `Detected 'fail' in stdout of ${cmd} ${args.join(' ')}`;
        reject(new Error(msg));
        proc.kill();
      }
    });
    proc.stderr.on('data', (data) => {
      const text = data.toString();
      process.stderr.write(text);
      if (!failed && /fail/i.test(text)) {
        failed = true;
        const msg = `Detected 'fail' in stderr of ${cmd} ${args.join(' ')}`;
        reject(new Error(msg));
        proc.kill();
      }
    });
    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (code === 0 && !failed) {
        resolve();
      } else if (code !== 0) {
        reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

function waitForOutput(process, substring, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for "${substring}"`));
    }, timeout);

    process.stdout.on('data', (data) => {
      const text = data.toString();
      if (text.includes(substring)) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
}

(async () => {
  let serverProcess;
  try {
    console.log('Starting HTTP server for SSE tests (HTTP_PORT=3000)...');
    serverProcess = spawn('node', ['index.js'], {
      env: { HTTP_PORT: '3000', ...process.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    serverProcess.stdout.on('data', (data) => {
      process.stdout.write(`[server] ${data}`);
    });
    serverProcess.stderr.on('data', (data) => {
      process.stderr.write(`[server] ${data}`);
    });

    await waitForOutput(serverProcess, 'PubNub MCP server running on HTTP port 3000');
    console.log('HTTP server started.');

    await runCommand('npm', ['test']);
    await runCommand('node', ['test_chat_sdk.js']);
    await runCommand('node', ['test_sse.js']);
    await runCommand('bash', ['test_tools_model.sh']);
    await runCommand('node', ['test_tools_consistency.js']);
    //await runCommand('bash', ['benchmark_mcp.sh']);

    console.log('\nAll tests passed.');
    process.exit(0);
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
})();
