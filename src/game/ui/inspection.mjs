import { advance, getActions, getLead, getQuestion } from '../../shared/investigation.mjs';
import { getRoom, rooms } from '../../shared/world.mjs';
import { evidence } from '../../shared/case.mjs';
import { chronology, puzzles } from '../../shared/scenes.mjs';
import { icon } from './icons.mjs';

const recordIds = new Set(['report', 'police-log', 'timetable', 'dispatch', 'original', 'register', 'damage-map', 'arrival-note', 'archive-compare']);
const routeArt = `<svg viewBox="0 0 420 140" aria-hidden="true"><path d="M20 110h115Q160 110 188 82L245 28h150M136 110h259" fill="none" stroke="currentColor" stroke-width="4"/><path d="M275 18v20m30-20v20m30-20v20m30-20v20M275 100v20m30-20v20m30-20v20m30-20v20" stroke="currentColor" stroke-width="2" opacity=".4"/><path d="m225 122 11-20 11 20Z" fill="#e2b46d"/><path d="M228 18h22" stroke="#e6e0d1" stroke-width="6"/></svg>`;
const dialArt = `<svg viewBox="0 0 240 180" aria-hidden="true"><circle cx="120" cy="92" r="69" fill="#9b845c"/><circle cx="120" cy="92" r="61" fill="#292e29"/><circle cx="120" cy="92" r="52" fill="none" stroke="#aa9770" stroke-width="2"/><path d="M120 43v10m49 39h-10m-88 0h10m39 49v-10M120 92l-26-22" stroke="#dfd3b2" stroke-width="3"/><circle cx="120" cy="92" r="4" fill="#dfd3b2"/><rect x="109" y="10" width="22" height="15" rx="4" fill="#ad956a"/><text x="120" y="119" text-anchor="middle" font-family="Georgia" font-size="16" fill="#dfd3b2">1998 / 2028</text></svg>`;

