import { getInteractions, neighbor } from './world.mjs';
import { evidence } from './case.mjs';

export function createGame() {
  return { year: 2028, room: 'approach', hasDevice: false, firstShiftSeen: false, clues: [], routeSet: false, preserved: false, finished: false };
}

export function getActions(game) {
  if (game.finished) return [];
  const actions = getInteractions(game).map(({ id }) => id);
  if (neighbor(game.room, 'left')) actions.push('left');
  if (neighbor(game.room, 'right')) actions.push('right');
  if (game.hasDevice) actions.push('shift');
  const has = (...clues) => clues.every((clue) => game.clues.includes(clue));
  if (game.year === 1998) {
    if (game.room === 'tea' && has('retired-testimony')) actions.push('tea-testimony');
    if (game.room === 'office' && has('tea-testimony', 'timetable')) actions.push('office-testimony');
    if (game.room === 'goods' && has('tea-testimony')) actions.push('desai-testimony');
    if (game.room === 'signal' && has('archive-compare', 'bridge-survey', 'goods-route')) actions.push('signal-testimony');
  } else {
    if (game.room === 'police' && has('report', 'police-log')) actions.push('retired-testimony');
    if (game.room === 'records' && has('damaged-desk')) actions.push('leela-testimony');
  }
  return actions.filter((action) => {
    switch (action) {
      case 'device': return !game.hasDevice;
      case 'archive-compare': return has('office-testimony', 'report');
      case 'bridge-survey': return has('desai-testimony');
      case 'route': return has('signal-testimony') && !game.routeSet;
      case 'dispatch': return game.routeSet;
      case 'preserve': return has('dispatch', 'damaged-desk') && (has('leela-testimony') || has('damage-map')) && !game.preserved;
      case 'recover': return game.preserved;
      case 'exhibit': return has('original', 'report');
      default: return true;
    }
  });
}

export function advance(game, action, choice) {
  if (!getActions(game).includes(action)) return game;
  switch (action) {
    case 'left':
    case 'right': return { ...game, room: neighbor(game.room, action).id };
    case 'device': return { ...game, hasDevice: true };
    case 'shift': return { ...game, year: game.year === 1998 ? 2028 : 1998 };
    case 'route': return choice === 'goods' ? { ...game, routeSet: true } : game;
    case 'archive-compare': return choice === 'warning' && !game.clues.includes(action)
      ? { ...game, clues: [...game.clues, action] } : game;
    case 'preserve': return choice === 'tin' ? { ...game, preserved: true } : game;
    case 'exhibit':
      return Array.isArray(choice) && choice.join(',') === 'warning,diversion,arrival'
        ? { ...game, finished: true } : game;
    default: {
      const clue = action === 'recover' ? 'original' : action;
      if (!Object.hasOwn(evidence, clue)) return game;
      return game.clues.includes(clue) ? game : { ...game, clues: [...game.clues, clue] };
    }
  }
}

export function getLead(game) {
  const has = (clue) => game.clues.includes(clue);
  if (!has('report') || !has('police-log')) return 'The police outpost kept the official file and its own duty log.';
  if (!has('retired-testimony')) return 'Ask retired Jadhav who brought the message recorded in his duty log.';
  if (!game.hasDevice) return 'Anay’s inventory includes a small instrument on the platform.';
  if (!has('tea-testimony')) return 'The duty log mentions a runner from the tea stall. Someone there may remember the warning.';
  if (!has('office-testimony')) return 'Compare the ticket hall timetable with what Nirmala saw. Bring both to the stationmaster.';
  if (!has('archive-compare')) return 'Take the official account and the stationmaster’s recollection to the comparison desk.';
  if (!has('desai-testimony')) return 'Ask Desai in the goods shed what he saw at the bridge.';
  if (!has('signal-testimony')) return 'The bridge and goods shed can corroborate the route before you speak to Prakash.';
  if (!has('dispatch')) return 'The cabin has a demonstration panel. Reconstruct the route Prakash described.';
  if (!game.preserved) return 'Look at what water damaged in 2028 before choosing where to store the dispatch.';
  if (!has('original')) return 'Check the signal cabin again in 2028.';
  return 'The exhibit board is on the platform. Use the evidence to reconstruct that evening.';
}

export function getQuestion(game) {
  const has = (id) => game.clues.includes(id);
  if (game.finished) return 'Prakash’s story is back where it belongs.';
  if (!has('report')) return game.room === 'police'
    ? 'Why was Prakash blamed? The closure report is here in the outpost.'
    : 'Why was Prakash blamed? Start at the outpost to the right.';
  if (!has('police-log')) return 'Does the duty log agree with the closure report?';
  if (!has('retired-testimony')) return 'Jadhav was there. What does he remember about the message?';
  if (!game.hasDevice) return 'There is still an instrument to catalogue on the platform.';
  if (!has('tea-testimony')) return 'Who sent the runner? Visit the tea stall in 1998.';
  if (!has('office-testimony')) return 'What happened between the warning and the last train?';
  if (!has('archive-compare')) return 'Which event did the official account leave out?';
  if (!has('signal-testimony')) return 'Was another route safe? Find what supports Prakash’s decision.';
  if (!has('dispatch')) return 'Can the cabin’s records confirm where the train went?';
  if (!game.preserved) return 'How can a fragile record survive thirty monsoons?';
  if (!has('original')) return 'Did the dispatch survive? Return to the cabin in 2028.';
  return 'The platform exhibit is missing the truth. You have its record.';
}
