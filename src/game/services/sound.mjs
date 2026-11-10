export function attachAmbience(button) {
  let context, rainLevel, melodyLevel, effectsLevel, timer;
  let enabled = false, beat = 0;
  let state = { year: 2028, speaking: false, finished: false, mode: 'title' };
  function update(year, speaking, finished, mode = state.mode) {
    state = { year, speaking, finished, mode };
    if (!context) return;
    const gain = enabled ? 1 : 0;
    rainLevel.gain.setTargetAtTime(gain * (mode === 'intro' ? .065 : .055), context.currentTime, .4);
    melodyLevel.gain.setTargetAtTime(gain * (mode === 'intro' ? .7 : .18), context.currentTime, .5);
    effectsLevel.gain.setTargetAtTime(enabled ? .5 : 0, context.currentTime, .08);
  }
  function tone(frequency, when, length, volume, destination = melodyLevel, type = 'sine') {
    const voice = context.createOscillator(), envelope = context.createGain();
    voice.type = type; voice.frequency.value = frequency;
    envelope.gain.setValueAtTime(.0001, when);
    envelope.gain.exponentialRampToValueAtTime(volume, when + .025);
    envelope.gain.exponentialRampToValueAtTime(.0001, when + length);
    voice.connect(envelope).connect(destination); voice.start(when); voice.stop(when + length + .02);
    voice.onended = () => { voice.disconnect(); envelope.disconnect(); };
  }
  function start() {
    context = new AudioContext();
    rainLevel = context.createGain(); melodyLevel = context.createGain(); effectsLevel = context.createGain();
    for (const level of [rainLevel, melodyLevel, effectsLevel]) { level.gain.value = 0; level.connect(context.destination); }
    const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const samples = buffer.getChannelData(0); let low = 0;
    for (let i = 0; i < samples.length; i++) { low = (low + (Math.random() * 2 - 1) * .018) / 1.018; samples[i] = low * 2.7; }
    const rain = context.createBufferSource(); rain.buffer = buffer; rain.loop = true; rain.connect(rainLevel); rain.start();
  }
  function playNote() {
    if (!enabled || !context) return;
    const intro = state.mode === 'intro';
    const notes = intro ? [196, 293.66, 349.23, 293.66, 261.63, 233.08, 196, 146.83] : [196, 293.66, 261.63, 220, 196, 146.83];
    const frequency = notes[beat++ % notes.length]; const now = context.currentTime;
    tone(frequency, now, 3.4, .055);
    tone(frequency * 2, now + .04, 1.6, .012);
    if (intro && beat % 4 === 1) { tone(98, now, 7, .026); tone(146.83, now + .2, 6.5, .018); }
  }
  function cue(kind, year) {
    if (!enabled || !context) return;
    const now = context.currentTime;
    if (kind === 'shift') {
      const notes = year === 1998 ? [392, 587.33, 783.99, 1174.66] : [1174.66, 783.99, 587.33, 392];
      notes.forEach((frequency, i) => { tone(frequency, now + i * .09, 1.6, .075, effectsLevel); tone(frequency * 1.002, now + i * .09, 1.8, .016, effectsLevel); });
    } else if (kind === 'found') {
      tone(523.25, now, .65, .045, effectsLevel); tone(783.99, now + .12, .9, .035, effectsLevel);
    } else if (kind === 'step') {
      tone(72, now, .075, .035, effectsLevel, 'triangle');
    }
  }
  button.addEventListener('click', async () => {
    if (!context) start();
    enabled = !enabled;
    button.setAttribute('aria-pressed', String(enabled)); button.textContent = enabled ? 'Sound on' : 'Sound off';
    update(state.year, state.speaking, state.finished, state.mode);
    clearInterval(timer);
    if (enabled) { await context.resume(); if (!enabled) return; playNote(); timer = setInterval(playNote, 2400); }
  });
  return { update, cue };
}
