const options = (title, text, wrong, choices) => ({ title, text, wrong, choices });

export const puzzles = {
  'archive-compare': options('Compare the accounts', 'The official report and Kulkarni’s account disagree. Which event is missing from the official file?', 'Compare the duty log with the stationmaster’s account in your journal.', [
    ['schedule', 'The timetable had been changed'], ['warning', 'A warning came before the diversion'], ['cargo', 'The train was carrying goods'],
  ]),
  route: options('Trace the route', 'Prakash’s pencil stopped just before the two lines diverge. Choose the line the train took.', 'That mark points back toward the bridge. Compare the siding plate and Prakash’s account.', [
    ['main', 'Straight white mark'], ['goods', 'Yellow triangle'], ['loop', 'Red circle'],
  ]),
  preserve: options('Keep a copy', 'The carbon paper is still legible. Where can you put it so the archivist will find it in thirty years?', 'The lower part of the cabin took water. Look around the cabin in 2028 to see what survived.', [
    ['desk', 'Desk drawer'], ['floor', 'Crate under the bench'], ['tin', 'Tin on the upper shelf'],
  ]),
};

export const chronology = [
  ['arrival', 'Passengers disembark at the goods shed'],
  ['warning', 'The bridge warning reaches the station'],
  ['diversion', 'Prakash changes the route'],
];

export const arrival = [
  ['Back at Devgarh', 'I’m Anay. The renovation crew arrives on Monday. I’m here to decide what this station gets to keep.'],
  ['A familiar name', 'Mum used to bring me here in the rains. Prakash, the signalman, taught me to recognise a train by its sound.'],
  ['One more look', 'The old report blames him for the last train taking the wrong line. Before I pack it away, I want to know why. The police outpost on the right still has the file.'],
];
