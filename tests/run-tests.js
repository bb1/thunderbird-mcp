import { spawn } from 'child_process';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const tbPath = process.env.TB_PATH || 'thb/thunderbird';

const webExt = spawn('npx', [
  'web-ext',
  'run',
  '--firefox', tbPath,
  '--source-dir', 'extension',
  '--no-input',
  '--verbose',
  '--pref=extensions.experiments.enabled=true',
  '--args=--headless'
], { stdio: 'inherit' });

let done = false;

async function waitForServer() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:8765', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // ignore
    }
    await delay(3000);
  }
  throw new Error('Server did not respond');
}

(async () => {
  try {
    const result = await waitForServer();
    console.log('Tools:', result.result.tools.map(t => t.name));
    done = true;
    webExt.kill('SIGINT');
  } catch (err) {
    console.error(err);
    done = false;
    webExt.kill('SIGINT');
  }
})();

webExt.on('exit', () => {
  process.exit(done ? 0 : 1);
});
