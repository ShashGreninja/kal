import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { synthesize, transcribe } from './gnani.mjs';
import { dialogueEnabled, interview, validState } from './dialogue.mjs';
import { loadSave, storageEnabled, storeSave } from './storage.mjs';
import { people } from '../src/shared/case.mjs';
import { getInteractions } from '../src/shared/world.mjs';
import { spokenGreetings } from '../src/shared/greetings.mjs';

const root = new URL('../dist/', import.meta.url);
const key = process.env.GNANI_API_KEY;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) return null;
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > 16384) return null;
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { return null; }
}

createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (req.method === 'GET' && pathname === '/api/capabilities') {
      return json(res, 200, { voice: Boolean(key), dialogue: dialogueEnabled, saves: storageEnabled });
    }
    if (req.method === 'POST' && pathname === '/api/greeting') {
      const input = await readJson(req);
      if (!input || !validState(input.state) || !getInteractions(input.state).some(item => item.person && item.id === input.id)) {
        return json(res, 400, { error: 'Invalid witness.' });
      }
      const reply = { text: people[input.id].greeting };
      if (key) {
        try { reply.audio = (await synthesize(spokenGreetings[input.id], key, input.id)).toString('base64'); }
        catch { reply.voiceUnavailable = true; }
      }
      return json(res, 200, reply);
    }
    if (req.method === 'POST' && pathname === '/api/interview') {
      const input = await readJson(req);
      const reply = input && await interview(input);
      if (!reply) return json(res, 400, { error: 'Invalid interview.' });
      if (key && input.speak === true) {
        try { reply.audio = (await synthesize(reply.speechText || reply.text, key, input.id)).toString('base64'); }
        catch { /* The subtitle remains available when synthesis fails. */ }
      }
      return json(res, 200, reply);
    }
    const save = /^\/api\/saves\/([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.exec(pathname);
    if (save && storageEnabled) {
      if (req.method === 'GET') return json(res, 200, { state: await loadSave(save[1]) });
      if (req.method === 'PUT') {
        const state = await readJson(req);
        if (!validState(state)) return json(res, 400, { error: 'Invalid progress.' });
        await storeSave(save[1], state);
        return json(res, 200, { saved: true });
      }
    }
    if (req.method === 'POST' && pathname === '/api/transcribe') {
      if (!key) return json(res, 503, { error: 'Voice is unavailable.' });
      if (req.headers['content-type'] !== 'audio/wav') {
        return json(res, 415, { error: 'Expected WAV audio.' });
      }
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 641000) return json(res, 413, { error: 'Recording is too long.' });
        chunks.push(chunk);
      }
      const audio = Buffer.concat(chunks);
      if (audio.length < 46 || audio.toString('ascii', 0, 4) !== 'RIFF'
          || audio.toString('ascii', 8, 12) !== 'WAVE') {
        return json(res, 400, { error: 'Recording could not be read.' });
      }
      const transcript = await transcribe(audio, key);
      return json(res, 200, { transcript });
    }
    const file = pathname === '/' ? '/index.html' : pathname === '/play' ? '/play.html' : pathname;
    const type = types[extname(file)];
    if (req.method !== 'GET' || !type || !/^\/(?:[a-z0-9_-]+\/)*[a-z0-9_.-]+\.[a-z0-9]+$/i.test(file)) {
      return json(res, 404, { error: 'Page not found.' });
    }
    const data = await readFile(new URL(file.slice(1), root));
    res.writeHead(200, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' });
    res.end(data);
  } catch (error) {
    if (error.code === 'ENOENT') return json(res, 404, { error: 'Page not found.' });
    const status = error.code === 'GNANI_REQUEST_FAILED' ? 502 : 500;
    return json(res, status, { error: 'Could not complete that request. Please try again.' });
  }
}).listen(port, host, () => console.log(`KAL is running at http://localhost:${port}`));
