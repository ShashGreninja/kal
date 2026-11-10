const object = (id, x, label) => ({ id, x, label });
const person = (id, x, label) => ({ id, x, label, person: true });

export const rooms = [
  { id: 'bridge', name: 'River bridge', art: 'railway-west', row: 0, outside: true,
    past: [object('bridge-survey', .53, 'Survey mark')],
    future: [object('high-water', .51, 'High-water line')] },
  { id: 'goods', name: 'Goods shed', art: 'railway-west', row: 1, outside: true,
    past: [person('desai', .28, 'Desai'), object('goods-route', .66, 'Siding plate')],
    future: [object('shed-plate', .61, 'Loading platform')] },
  { id: 'signal', name: 'Signal cabin', art: 'railway-west', row: 2,
    past: [person('prakash', .21, 'Prakash'), object('route', .49, 'Track diagram'), object('dispatch', .74, 'Dispatch drawer'), object('preserve', .84, 'Dispatch copy')],
    future: [object('damaged-desk', .24, 'Water-damaged desk'), object('recover', .78, 'Upper cabinet')] },
  { id: 'records', name: 'Records room', art: 'railway-middle', row: 0,
    past: [object('register', .34, 'Index register'), object('archive-compare', .66, 'Comparison desk')],
    future: [person('leela', .31, 'Leela'), object('damage-map', .68, 'Renovation survey')] },
  { id: 'office', name: 'Stationmaster’s office', art: 'railway-middle', row: 1,
    past: [person('stationmaster', .57, 'Stationmaster')],
    future: [object('office-photo', .59, 'Staff photograph')] },
  { id: 'tickets', name: 'Ticket hall', art: 'railway-middle', row: 2,
    past: [object('timetable', .58, 'Timetable')],
    future: [object('ticket-stub', .50, 'Ticket stub')] },
  { id: 'tea', name: 'Tea stall', art: 'railway-east', row: 0, outside: true,
    past: [person('nirmala', .58, 'Nirmala')],
    future: [object('tea-cups', .58, 'Enamel cups')] },
  { id: 'platform', name: 'Devgarh platform', art: 'platform-eras', outside: true,
    past: [object('platform-clock', .33, 'Station clock')],
    future: [object('device', .20, 'Pocket instrument'), object('exhibit', .54, 'Exhibit board')] },
  { id: 'approach', name: 'Station approach', art: 'railway-east', row: 1, outside: true,
    past: [object('lantern', .50, 'Entry lantern')],
    future: [object('arrival-note', .50, 'Inventory note')] },
  { id: 'police', name: 'Railway police outpost', art: 'railway-east', row: 2,
    past: [person('jadhav', .62, 'Constable Jadhav')],
    future: [object('report', .29, 'Closure report'), object('police-log', .51, 'Duty log'), person('retired', .74, 'Retired Jadhav')] },
];

export function getRoom(id) {
  return rooms.find((room) => room.id === id);
}

export function neighbor(id, direction) {
  const index = rooms.findIndex((room) => room.id === id);
  return rooms[index + (direction === 'left' ? -1 : 1)];
}

export function getInteractions(game) {
  return getRoom(game.room)[game.year === 1998 ? 'past' : 'future'];
}
