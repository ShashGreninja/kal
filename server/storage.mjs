const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

export const storageEnabled = Boolean(url && key);

async function request(table, params, options = {}) {
  const endpoint = new URL('/rest/v1/' + table, url);
  endpoint.search = new URLSearchParams(params).toString();
  const response = await fetch(endpoint, {
    ...options,
    headers: { apikey: key, 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(6500),
  });
  if (!response.ok) throw new Error('Supabase request failed');
  return response;
}

export async function loadSave(id) {
  const response = await request('kal_saves', { id: 'eq.' + id, select: 'state', limit: '1' });
  const [save] = await response.json();
  return save?.state ?? null;
}

export async function storeSave(id, state) {
  await request('kal_saves', { on_conflict: 'id' }, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id, state, updated_at: new Date().toISOString() }),
  });
}

export async function retrieveFacts(witness, question, available) {
  const response = await request('kal_witness_facts', {
    witness: 'eq.' + witness, select: 'id,keywords,fact,reveal', limit: '20',
  });
  const text = question.normalize('NFKC').toLocaleLowerCase('en-IN');
  return (await response.json())
    .filter((fact) => !fact.reveal || available.includes(fact.reveal))
    .map((fact) => ({ ...fact, score: fact.keywords.filter((word) => text.includes(word)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