export function createInspection({ getGame, setGame, setMode, renderRoom, transition, sound, onDevice, onRestart }) {
  const el = (id) => document.getElementById(id);
  const body = el('paper-body');
  const close = el('close-paper');
  let returnFocus;
  function paragraph(text, parent = body) {
    const node = document.createElement('p'); node.textContent = text; parent.append(node); return node;
  }
  function choices(items, parent = body) {
    const row = document.createElement('div'); row.className = 'paper-actions';
    for (const [label, run] of items) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
      button.onclick = run; row.append(button);
    }
    parent.append(row); return row;
  }
  function show(context, title, lines, { kind = 'observation', label = 'Back to the station', after = () => setMode('explore'), art = '' } = {}) {
    returnFocus = document.activeElement;
    el('paper-context').textContent = context;
    el('paper-title').textContent = title;
    el('paper-overlay').dataset.kind = kind;
    el('paper-illustration').innerHTML = art;
    body.replaceChildren();
    el('paper-feedback').textContent = '';
    for (const line of lines) paragraph(line);
    close.innerHTML = `${label} ${icon('arrow')}`;
    close.onclick = () => { after(); if (returnFocus?.isConnected && returnFocus.getClientRects().length) returnFocus.focus(); };
    setMode('paper'); close.focus();
  }
  el('paper-dismiss').onclick = () => close.click();

  function inspect(id) {
    const game = getGame();
    const context = `${getRoom(game.room).name} · ${game.year}`;
    if (id === 'device') {
      setGame(advance(game, id)); renderRoom();
      show('Found on the platform', 'The pocket instrument', [
        'A brass instrument, wrapped in an old railway handkerchief. P. Naik is scratched inside the lid. Prakash used to keep it in his coat; Anay had always thought it was a watch. Two dates sit beneath the glass.',
      ], { kind: 'object', art: dialArt, label: 'Take a closer look', after: () => { setMode('explore'); onDevice(); } });
      return;
    }
    if (id === 'recover') {
      const next = advance(game, id); setGame(next);
      const found = next.clues.includes('original');
      const item = found ? evidence.original : { title: 'Upper cabinet', body: 'The shelf survived the flood. There is room for a small tin.' };
      show(context, item.title, [item.body], { kind: found ? 'document' : 'observation' }); return;
    }
    if (id === 'archive-compare' && game.clues.includes(id)) {
      show(context, evidence[id].title, [evidence[id].body], { kind: 'document' }); return;
    }
    if (Object.hasOwn(puzzles, id)) {
      const puzzle = puzzles[id];
      if (!getActions(game).includes(id)) {
        const descriptions = {
          'archive-compare': 'Two brass paperweights sit on an empty desk. There’s room to lay the accounts side by side.',
          route: game.routeSet ? 'The pencil line ends at the goods siding.' : 'Two lines branch here. Prakash may remember which one he used.',
          preserve: 'The paper is thin. Thirty years of damp would leave very little of it.',
        };
        show(context, puzzle.title, [descriptions[id]], { art: id === 'route' ? routeArt : '' }); return;
      }
      show(context, puzzle.title, [puzzle.text], { kind: 'puzzle', art: id === 'route' ? routeArt : '' });
      if (id === 'archive-compare') {
        const accounts = document.createElement('div'); accounts.className = 'comparison-accounts';
        for (const key of ['report', 'office-testimony']) {
          const article = document.createElement('article'); const heading = document.createElement('h3');
          heading.textContent = evidence[key].title; article.append(heading); paragraph(evidence[key].body, article); accounts.append(article);
        }
        body.append(accounts);
      }
      choices(puzzle.choices.map(([value, label]) => [label, () => {
        const current = getGame(); const next = advance(current, id, value);
        if (next === current) { el('paper-feedback').textContent = puzzle.wrong; return; }
        setGame(next);
        const result = {
          'archive-compare': evidence['archive-compare'],
          route: { title: 'The goods siding', body: 'The route matches the yellow triangle. The dispatch drawer is open.' },
          preserve: { title: 'Above the water', body: 'You wrap the paper, close the tin, and place it on the upper shelf. Now, to see if it lasts.' },
        }[id];
        show(context, result.title, [result.body]);
      }])); return;
    }
    if (id === 'exhibit') {
      if (getActions(game).includes(id)) showChronology();
      else show('Devgarh · 2028', 'A story still missing', ['An empty space in the exhibit. Whoever writes this label will decide what visitors remember of the last train.']);
      return;
    }
    const item = evidence[id];
    if (!item) return;
    if (id === 'bridge-survey' && !getActions(game).includes(id)) {
      show(context, 'Survey mark', ['Several chalk lines cross the piers. Someone at the goods shed may know which one matters.']); return;
    }
    if (id === 'dispatch' && !game.routeSet) {
      show(context, 'Dispatch drawer', ['The drawer is shut. Beside it, a demonstration panel shows a sketch of two routes.']); return;
    }
    setGame(advance(game, id));
    show(context, item.title, [item.body], { kind: recordIds.has(id) ? 'document' : 'observation' });
  }

  function showChronology() {
    show('Devgarh · 2028', 'The final service', ['Place the three events in order using the recovered dispatch.'], { kind: 'exhibit' });
    const order = [];
    const list = document.createElement('ol'); list.className = 'chronology'; body.append(list);
    const row = choices(chronology.map(([id, label]) => [label, () => {
      order.push(id);
      const item = document.createElement('li'); item.textContent = label; list.append(item);
      [...row.children].find((button) => button.textContent === label).disabled = true;
      if (order.length < chronology.length) return;
      const game = getGame(); const next = advance(game, 'exhibit', order);
      if (next === game) {
        el('paper-feedback').textContent = 'The dispatch times tell a different story. Take another look.';
        choices([['Reset sequence', showChronology], ['Journal', showJournal]]); return;
      }
      setGame(next);
      transition(() => {
        renderRoom();
        show('Devgarh · Reopening', 'The last train', [
          'The original dispatch sits under glass beside the timetable. Its label explains why Prakash sent the train to the goods shed.',
          'Jadhav comes to see it. He reads the label twice. “Us raat maine sirf aadhi baat likhi thi.”',
          'Outside, Anay listens to the rain on the roof. He can still tell where the platform ends without looking.',
        ], { kind: 'ending', label: 'Stay a little longer' });
        const home = document.createElement('a'); home.href = '/'; home.textContent = 'Return to KAL'; home.className = 'ending-home'; body.append(home);
      });
    }]));
  }

  function showJournal() {
    const game = getGame();
    show('Anay’s notebook', 'Journal', [getQuestion(game)], { kind: 'journal' });
    const map = document.createElement('details'); map.className = 'station-map';
    const summary = document.createElement('summary'); summary.textContent = 'Find your way around Devgarh'; map.append(summary);
    const route = document.createElement('ol');
    for (const room of rooms) {
      const stop = document.createElement('li'); stop.textContent = room.name;
      if (room.id === game.room) { stop.setAttribute('aria-current', 'location'); stop.textContent += ' — you are here'; }
      route.append(stop);
    }
    paragraph('West to east. Walk left toward the bridge, right toward the outpost. The locations stay in the same order in both years.', map);
    map.append(route); body.append(map);
    if (!game.clues.length) {
      paragraph('Nothing written down yet. The old outpost still has its files.');
    } else {
      const layout = document.createElement('div'); layout.className = 'journal-layout';
      const index = document.createElement('nav'); index.setAttribute('aria-label', 'Collected evidence');
      const page = document.createElement('article'); page.className = 'journal-page';
      const showEntry = (id) => {
        page.replaceChildren(); const heading = document.createElement('h3'); heading.textContent = evidence[id].title;
        page.append(heading); paragraph(evidence[id].body, page);
        [...index.children].forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.clue === id)));
      };
      for (const id of game.clues.filter((key) => evidence[key])) {
        const button = document.createElement('button'); button.textContent = evidence[id].title; button.dataset.clue = id;
        button.onclick = () => showEntry(id); index.append(button);
      }
      layout.append(index, page); body.append(layout); showEntry(game.clues.at(-1));
    }
    choices([['I could use a hint', () => { el('paper-feedback').textContent = getLead(getGame()); }]]);
  }

  function showPause() {
    show('KAL · The Last Train', 'Take your time', ['Devgarh will be here when you get back.'], { kind: 'pause', label: 'Resume the story' });
    const controls = document.createElement('dl'); controls.className = 'controls-reference';
    controls.innerHTML = '<div><dt>Move</dt><dd>A / D or ← / →</dd></div><div><dt>Walk faster</dt><dd>Hold Shift</dd></div><div><dt>Look or talk</dt><dd>E</dd></div><div><dt>Turn the dial</dt><dd>Q</dd></div><div><dt>Open journal</dt><dd>J</dd></div><div><dt>Pause / return</dt><dd>Esc</dd></div>';
    body.append(controls, sound);
    choices([['Start a new visit', () => {
      show('A new visit', 'Start again?', ['This replaces your current investigation.'], { kind: 'pause', label: 'Keep playing' });
      choices([['Start again', onRestart]]);
    }]]);
    const home = document.createElement('a'); home.href = '/'; home.textContent = 'Back to the demo page'; home.className = 'pause-home'; body.append(home);
  }
  return { inspect, showJournal, showPause, close: () => close.click() };
}
