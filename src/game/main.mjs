import '../styles/tokens.css';
import '../styles/game.css';
import '../styles/overlays.css';
import '../styles/game-experience.css';
import { createGame, advance, getQuestion } from '../shared/investigation.mjs';
import { neighbor } from '../shared/world.mjs';
import { evidence } from '../shared/case.mjs';
import { mountGame } from './ui/shell.mjs';
import { createEngine } from './engine.mjs';
import { createInspection } from './ui/inspection.mjs';
import { createConversation } from './ui/conversation.mjs';
import { createFirstShift } from './ui/first-shift.mjs';
import { createOnboarding } from './ui/onboarding.mjs';
import { manageFocus } from './ui/focus.mjs';
import { attachAmbience } from './services/sound.mjs';
import { restore, save, fresh } from './services/save.mjs';

mountGame(document.getElementById('app'));
const el = (id) => document.getElementById(id);
const stage = el('stage');
const sound = document.createElement('button');
sound.type = 'button'; sound.textContent = 'Sound off'; sound.setAttribute('aria-pressed', 'false');
const ambience = attachAmbience(sound);
let game = createGame();
let mode = 'title';
let capabilities = {};
let transitioning = false;
let previousSave;
let noticeTimer;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const getGame = () => game;
const getMode = () => mode;

function setGame(next) {
  if (next === game) return;
  const found = next.clues.find(id => !game.clues.includes(id));
  game = next;
  el('journal-count').textContent = game.clues.length || '';
  if (found) { ambience.cue('found'); notify(`Noted in your journal: ${evidence[found]?.title || found}`); }
  el('case-question').textContent = getQuestion(game);
  save(game);
}
function setMode(next) {
  mode = next; stage.dataset.mode = next; engine.clear();
  for (const [id, value] of [['title-screen', 'title'], ['intro-screen', 'intro'], ['paper-overlay', 'paper'], ['conversation', 'conversation']]) el(id).hidden = next !== value;
  el('hud').hidden = next !== 'explore';
  el('lower-hud').hidden = next !== 'explore';
  el('world').inert = next !== 'explore';
  el('tutorial').hidden = true;
  if (next !== 'explore') el('interact').hidden = true;
  ambience.update(game.year, next === 'conversation', game.finished, next);
}
function notify(message) {
  clearTimeout(noticeTimer); el('notification').textContent = message;
  noticeTimer = setTimeout(() => { el('notification').textContent = ''; }, 3500);
}
function transition(change, after = () => {}, kind = 'room') {
  if (transitioning) return;
  transitioning = true; engine.clear();
  stage.dataset.transition = kind;
  el('transition').classList.add('on');
  setTimeout(() => {
    change();
    el('transition').classList.remove('on');
    setTimeout(() => { transitioning = false; delete stage.dataset.transition; after(); }, reduced.matches ? 0 : 220);
  }, reduced.matches ? 0 : kind === 'conversation' ? 340 : 260);
}
const onboarding = createOnboarding({ setMode, onReady: () => { notify('The railway outpost is through the passage on your right.'); } });
const engine = createEngine({
  getGame, getMode, isTransitioning: () => transitioning,
  onFootstep: () => ambience.cue('step'),
  onMove: () => onboarding.moved(), onNearby: () => onboarding.nearby(),
  onTravel(direction) {
    if (transitioning || !neighbor(game.room, direction)) return;
    transition(() => { setGame(advance(game, direction)); engine.enter(direction); engine.render(); });
  },
  onInteract(item) {
    if (mode !== 'explore' || transitioning) return;
    if (item.person) conversation.open(item.id);
    else inspection.inspect(item.id);
  },
});
const inspection = createInspection({
  getGame, setGame, setMode, renderRoom: () => engine.render(), transition, sound,
  onDevice: () => onboarding.hint('Turn the dial with Q, or tap the pocket instrument.', 10000),
  onRestart: startFresh,
});
const conversation = createConversation({ getGame, setGame, getMode, getCapabilities: () => capabilities, getSoundEnabled: () => sound.getAttribute('aria-pressed') === 'true', setMode, transition, notify });
manageFocus(stage, () => mode !== 'explore');

const firstShift = createFirstShift({ setMode, getGame, setGame, renderRoom: () => engine.render(), transition, cue: ambience.cue });

function shift() {
  if (mode !== 'explore' || transitioning || !game.hasDevice || game.finished) return;
  const first = !game.firstShiftSeen;
  ambience.cue('shift', first ? 1998 : game.year === 1998 ? 2028 : 1998);
  transition(() => {
    setGame(first ? { ...game, year:1998 } : advance(game, 'shift')); engine.render(); ambience.update(game.year, false, false);
    notify(game.year === 1998 ? 'Devgarh, thirty years earlier.' : 'Back in the rain. Devgarh, 2028.');
  }, () => { if(first) firstShift.start(); }, 'era');
}
function startFresh() {
  fresh(); previousSave = null;
  setGame(createGame()); engine.reset(); engine.render(); onboarding.start();
}
el('start').onclick = () => {
  if (sound.getAttribute('aria-pressed') === 'false') sound.click();
  startFresh();
};
el('continue').onclick = () => {
  if (!previousSave) return;
  if (sound.getAttribute('aria-pressed') === 'false') sound.click();
  game = previousSave; el('journal-count').textContent = game.clues.length || ''; engine.render(); setMode('explore');
  el('case-question').textContent = getQuestion(game);
  notify('Saved visit restored. Your journal holds what you discovered.');
};
el('journal').onclick = () => { if (!transitioning && mode === 'explore') inspection.showJournal(); };
el('pause').onclick = () => { if (!transitioning && mode === 'explore') inspection.showPause(); };
el('shift').onclick = shift;
el('fullscreen').onclick = async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await stage.requestFullscreen(); }
  catch { notify('Fullscreen is unavailable here. The game still fills this window.'); }
};
document.addEventListener('fullscreenchange', () => {
  el('fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Leave fullscreen' : 'Enter fullscreen');
});
document.addEventListener('keydown', (event) => {
  if (transitioning || event.repeat) return;
  if (event.code === 'Escape') {
    if (mode === 'conversation') conversation.close();
    else if (mode === 'paper') inspection.close();
    else if (mode === 'explore') inspection.showPause();
    return;
  }
  if (mode !== 'explore' || event.target.closest('input,select,textarea')) return;
  if (event.code === 'KeyQ') shift();
  if (event.code === 'KeyJ') inspection.showJournal();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && mode === 'explore' && !transitioning) inspection.showPause();
});
fetch('/api/capabilities')
  .then((result) => result.json())
  .then(async (result) => {
    capabilities = result;
    const restored = await restore(result.saves);
    if (mode !== 'title') return;
    if (restored && !restored.finished) {
      previousSave = restored;
      el('continue').hidden = false;
      el('saved-visit').hidden = false;
      el('saved-visit').textContent = `Saved visit · ${restored.year} · ${restored.clues.length} journal entries`;
    }
  }).catch(() => {});
engine.render(); setMode('title'); el('case-question').textContent = getQuestion(game);
