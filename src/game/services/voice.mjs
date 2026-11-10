import { encodeSpeech } from './wave.mjs';
const maxSeconds = 20;
const sampleRate = 16000;

export function attachVoice({ button, status, isOpen, onTranscript, onRecording = () => {} }) {
  let recorder;
  let timer;
  let generation = 0;
  let request;
  let media;
  let selectedDevice='';
  try{selectedDevice=localStorage.getItem('kal-microphone')||'';}catch{}
  const settings=document.createElement('details'); settings.className='microphone-settings';
  settings.innerHTML='<summary>Microphone settings</summary><label>Input device <select aria-label="Microphone input"><option value="">System default microphone</option></select></label><label><input type="checkbox" checked> Filter background noise</label><p>Choose your microphone, then watch the level while speaking.</p><audio controls hidden aria-label="Listen to your recording"></audio>';
  button.closest('form').after(settings);
  const device=settings.querySelector('select');const filter=settings.querySelector('input');const preview=settings.querySelector('audio');
  let previewUrl;
  async function listInputs(){
    if(!navigator.mediaDevices?.enumerateDevices)return;
    try{const devices=await navigator.mediaDevices.enumerateDevices();device.replaceChildren(new Option('System default microphone',''));for(const input of devices.filter(d=>d.kind==='audioinput'&&d.deviceId))device.add(new Option(input.label||'Microphone '+device.options.length,input.deviceId));if([...device.options].some(o=>o.value===selectedDevice))device.value=selectedDevice;else selectedDevice='';}catch{}
  }
  device.onchange=()=>{cancel();selectedDevice=device.value;try{localStorage.setItem('kal-microphone',selectedDevice);}catch{}};
  filter.onchange=()=>cancel();
  settings.addEventListener('toggle',()=>{if(settings.open)listInputs();});
  navigator.mediaDevices?.addEventListener?.('devicechange',listInputs);
  function clearPreview(){preview.pause();preview.removeAttribute('src');preview.hidden=true;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=undefined;}

  let meterContext, meterTimer;
  const meter = document.createElement('meter');
  meter.min = 0; meter.max = 1; meter.value = 0;
  meter.setAttribute('aria-label', 'Microphone level'); meter.hidden = true;
  meter.className = 'microphone-level'; button.after(meter);
  function stopMeter() { clearInterval(meterTimer); meterContext?.close().catch(() => {}); meterContext = undefined; meter.hidden = true; }
  function startMeter(stream) {
    try {
      meterContext = new AudioContext();
      const analyser = meterContext.createAnalyser(); analyser.fftSize = 256;
      meterContext.createMediaStreamSource(stream).connect(analyser);
      const samples = new Float32Array(256); meter.hidden = false;
      meterContext.resume().catch(() => {});
      meterTimer = setInterval(() => { analyser.getFloatTimeDomainData(samples); meter.value = Math.min(1, Math.sqrt(samples.reduce((sum,n) => sum+n*n,0)/256)*8); }, 80);
    } catch { stopMeter(); }
  }

  fetch('/api/capabilities')
    .then((response) => response.json())
    .then(({ voice }) => {
      settings.hidden = !voice;
      button.hidden = !voice || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder;
    })
    .catch(() => {});

  function cancel() {
    generation += 1; stopMeter(); clearPreview();
    clearTimeout(timer);
    request?.abort();
    if (recorder?.state === 'recording') recorder.stop();
    media?.getTracks().forEach((track) => track.stop());
    recorder = undefined;
    button.disabled = false;
    button.textContent = 'Speak';
    button.setAttribute('aria-pressed', 'false');
    status.textContent = '';
  }

  button.addEventListener('click', async () => {
    if (recorder?.state === 'recording') {
      recorder.stop();
      return;
    }

    if(!isOpen())return;
    clearPreview();
    const attempt = ++generation;
    button.disabled = true;
    status.textContent = 'Opening the microphone…';
    try {
      onRecording();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: filter.checked, autoGainControl: true, ...(selectedDevice ? { deviceId: { exact:selectedDevice } } : {}) } });
      if (attempt !== generation || !isOpen()) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      media = stream; await listInputs();
      if(attempt!==generation || !isOpen()){stream.getTracks().forEach(track=>track.stop());return;}
      const mimeType=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'].find(type=>MediaRecorder.isTypeSupported(type));
      const recording = new MediaRecorder(stream, { ...(mimeType?{mimeType}:{}), audioBitsPerSecond:128000 });
      const chunks = [];
      recorder = recording;
      recording.addEventListener('dataavailable', ({ data }) => chunks.push(data));
      recording.addEventListener('stop', async () => {
        clearTimeout(timer); stopMeter();
        stream.getTracks().forEach((track) => track.stop());
        if (attempt !== generation) return;
        button.disabled = true;
        button.textContent = 'Speak';
        button.setAttribute('aria-pressed', 'false');
        status.textContent = 'Listening back…';
        try {
          const wave = await toWave(new Blob(chunks, { type: recording.mimeType }));
          if (attempt !== generation) return;
          previewUrl=URL.createObjectURL(new Blob([wave],{type:'audio/wav'})); preview.src=previewUrl;preview.hidden=false;
          request = new AbortController();
          const result = await fetch('/api/transcribe', {
            method: 'POST', headers: { 'Content-Type': 'audio/wav' }, body: wave,
            signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]),
          });
          if (!result.ok) throw new Error('Transcription failed');
          const { transcript } = await result.json();
          if (attempt !== generation) return;
          status.textContent = transcript ? '' : 'I couldn’t hear that. Try again.';
          if (transcript) onTranscript(transcript);
        } catch(error) {
          if (attempt === generation) { status.textContent = error.message==='NO_AUDIO' ? 'No voice reached the microphone. Choose another input in Microphone settings.' : 'Couldn’t transcribe that. Check your recording in Microphone settings, then try again.'; settings.open=true; }
        } finally {
          if (attempt === generation) button.disabled = !isOpen();
        }
      }, { once: true });
      recording.start(250); startMeter(stream);
      button.textContent = 'Finish speaking';
      status.textContent = 'Listening… tap Finish speaking when you’re done.';
      button.setAttribute('aria-pressed', 'true');
      button.disabled = false;
      timer = setTimeout(() => {
        if (recording.state === 'recording') recording.stop();
      }, maxSeconds * 1000);
    } catch {
      if (attempt !== generation) return;
      cancel();
      settings.open=true;
      status.textContent = 'Microphone unavailable. Choose an available input and check browser microphone permission.';
    }
  });

  return { cancel };
}

async function toWave(recording) {
  const context = new AudioContext({ sampleRate });
  let audio;
  try {
    audio = await context.decodeAudioData(await recording.arrayBuffer());
  } finally {
    await context.close();
  }
  return encodeSpeech(Array.from({length:audio.numberOfChannels},(_,i)=>audio.getChannelData(i)),audio.sampleRate,maxSeconds);
}
