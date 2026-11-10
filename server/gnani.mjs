import { pronunciationText } from './pronunciation.mjs';
export async function transcribe(audio, key) {
  try {
    const body = new FormData();
    body.set('audio_file', new Blob([audio], { type: 'audio/wav' }), 'question.wav');
    body.set('model', 'prisma-v3.0');
    body.set('language_code', 'hi-IN,en-IN');
    body.set('format', 'codemix');

    const response = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: { 'X-API-Key-ID': key },
      body,
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error('Transcription request rejected');
    const result = await response.json();
    if (!result.success || typeof result.transcript !== 'string') throw new Error('Missing transcript');
    return result.transcript.trim();
  } catch {
    const error = new Error('Speech transcription failed');
    error.code = 'GNANI_REQUEST_FAILED';
    throw error;
  }
}

const voices = {
  stationmaster: 'Vikrant', nirmala: 'Ambuja', prakash: 'Jalaj', jadhav: 'Deepak',
  retired: 'Roopesh', desai: 'Hemraj', leela: 'Bhavna',
};

export async function synthesize(text, key, witness) {
  const response = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key-ID': key },
    body: JSON.stringify({
      text: pronunciationText(text), voice: voices[witness], model: 'timbre-v2.5', language: 'hi-IN',
      audio_config: { sample_rate: 48000, num_channels: 1, sample_width: 2, encoding: 'linear_pcm', container: 'wav' },
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Voice request rejected');
  return Buffer.from(await response.arrayBuffer());
}
