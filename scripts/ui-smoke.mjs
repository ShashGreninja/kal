import assert from 'node:assert/strict';
import { openBrowser, pause, until } from './browser.mjs';

const browser = await openBrowser();
const { send, evaluate, click, viewport, shot } = browser;
const key = (key, code, extra = {}) => send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, ...extra });
const settled = () => until(() => evaluate('!document.getElementById("stage").dataset.transition'), 'camera settled');
const mode = (mode) => until(() => evaluate(`document.getElementById('stage').dataset.mode === '${mode}'`), mode);
try {
  await viewport(1440, 900);
  await browser.navigate();
  await until(() => evaluate('document.querySelector("#hero-art .art-tile img")?.complete'), 'landing artwork');
  assert.match(await evaluate('document.body.innerText'), /Gnani hackathon/);
  await evaluate('document.getElementById("era-dial").focus()');
  await key('End', 'End');
  assert.equal(await evaluate('document.getElementById("era-dial").value'), '100');
  assert.equal(await evaluate('document.getElementById("era-output").textContent'), 'Devgarh, 2028');
  await key('Home', 'Home');
  assert.equal(await evaluate('document.getElementById("era-dial").value'), '0');
  assert.equal(await evaluate('document.getElementById("era-future").style.clipPath'), 'inset(0px 0px 0px 100%)');
  await evaluate('document.querySelector(".questions summary").click()');
  assert.equal(await evaluate('document.querySelector(".questions details").open'), true);
  assert.ok(await evaluate('[...document.querySelectorAll("a[href]")].every(a => !a.getAttribute("href").startsWith("#") || document.getElementById(a.hash.slice(1)))'));
  for (const [width, height] of [[1440,900], [768,1024], [390,844]]) {
    await viewport(width, height, width < 600); await pause(300);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `landing overflow at ${width}`);
  }
  await viewport(1440, 900);
  await browser.navigate('/play.html');
  await until(() => evaluate('Boolean(document.querySelector("#player svg"))'), 'game shell');
  await pause(1000); await shot('final-title');
  await click('start'); await mode('intro'); await pause(650); await shot('final-arrival');
  await click('skip-intro'); await mode('explore');
  await until(() => evaluate('!document.getElementById("interact").hidden'), 'nearby inventory note');
  await click('interact'); await mode('paper');
  assert.equal(await evaluate('document.getElementById("paper-overlay").dataset.kind'), 'document');
  await pause(600); await shot('final-document');
  await key('Tab', 'Tab');
  assert.ok(await evaluate('document.getElementById("paper-overlay").contains(document.activeElement)'));
  await key('Escape', 'Escape'); await mode('explore');
  await click('journal'); await mode('paper');
  assert.match(await evaluate('document.querySelector(".journal-page").textContent'), /Inventory note/);
  await pause(600); await shot('final-journal');
  await key('Escape', 'Escape'); await mode('explore');
  await click('pause'); await mode('paper');
  await pause(600); await shot('final-pause');
  await key('Escape', 'Escape'); await mode('explore');
  await click('right');
  await until(() => evaluate('document.getElementById("room").textContent.includes("police")'), 'outpost'); await settled();
  await evaluate(`document.querySelector('[aria-label="Talk to Retired Jadhav"]').click()`);
  await mode('conversation'); await settled();
  const submit = async (text) => { await evaluate(`document.getElementById('question').value=${JSON.stringify(text)}; document.getElementById('question-form').requestSubmit()`); };
  await submit('aap kaise ho?');
  await until(() => evaluate('document.getElementById("response").textContent.includes("Theek")'), 'social reply');
  assert.equal(await evaluate('document.getElementById("question-form").getAttribute("aria-busy")'), 'false');
  for (const [width, height] of [[1440,900], [768,1024], [390,844], [844,390]]) {
    await viewport(width, height, width < 900); await pause(600);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `game overflow at ${width}`);
    assert.ok(await evaluate('document.getElementById("question").getBoundingClientRect().bottom <= innerHeight'), `input clipped at ${width}`);
    const ratio = await evaluate('(()=>{const i=document.querySelector("#portrait img"); return i.getBoundingClientRect().width/i.getBoundingClientRect().height})()');
    assert.ok(Math.abs(ratio - 1448 / 1086) < .002, `portrait stretched at ${width}: ${ratio}`);
    await shot(`final-conversation-${width}`);
  }
  await viewport(1440,900);
  await click('leave'); await mode('explore'); await settled();
  await pause(300); await shot('final-characters');
  // Exercise denied microphone permission without sending audio or facts to a provider.
  await send('Fetch.enable', { patterns: [{ urlPattern: '*api/capabilities' }] });
  browser.on('Fetch.requestPaused', ({ requestId }) => {
    send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify({ voice: true, dialogue: false, saves: false })).toString('base64') });
  });
  await browser.navigate('/play.html');
  await until(() => evaluate('Boolean(document.querySelector("#player svg"))'), 'game shell');
  await click('start'); await click('skip-intro'); await mode('explore');
  await click('right');
  await until(() => evaluate('document.getElementById("room").textContent.includes("police")'), 'outpost'); await settled();
  await evaluate(`document.querySelector('[aria-label="Talk to Retired Jadhav"]').click()`);
  await mode('conversation'); await settled();
  await evaluate('navigator.mediaDevices.getUserMedia = async () => { throw new DOMException("Denied in test", "NotAllowedError"); }');
  await click('record');
  await until(() => evaluate('document.getElementById("voice-status").textContent.includes("type your question")'), 'mic fallback');
  assert.ok(await evaluate('!document.getElementById("question").disabled'));
  assert.ok(!await evaluate('document.body.innerText.includes("seconds maximum")'));
  assert.deepEqual(browser.errors, []);
  console.log('UI verified: landing links and era keyboard control; arrival skip; document, journal, pause and modal focus; witness navigation and Hinglish greeting; proportional portraits at four sizes; denied-microphone fallback. No live provider calls.');
} finally { browser.close(); }
