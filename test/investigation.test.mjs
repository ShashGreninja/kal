import assert from 'node:assert/strict';
import test from 'node:test';
import { rooms, getInteractions } from '../src/shared/world.mjs';
import { advance, createGame, getActions } from '../src/shared/investigation.mjs';
import { interview } from '../server/dialogue.mjs';

test('both eras offer ten connected scenes, with the police outpost east of the approach', () => {
  assert.equal(rooms.length * 2, 20);
  let game = createGame();
  game = advance(game, 'right');
  assert.equal(game.room, 'police');
  for (let index = 1; index < rooms.length; index++) game = advance(game, 'left');
  assert.equal(game.room, 'bridge');
  assert.equal(advance(game, 'left'), game);
  for (const year of [1998, 2028]) {
    for (const room of rooms) assert.ok(getInteractions({ ...game, room: room.id, year }).length);
  }
});

test('the dispatch has to be earned and preserved before the exhibit can be completed', () => {
  let game = createGame();
  const doAction = (action) => { game = advance(game, action); };
  assert.equal(advance(game, 'dispatch'), game);
  doAction('right'); doAction('report'); doAction('police-log'); doAction('retired-testimony');
  doAction('left'); doAction('left'); doAction('device'); doAction('shift');
  doAction('left'); doAction('tea-testimony');
  doAction('left'); doAction('timetable');
  doAction('left'); doAction('office-testimony');
  doAction('left');
  assert.equal(advance(game, 'archive-compare', 'cargo'), game);
  game = advance(game, 'archive-compare', 'warning');
  doAction('left');
  assert.equal(advance(game, 'dispatch'), game);
  doAction('left'); doAction('goods-route'); doAction('desai-testimony');
  doAction('left'); doAction('bridge-survey');
  doAction('right'); doAction('right'); doAction('signal-testimony');
  assert.ok(getActions(game).includes('route'));
  assert.equal(advance(game, 'route', 'main'), game);
  doAction('route'); // Choice is required.
  assert.equal(game.clues.includes('dispatch'), false);
  game = advance(game, 'route', 'goods');
  doAction('dispatch');
  assert.equal(advance(game, 'preserve', 'tin'), game);
  doAction('shift'); doAction('damaged-desk');
  doAction('right'); doAction('leela-testimony'); doAction('left'); doAction('shift');
  assert.equal(advance(game, 'preserve', 'desk'), game);
  game = advance(game, 'preserve', 'tin');
  doAction('shift'); doAction('recover');
  assert.equal(game.clues.includes('original'), true);
  for (let index = 0; index < 5; index++) doAction('right');
  assert.equal(game.room, 'platform');
  assert.equal(advance(game, 'exhibit', ['diversion', 'warning', 'arrival']), game);
  game = advance(game, 'exhibit', ['warning', 'diversion', 'arrival']);
  assert.equal(game.finished, true);
});

test('a witness stays in their own scene and requires relevant evidence to disclose a clue', async () => {
  let state = advance(createGame(), 'right');
  assert.equal(await interview({ id: 'prakash', question: 'Who changed the route?', state }), null);
  const ask = (offered) => interview({ id: 'retired', question: '18:42 ka log?', state, offered });
  assert.equal((await ask('')).reveal, undefined);
  state = advance(advance(state, 'report'), 'police-log');
  assert.equal(await ask('timetable'), null);
  assert.equal((await ask('police-log')).reveal, 'retired-testimony');
});
