import { getActions, advance } from '../../shared/investigation.mjs';
import { evidence, people, replyToQuestion } from '../../shared/case.mjs';
import { drawPortrait } from '../render/art.mjs';
import { attachVoice } from '../services/voice.mjs';

const optional = new Set(['arrival-note', 'high-water', 'shed-plate', 'register', 'office-photo', 'ticket-stub', 'tea-cups', 'platform-clock', 'lantern']);

export function createConversation({ getGame, setGame, getMode, getCapabilities, setMode, transition, notify, getSoundEnabled = () => true }) {
  const el = (id) => document.getElementById(id);
  const speaker = new Audio();
  let witness;
  let history = [];
  let audio;
  let request;
  let openingRequest;
  let busy = false;
  const voice = attachVoice({
    button: el('record'), status: el('voice-status'),
    isOpen: () => getMode() === 'conversation' && !busy,
    onTranscript: (text) => { el('question').value = text; el('voice-status').textContent = 'Heard you. Edit if needed, then send.'; el('question').focus(); },
    onRecording: () => { openingRequest?.abort(); openingRequest = undefined; speaker.pause(); },
  });

  function updateEvidence() {
    const select = el('offered-clue'); const chosen = select.value;
    select.replaceChildren();
    for (const id of getGame().clues.filter((key) => evidence[key] && !optional.has(key))) {
      const option = document.createElement('option'); option.value = id; option.textContent = evidence[id].title; select.append(option);
    }
    if ([...select.options].some((option) => option.value === chosen)) select.value = chosen;
    el('evidence-toggle').hidden = !select.options.length;
    if (!select.options.length) el('evidence-tray').hidden = true;
  }
  function setBusy(value) {
    busy = value;
    el('question-form').setAttribute('aria-busy', String(value));
    el('question-form').querySelector('[type="submit"]').disabled = value;
    el('show-clue').disabled = value;
    el('record').disabled = value;
  }
  function open(id) {
    transition(() => {
      witness = id; history = [];
      const person = people[id];
      drawPortrait(el('portrait'), person.portrait);
      el('speaker').textContent = person.name;
      el('speaker-detail').textContent = person.detail;
      el('response').textContent = person.greeting;
      el('question').value = '';
      el('last-question').hidden = true;
      el('voice-status').textContent = '';
      el('evidence-tray').hidden = true;
      el('evidence-toggle').setAttribute('aria-expanded', 'false');
      el('listen').hidden = true; audio = undefined; setBusy(false);
      updateEvidence(); setMode('conversation');
    }, () => { el('leave').focus(); speakOpening(id); }, 'conversation');
  }
  async function speakOpening(id) {
    if (!getCapabilities().voice) return;
    const controller = new AbortController(); openingRequest = controller;
    const timeout = setTimeout(() => controller.abort(), 14000);
    try {
      const result = await fetch('/api/greeting', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, state: getGame() }), signal: controller.signal });
      if (!result.ok) return;
      const reply = await result.json();
      if (openingRequest !== controller || getMode() !== 'conversation' || witness !== id || busy) return;
      audio = reply.audio; el('listen').hidden = !audio; play(true);
    } catch { /* Opening subtitles remain usable if speech is unavailable. */ }
    finally { clearTimeout(timeout); if (openingRequest === controller) openingRequest = undefined; }
  }
  function play(automatic = false) {
    if (automatic && !getSoundEnabled()) return;
    if (!audio || getMode() !== 'conversation') return;
    speaker.src = 'data:audio/wav;base64,' + audio;
    speaker.play().catch(() => { el('voice-status').textContent = 'Tap Listen again to hear the reply.'; });
  }
  async function answer(input, offered = '') {
    if (getMode() !== 'conversation' || busy || !input.trim()) return;
    const text = input.trim();
    openingRequest?.abort(); openingRequest = undefined;
    voice.cancel();
    if (offered) {
      el('evidence-tray').hidden = true;
      el('evidence-toggle').setAttribute('aria-expanded', 'false');
    }
    el('last-question').textContent = offered ? `You show ${text.toLocaleLowerCase()}` : `You: ${text}`;
    el('last-question').hidden = false;
    const game = getGame();
    let reply = replyToQuestion(witness, text, game, getActions(game), offered);
    const capabilities = getCapabilities();
    setBusy(true); speaker.pause();
    {
      const controller = new AbortController(); request = controller;
      const timeout = setTimeout(() => controller.abort(), 24000);
      el('voice-status').textContent = 'Thinking…';
      try {
        const result = await fetch('/api/interview', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
          body: JSON.stringify({ id: witness, question: text, state: game, offered, history, speak: capabilities.voice }),
        });
        if (result.ok) reply = await result.json();
      } catch { /* Authored dialogue keeps the scene playable when a service is unavailable. */ }
      finally { clearTimeout(timeout); }
      if (request !== controller) return;
      request = undefined;
    }
    if (getMode() !== 'conversation') return;
    if (reply.reveal) {
      const previous = getGame(); const next = advance(previous, reply.reveal); setGame(next);

    }
    history.push({ role: 'user', content: text }, { role: 'assistant', content: reply.text });
    history = history.slice(-6);
    el('response').dataset.source = reply.source || 'authored';
    el('response').textContent = reply.text;
    el('voice-status').textContent = capabilities.dialogue && reply.source !== 'llm' ? 'Live conversation interrupted. You can try again.' : '';
    el('question').value = '';
    audio = reply.audio; el('listen').hidden = !audio;
    setBusy(false); play(true); updateEvidence();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) el('response').animate([{ opacity: .2 }, { opacity: 1 }], { duration: 300 });
  }
  function close() {
    openingRequest?.abort(); openingRequest = undefined;
    request?.abort(); request = undefined; voice.cancel();
    speaker.pause(); speaker.removeAttribute('src'); speaker.load();
    transition(() => setMode('explore'), () => el('interact').focus(), 'conversation');
  }
  el('leave').onclick = close;
  el('listen').onclick = () => play();
  el('question-form').onsubmit = (event) => { event.preventDefault(); answer(el('question').value); };
  el('evidence-toggle').onclick = () => {
    const tray = el('evidence-tray'); tray.hidden = !tray.hidden;
    el('evidence-toggle').setAttribute('aria-expanded', String(!tray.hidden));
    if (!tray.hidden) el('offered-clue').focus();
  };
  el('show-clue').onclick = () => { const id = el('offered-clue').value; if (evidence[id]) answer(evidence[id].title, id); };
  return { open, close, isBusy: () => busy };
}
