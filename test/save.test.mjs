import test from 'node:test';
import assert from 'node:assert/strict';
import { createSaveStore } from '../src/game/services/save.mjs';
import { createGame, advance } from '../src/shared/investigation.mjs';

test('a new visit has no evidence and talking to a witness is not itself evidence', () => {
  const fresh = createGame();
  assert.deepEqual(fresh.clues, []);
  const police = advance(fresh, 'right');
  assert.equal(advance(police, 'retired'), police);
  assert.deepEqual(advance(police, 'report').clues, ['report']);
  assert.deepEqual(fresh.clues, []);
});

test('late restore cannot replace a fresh slot and queued writes keep their destination', async () => {
  let stored = 'old'; let resolveRestore;
  const writes = [];
  const store = createSaveStore({ storage: { getItem: () => stored, setItem: (_, id) => { stored = id; } },
    uuid: () => 'new', request: (url, options) => {
      if (!options) return new Promise(resolve => { resolveRestore = resolve; });
      writes.push({ url, state: JSON.parse(options.body) }); return Promise.resolve({ ok: true });
    },
  });
  const restoring = store.restore(true);
  store.fresh();
  resolveRestore({ ok: true, json: async () => ({ state: { ...createGame(), clues: ['report'] } }) });
  assert.equal(await restoring, null);
  await store.save(createGame());
  assert.equal(writes[0].url, '/api/saves/new');
  assert.deepEqual(writes[0].state.clues, []);
  const second = createSaveStore({ storage: { getItem: () => 'old', setItem() {} }, uuid: () => 'new',
    request: async (url, options) => {
      if (options) writes.push({ url });
      return { ok: true, json: async () => ({ state: createGame() }) };
    },
  });
  await second.restore(true);
  const pending = second.save(createGame()); second.fresh(); await pending;
  assert.equal(writes.at(-1).url, '/api/saves/old');
});
