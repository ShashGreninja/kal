import { arrival as beats } from '../../shared/scenes.mjs';

export function createOnboarding({ setMode, onReady }) {
  let beat = 0;
  let moved = false;
  let inspected = false;
  let hintTimer;
  const get = (id) => document.getElementById(id);
  function render() {
    get('intro-progress').innerHTML = beats.map((_, i) => `<span class="${i <= beat ? 'seen' : ''}"></span>`).join('');
    get('intro-progress').setAttribute('aria-label', `Arrival ${beat + 1} of ${beats.length}`);
    get('intro-title').textContent = beats[beat][0];
    get('intro-body').textContent = beats[beat][1];
    get('intro-next').textContent = beat === beats.length - 1 ? 'Step inside' : 'Continue';
    const copy = get('intro-screen').querySelector('.intro-copy');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) copy.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 550, easing: 'ease-out' });
  }
  function finish() {
    setMode('explore');
    onReady();
    hint('Walk with A / D or ← / →. You can also tap the path.');
  }
  function hint(text, duration = 9000) {
    clearTimeout(hintTimer);
    get('tutorial').textContent = text;
    get('tutorial').hidden = false;
    hintTimer = setTimeout(() => { get('tutorial').hidden = true; }, duration);
  }
  get('intro-next').onclick = () => { if (++beat < beats.length) render(); else finish(); };
  get('skip-intro').onclick = finish;
  return {
    start() { beat = 0; moved = false; inspected = false; setMode('intro'); render(); get('intro-next').focus(); },
    moved() { if (!moved) { moved = true; get('tutorial').hidden = true; } },
    nearby() { if (!inspected && moved) { inspected = true; hint('Pause near something. Press E, or tap its name, to take a closer look.'); } },
    hint,
  };
}
