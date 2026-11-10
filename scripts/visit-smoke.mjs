import assert from 'node:assert/strict';
import { openBrowser, until, pause } from './browser.mjs';
import { createGame } from '../src/shared/investigation.mjs';

const browser = await openBrowser(3025);
const { send, evaluate, click } = browser;
const oldId = '11111111-1111-4111-8111-111111111111';
const writes = [];
const restored = { ...createGame(), room: 'police', clues: ['report', 'police-log'] };
try {
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `localStorage.setItem('kal-save', '${oldId}')` });
  await send('Fetch.enable', { patterns: [{ urlPattern: '*api/capabilities' }, { urlPattern: '*api/saves/*' }] });
  browser.on('Fetch.requestPaused', async ({ requestId, request }) => {
    let body;
    if (request.url.endsWith('/api/capabilities')) body = { voice: false, dialogue: false, saves: true };
    else if (request.method === 'PUT') {
      writes.push({ url: request.url, state: JSON.parse(request.postData) }); body = { saved: true };
    } else body = { state: restored };
    await send('Fetch.fulfillRequest', { requestId, responseCode: 200,
      responseHeaders: [{ name: 'Content-Type', value: 'application/json' }],
      body: Buffer.from(JSON.stringify(body)).toString('base64'),
    });
  });
  await browser.navigate('/play.html');
  await until(() => evaluate('document.getElementById("continue") && !document.getElementById("continue").hidden'), 'saved visit offered');
  assert.match(await evaluate('document.getElementById("saved-visit").textContent'), /2 journal entries/);
  assert.match(await evaluate('document.getElementById("start").textContent'), /new story/);
  await click('continue'); await click('journal');
  assert.equal(await evaluate('document.querySelectorAll("[data-clue]").length'), 2);
  await browser.navigate('/play.html');
  await until(() => evaluate('document.getElementById("continue") && !document.getElementById("continue").hidden'), 'saved visit offered again');
  await click('start');
  assert.equal(await evaluate('document.getElementById("stage").dataset.mode'), 'intro');
  await click('skip-intro'); await click('journal');
  assert.equal(await evaluate('document.querySelectorAll("[data-clue]").length'), 0);
  assert.match(await evaluate('document.getElementById("paper-body").textContent'), /Nothing written down yet/);
  await pause(200);
  assert.ok(writes.some(write => !write.url.endsWith(oldId) && write.state.clues.length === 0));
  const fills = await evaluate('[...document.querySelectorAll("#player [data-leg]")].map(leg=>leg.querySelector("path").getAttribute("fill"))');
  assert.equal(fills[0], fills[1]);
  await browser.shot('fresh-visit-empty-journal');
  assert.deepEqual(browser.errors, []);
  console.log('Verified: explicit continue restores two records; new story shows arrival, has an empty journal, writes to a different save slot; trouser colours match.');
} finally { browser.close(); }
