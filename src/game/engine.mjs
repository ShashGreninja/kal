import { getInteractions, getRoom, neighbor } from '../shared/world.mjs';
import { makeActor } from './render/actor.mjs';
import { drawRoom } from './render/art.mjs';
import { strideDistance } from './render/gait.mjs';

export function createEngine({ getGame, getMode, isTransitioning, onTravel, onInteract, onMove, onNearby, onFootstep = () => {} }) {
  const el = (id) => document.getElementById(id);
  const stage = el('stage');
  const world = el('world');
  const player = makeActor('anay');
  el('player').append(player.svg);
  const held = new Set();
  let x = .5;
  let target = null;
  let pendingInteraction;
  let facing = 1;
  let phase = 0;
  let stride = 0;
  let previous;
  let nearby;
  let figures = [];
  let points = [];
  let lastPrompt = '';
  const directions = new Map([['ArrowLeft', 'left'], ['KeyA', 'left'], ['ArrowRight', 'right'], ['KeyD', 'right']]);
  const active = () => getMode() === 'explore' && !isTransitioning() && !getGame().finished;

  function clear() { held.clear(); target = null; pendingInteraction = undefined; }
  function render() {
    const game = getGame();
    const room = getRoom(game.room);
    drawRoom(el('backdrop'), room, game.finished ? 1998 : game.year);
    el('rain').hidden = !room.outside || game.finished;
    world.style.setProperty('--floor', room.id === 'platform' ? '9%' : '6%');
    el('year').textContent = game.year;
    el('room').textContent = room.name;
    el('chapter').textContent = game.finished ? 'A story remembered' : game.preserved ? 'What survives' : game.hasDevice ? 'Two sides of an evening' : 'A return to Devgarh';
    el('shift').hidden = !game.hasDevice || game.finished;
    el('shift-destination').textContent = game.year === 1998 ? '2028' : '1998';
    el('shift').setAttribute('aria-label', `Turn the dial to ${game.year === 1998 ? 2028 : 1998}`);
    el('actors').replaceChildren();
    world.querySelectorAll('.scene-point').forEach((point) => point.remove());
    figures = [];
    points = [];
    for (const item of game.finished ? [] : getInteractions(game)) {
      if (item.id === 'device' && game.hasDevice) continue;
      if (item.id === 'preserve' && (!game.clues.includes('dispatch') || game.preserved)) continue;
      if (item.person) {
        const figure = document.createElement('div');
        figure.className = 'actor npc';
        figure.dataset.person = item.id;
        figure.style.setProperty('--x', `${item.x * 100}%`);
        figure.style.setProperty('--face', -1);
        const model = makeActor(item.id);
        figure.append(model.svg);
        el('actors').append(figure);
        figures.push({ model, figure, x: item.x });
      }
      const point = document.createElement('button');
      point.className = 'scene-point';
      point.setAttribute('aria-label', (item.person ? 'Talk to ' : 'Inspect ') + item.label);
      point.style.left = `${item.x * 100}%`;
      point.style.bottom = item.person ? '51%' : '37%';
      point.innerHTML = `<span class="point-ring" aria-hidden="true"></span>`;
      point.onclick = () => {
        if (!active()) return;
        target = item.person ? item.x - .05 : item.x;
        pendingInteraction = item;
      };
      world.append(point);
      points.push({ point, item });
    }
    for (const direction of ['left', 'right']) {
      const next = neighbor(game.room, direction);
      const exit = el(direction);
      exit.hidden = !next;
      if (next) {
        exit.title = next.name;
        exit.setAttribute('aria-label', `Walk ${direction} toward ${next.name}`);
        exit.querySelector('span').textContent = next.name;
      }
    }
  }

  function animate(time) {
    const dt = Math.min((time - (previous ?? time)) / 1000, .05);
    previous = time;
    const width = Math.max(stage.clientWidth, stage.clientHeight * 2.75);
    if (active()) {
      let direction = Number(held.has('right')) - Number(held.has('left'));
      if (target !== null) direction = Math.sign(target - x);
      if (direction) {
        facing = direction;
        const before = x;
        stride = Math.min(1, stride + dt * 7);
        const speed = stage.clientHeight * .20 / width * stride * (held.has('sprint') ? 2.1 : 1);
        const next = x + direction * dt * speed;
        if (target !== null && Math.sign(target - next) !== direction) {
          x = target; target = null;
          if (pendingInteraction) { const item = pendingInteraction; pendingInteraction = undefined; onInteract(item); }
        } else x = Math.max(.022, Math.min(.978, next));
        onMove();
        if (x <= .023 && direction < 0) onTravel('left');
        if (x >= .977 && direction > 0) onTravel('right');
        const distance = Math.abs(x - before) * width;
        const previousStep = Math.floor(phase / Math.PI);
        phase += distance / (stage.clientHeight * .39 / 320) / strideDistance * Math.PI * 2;
        if (stride > .6 && Math.floor(phase / Math.PI) !== previousStep) onFootstep();
        if (distance === 0) stride = 0;
      } else stride = Math.max(0, stride - dt * 8);
      nearby = points.map(({ item }) => item).filter((item) => Math.abs(x - item.x) <= .075)
        .sort((a, b) => Math.abs(x - a.x) - Math.abs(x - b.x))[0];
      el('interact').hidden = !nearby;
      if (nearby) {
        const label = `${nearby.person ? 'Talk to' : 'Look at'} ${nearby.label}`;
        if (label !== lastPrompt) {
          el('interact').innerHTML = `<kbd>E</kbd><span>${label}</span>`;
          lastPrompt = label;
        }
        onNearby();
      }
    } else {
      stride = Math.max(0, stride - dt * 8);
      el('interact').hidden = true;
    }
    const offset = Math.max(0, Math.min(width - stage.clientWidth, x * width - stage.clientWidth / 2));
    world.style.setProperty('--world-width', `${width}px`);
    world.style.transform = `translate3d(${-offset}px,0,0)`;
    el('player').style.setProperty('--x', `${x * 100}%`);
    el('player').style.setProperty('--face', facing);
    player.pose(phase, stride, time / 1000);
    if(getMode()==='cutscene') player.react(stage.dataset.reaction==='surprise');
    figures.forEach(({ model, figure, x: nx }, i) => {
      model.pose(0, 0, time / 1000 + i * 1.5);
      figure.style.setProperty('--face', x < nx ? -1 : 1);
    });
    points.forEach(({ point, item }) => {
      point.classList.toggle('near', Math.abs(x - item.x) < .17);
      point.tabIndex = active() && Math.abs(x - item.x) < .17 ? 0 : -1;
    });
    requestAnimationFrame(animate);
  }

  world.addEventListener('click', (event) => {
    if (!active() || event.target.closest('button')) return;
    const rect = world.getBoundingClientRect();
    target = Math.max(.035, Math.min(.965, (event.clientX - rect.left) / rect.width));
    pendingInteraction = undefined;
  });
  for (const direction of ['left', 'right']) {
    el(direction).onclick = () => { if (active()) { target = direction === 'left' ? .022 : .978; pendingInteraction = undefined; } };
    const walk = el('walk-' + direction);
    walk.onpointerdown = (event) => {
      if (!active()) return;
      walk.setPointerCapture(event.pointerId); clear(); held.add(direction);
    };
    walk.onpointerup = walk.onlostpointercapture = () => held.delete(direction);
    walk.onclick = (event) => { if (event.detail === 0 && active()) target = Math.max(.022, Math.min(.978, x + (direction === 'left' ? -.1 : .1))); };
  }
  document.addEventListener('keydown', (event) => {
    if (!active() || event.target.closest('input,select')) return;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') held.add('sprint');
    const direction = directions.get(event.code);
    if (direction) { event.preventDefault(); target = null; pendingInteraction = undefined; held.add(direction); }
    if (!event.repeat && event.code === 'KeyE' && nearby) onInteract(nearby);
  });
  document.addEventListener('keyup', (event) => {
    if ((event.code === 'ShiftLeft' || event.code === 'ShiftRight') && !event.shiftKey) held.delete('sprint');
    else held.delete(directions.get(event.code));
  });
  window.addEventListener('blur', clear);
  el('interact').onclick = () => { if (active() && nearby) onInteract(nearby); };
  requestAnimationFrame(animate);
  return { render, clear, reset() { clear(); x = .5; stride = 0; phase = 0; }, enter(direction) { x = direction === 'left' ? .94 : .06; nearby = undefined; }, position: () => x };
}
