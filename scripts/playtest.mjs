import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pause = (ms) => new Promise((done) => setTimeout(done, ms));
async function until(read, label) {
  for (let n = 0; n < 260; n++) {
    try { if (await read()) return; } catch {}
    await pause(65);
  }
  throw new Error('Timed out: ' + label);
}
const base = 'http://127.0.0.1:3021';
const profile = await mkdtemp(join(tmpdir(), 'kal-chrome-'));
const app = spawn(process.execPath, ['server/main.mjs'], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: '3021', GNANI_API_KEY: '', SUPABASE_URL: '', SUPABASE_SECRET_KEY: '' },
  windowsHide: true, stdio: 'ignore',
});
const chrome = spawn(process.env.KAL_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless', '--remote-debugging-port=0', '--no-first-run', '--no-default-browser-check', '--user-data-dir=' + profile, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  await until(async () => (await fetch(base)).ok, 'game server');
  const debugFile = join(profile, 'DevToolsActivePort');
  let debugPort;
  await until(async () => {
    debugPort = (await readFile(debugFile, 'utf8')).split('\n')[0].trim();
    return debugPort;
  }, 'browser debugger');
  const pages = await (await fetch('http://127.0.0.1:' + debugPort + '/json/list')).json();
  socket = new WebSocket(pages.find((item) => item.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    const callback = pending.get(message.id);
    if (!callback) return;
    pending.delete(message.id);
    if (message.error) callback.reject(new Error(message.error.message));
    else callback.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++sequence, { resolve, reject });
    socket.send(JSON.stringify({ id: sequence, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description);
    return result.result.value;
  };
  const click = (id) => evaluate(`document.getElementById('${id}').click()`);
  const content = (id, label) => until(() => evaluate(`document.getElementById('${id}').textContent.includes(${JSON.stringify(label)})`), label);
  const settled = () => until(() => evaluate(`!document.getElementById('stage').dataset.transition`), 'camera settled');
  const mode = async (value) => { await until(() => evaluate(`document.getElementById('stage').dataset.mode === '${value}'`), value); await settled(); };
  const key = (type) => send('Input.dispatchKeyEvent', { type, key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  const viewport = (width, height, mobile) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  const travel = async (direction, destination) => {
    await settled();
    await click(direction);
    await content('room', destination);
    await settled();
  };
  const present = async (id) => {
    if (await evaluate(`document.getElementById('evidence-tray').hidden`)) await click('evidence-toggle');
    await evaluate(`document.getElementById('offered-clue').value='${id}'; document.getElementById('show-clue').click()`);
  };
  const choose = (label) => evaluate(`[...document.querySelectorAll('.paper-actions button')].find((item) => item.textContent === ${JSON.stringify(label)}).click()`);
  const shot = async (name) => {
    await mkdir('.playtest', { recursive: true });
    await writeFile('.playtest/' + name + '.png', Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  };
  async function use(label, position) {
    await settled();
    await evaluate(`{ const w=document.getElementById('world'); const r=w.getBoundingClientRect(); w.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+r.width*${position}})); }`);
    await until(() => evaluate(`!document.getElementById('interact').hidden && document.getElementById('interact').textContent.includes(${JSON.stringify(label)})`), label);
    await click('interact');
  }
  await send('Runtime.enable');
  await send('Page.enable');
  await viewport(1440, 900, false);
  await send('Page.navigate', { url: base + '/play.html' });
  await until(() => evaluate('document.querySelector("#player svg") !== null'), 'game loaded');
  assert.equal(await evaluate('document.getElementById("stage").getBoundingClientRect().top'), 0);
  await shot('title');
  await click('start');
  await content('intro-title', 'Back at Devgarh');
  await shot('onboarding');
  await click('intro-next');
  await content('intro-title', 'A familiar name');
  await click('intro-next');
  await content('intro-title', 'One more look');
  await click('intro-next');
  await mode('explore');
  const leg = () => evaluate('document.querySelector("#player [data-leg]").getAttribute("transform")');
  const idle = await leg();
  await key('keyDown');
  await pause(250);
  assert.notEqual(await leg(), idle);
  await key('keyUp');
  await click('right');
  await content('room', 'Railway police outpost');
  await settled();
  await use('Closure report', .29);
  await content('paper-title', 'Closure report');
  await click('close-paper');
  await use('Duty log', .51);
  await content('paper-title', 'Duty log');
  await click('close-paper');
  await use('Retired Jadhav', .74);
  await mode('conversation');
  await content('speaker', 'Jadhav');
  await evaluate('document.getElementById("question").value="kaise hai aap?"; document.getElementById("question-form").requestSubmit()');
  await content('response', 'Theek');
  await evaluate('document.getElementById("question").value="Prakash ko jaante the?"; document.getElementById("question-form").requestSubmit()');
  await content('response', 'Prakash');
  await present('police-log');
  await content('response', 'bhatija');
  await pause(400);
  await shot('witness');
  await viewport(390, 844, true);
  await pause(450);
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  assert.ok(await evaluate('document.getElementById("question").getBoundingClientRect().bottom <= innerHeight'));
  await shot('witness-mobile');
  await viewport(1440, 900, false);
  await click('leave');
  await mode('explore');
  await travel('left', 'Station approach');
  await travel('left', 'Devgarh platform');
  await use('Pocket instrument', .20);
  await click('close-paper');
  await click('shift');
  await content('year', '1998');
  await settled();
  await mode('cutscene'); await shot('first-shift-surprise');
  await click('shift-next'); await click('shift-next'); await settled(); await content('year', '2028');
  await click('shift-next'); await settled(); await content('year', '1998');
  await click('shift-next'); await mode('explore');
  await click('journal');
  await content('paper-title', 'Journal');
  const position = () => evaluate('document.getElementById("player").style.getPropertyValue("--x")');
  const paused = await position();
  await key('keyDown');
  await pause(240);
  assert.equal(await position(), paused);
  await key('keyUp');
  await click('close-paper');
  await viewport(390, 844, true);
  await pause(220);
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  await shot('mobile');
  await viewport(1440, 900, false);
  await travel('left', 'Tea stall');
  await use('Nirmala', .58);
  await mode('conversation');
  await present('police-log');
  await content('response', 'Desai');
  await click('leave'); await mode('explore');
  await travel('left', 'Ticket hall');
  await use('Timetable', .58);
  await click('close-paper');
  await travel('left', 'Stationmaster');
  await use('Stationmaster', .57);
  await mode('conversation');
  await present('tea-testimony');
  await content('response', 'signed');
  await click('leave'); await mode('explore');
  await travel('left', 'Records room');
  await use('Comparison desk', .66);
  await choose('A warning came before the diversion');
  await content('paper-title', 'The missing entry');
  await click('close-paper');
  await travel('left', 'Signal cabin');
  await travel('left', 'Goods shed');
  await use('Siding plate', .66);
  await click('close-paper');
  await use('Desai', .28);
  await mode('conversation');
  await present('tea-testimony');
  await content('response', 'chalk');
  await click('leave'); await mode('explore');
  await travel('left', 'River bridge');
  await use('Survey mark', .53);
  await content('paper-title', 'Desai');
  await click('close-paper');
  await travel('right', 'Goods shed');
  await travel('right', 'Signal cabin');
  await use('Prakash', .21);
  await mode('conversation');
  await present('archive-compare');
  await content('response', 'samaan');
  await click('leave'); await mode('explore');
  await use('Track diagram', .49);
  await choose('Yellow triangle');
  await content('paper-title', 'goods siding');
  await click('close-paper');
  await use('Dispatch drawer', .74);
  await content('paper-title', 'Carbon copy');
  await click('close-paper');
  await click('shift'); await content('year', '2028');
  await use('Water-damaged desk', .24);
  await click('close-paper');
  await travel('right', 'Records room');
  await use('Leela', .31);
  await mode('conversation');
  await present('damaged-desk');
  await content('response', 'dabba');
  await click('leave'); await mode('explore');
  await travel('left', 'Signal cabin');
  await click('shift'); await content('year', '1998');
  await use('Dispatch copy', .84);
  await choose('Tin on the upper shelf');
  await content('paper-title', 'Above the water');
  await click('close-paper');
  await click('shift'); await content('year', '2028');
  await use('Upper cabinet', .78);
  await content('paper-title', 'Original dispatch');
  await click('close-paper');
  for (const name of ['Records room', 'Stationmaster', 'Ticket hall', 'Tea stall', 'Devgarh platform']) await travel('right', name);
  await use('Exhibit board', .54);
  await choose('The bridge warning reaches the station');
  await choose('Prakash changes the route');
  await choose('Passengers disembark at the goods shed');
  await content('paper-title', 'The last train');
  await pause(450);
  await shot('ending');
  assert.deepEqual(exceptions, []);
  console.log('Chrome verified the full text-mode case from onboarding through the exhibit, plus walk poses, HUD pause, and mobile width.');
} finally {
  socket?.close();
  chrome.kill();
  app.kill();
}
