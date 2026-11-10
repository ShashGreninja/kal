// Snapshot destination and body so queued writes never cross visit boundaries.
export function createSaveStore({ storage, request, uuid }) {
  let endpoint, enabled = false, generation = 0;
  let pending = Promise.resolve();
  return {
    async restore(available) {
      enabled = available;
      const revision = generation;
      if (!enabled) return null;
      try {
        const id = storage.getItem('kal-save');
        if (!id) return null;
        const response = await request('/api/saves/' + id);
        const state = response.ok ? (await response.json()).state : null;
        if (revision !== generation) return null;
        endpoint = '/api/saves/' + id;
        return state;
      } catch { return null; }
    },
    fresh() {
      generation++;
      const id = uuid();
      endpoint = '/api/saves/' + id;
      try { storage.setItem('kal-save', id); } catch { /* Storage failure must not prevent play. */ }
    },
    save(state) {
      if (!enabled || !endpoint) return Promise.resolve();
      const destination = endpoint, body = JSON.stringify(state);
      pending = pending.then(() => request(destination, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body,
      })).catch(() => {});
      return pending;
    },
  };
}
const store = createSaveStore({
  storage: { getItem: (key) => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) },
  request: (...args) => fetch(...args), uuid: () => crypto.randomUUID(),
});
export const restore = store.restore;
export const save = store.save;
export const fresh = store.fresh;
