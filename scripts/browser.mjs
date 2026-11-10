import { spawn } from 'node:child_process';
import { mkdtemp, readFile, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export async function until(read, label, timeout = 18000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try { if (await read()) return; } catch {}
    await pause(70);
  }
  throw new Error(`Timed out: ${label}`);
}

// A fresh local server and browser, with provider credentials explicitly disabled.
export async function openBrowser(port = 3023) {
  const base = `http://127.0.0.1:${port}`;
  const profile = await mkdtemp(join(tmpdir(), 'kal-ui-'));
  const app = spawn(process.execPath, ['server/main.mjs'], {
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', GNANI_API_KEY: '', SUPABASE_URL: '', SUPABASE_SECRET_KEY: '', DIALOGUE_API_KEY: '' },
    stdio: 'ignore', windowsHide: true,
  });
  const chrome = spawn(process.env.KAL_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--remote-debugging-port=0', '--no-first-run', '--no-default-browser-check', '--mute-audio',
    '--user-data-dir=' + profile, 'about:blank',
  ], { stdio: 'ignore', windowsHide: true });
  let socket;
  const close = () => { socket?.close(); chrome.kill(); app.kill(); };
  try {
    await until(async () => (await fetch(base)).ok, 'local server');
    let debugPort;
    await until(async () => { debugPort = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0].trim(); return debugPort; }, 'Chrome');
    const pages = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    socket = new WebSocket(pages.find((page) => page.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
    let sequence = 0;
    const pending = new Map(); const listeners = new Map(); const errors = [];
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
      listeners.get(message.method)?.(message.params);
      const task = pending.get(message.id);
      if (!task) return;
      pending.delete(message.id);
      if (message.error) task.reject(new Error(message.error.message)); else task.resolve(message.result);
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      pending.set(++sequence, { resolve, reject }); socket.send(JSON.stringify({ id: sequence, method, params }));
    });
    const evaluate = async (expression) => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description);
      return result.result.value;
    };
    await send('Runtime.enable'); await send('Page.enable');
    return {
      base, send, evaluate, errors, close,
      on: (method, handler) => listeners.set(method, handler),
      navigate: async (path = '') => { await send('Page.navigate', { url: base + path }); await until(() => evaluate('document.readyState === "complete"'), 'document ready'); },
      click: (id) => evaluate(`document.getElementById(${JSON.stringify(id)}).click()`),
      viewport: (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile }),
      shot: async (name) => {
        await mkdir('.playtest', { recursive: true });
        await writeFile(`.playtest/${name}.png`, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
      },
    };
  } catch (error) { close(); throw error; }
}
