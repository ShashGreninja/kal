import { smallTalk } from './small-talk.mjs';
import { witnessNudges, storyQuestion } from './witness-context.mjs';

const entry = (title, body) => ({ title, body });

export const evidence = {
  'arrival-note': entry('Inventory note', 'Anay, start with the police outpost on your right. They kept the closure papers. Then see what can be saved on the platform.'),
  report: entry('Closure report', 'The 19:05 passenger service was diverted without authority. Responsibility was assigned to signalman Prakash. The file contains no bridge warning.'),
  'police-log': entry('Duty log', '18:42. A runner from Nirmala’s tea stall brought a message to the station. The message was left with the stationmaster.'),
  'retired-testimony': entry('Jadhav’s correction', 'The runner was Nirmala’s nephew. Jadhav wrote down when he came in. In the official account he left out the message, because he had not seen its contents.'),
  'tea-testimony': entry('Nirmala’s account', 'Desai saw the bridge move in the rain. I sent my nephew with his warning before the last train was due.'),
  timetable: entry('Platform timetable', '19:05 was the last passenger service. The goods siding was reserved that evening, with no scheduled traffic after 18:30.'),
  'office-testimony': entry('Stationmaster’s account', 'He received the warning at 18:42 and waited for it to be signed. The last train was already approaching. The signalman acted before a signed order came through.'),
  'archive-compare': entry('The missing entry', 'The official report omitted a warning that arrived before the diversion. The duty log and Kulkarni’s account independently place it at 18:42.'),
  'desai-testimony': entry('Desai’s field note', 'The pier shifted under the bridge. Desai marked it in chalk and sent a written warning to Devgarh.'),
  'leela-testimony': entry('Leela’s survey', 'Leela recovered legible paper from a tin on an upper shelf. The lower drawers had filled with river water.'),
  'bridge-survey': entry('Desai’s survey mark', 'Fresh chalk crosses a shift in the stonework. On the attached slip: Main bridge unsafe. Reported 18:42.'),
  'goods-route': entry('Siding plate', 'The yellow triangle marks the goods siding. The straight white mark leads to the bridge. The siding ends at the loading platform.'),
  'signal-testimony': entry('Prakash’s account', 'He chose the goods siding because it avoided the bridge and was clear that evening. At 19:13 he recorded the passengers safe at the loading platform.'),
  dispatch: entry('Carbon copy', '18:42 — bridge warning received. 19:05 — diverted onto goods siding. 19:13 — passengers safely unloaded. Signed P. Naik.'),
  original: entry('Original dispatch', 'The carbon copy survived in the tin. Its three entries document a warning, a deliberate diversion, and the safe arrival at the shed.'),
  'high-water': entry('High-water line', 'The river reached the pale band on the masonry. A new embankment now carries the road farther uphill.'),
  'shed-plate': entry('Loading platform', 'A low step runs the length of the loading deck. The coach doors would have opened directly onto it.'),
  'damaged-desk': entry('Water-damaged desk', 'The drawer lining has turned to pulp. A tin on the high shelf is the only container that looks dry.'),
  'damage-map': entry('Renovation survey', 'Floor-level cabinets and paper drawers were flooded. The upper shelves remained dry.'),
  register: entry('Index register', 'Carbon copies are retained in the signal cabin. The office sends signed originals up the line at the end of each shift.'),
  'office-photo': entry('Staff photograph', 'Anay recognizes Prakash by the watch he used to time trains. He is standing at the edge of the group, holding somebody else’s umbrella.'),
  'ticket-stub': entry('A ticket never clipped', 'Devgarh to the next station. The cardboard is still stiff. Anay remembers his mother keeping tickets like this inside a book.'),
  'tea-cups': entry('Two enamel cups', 'One has a chipped rim. Anay used to insist on the one with the chip because it cooled faster.'),
  'platform-clock': entry('Platform clock', 'Five minutes slow. Nirmala used to tell customers it ran on railway time, which was its own kind of time.'),
  lantern: entry('Entry lantern', 'Someone moved it under the arch to keep the rain out. There is another lantern burning at the police outpost.'),
};

const witness = (name, detail, greeting, everyday, topics, portrait, clue) =>
  ({ name, detail, greeting, everyday, topics, portrait, clue });

export const people = {
  stationmaster: witness('Mr Kulkarni', 'Stationmaster · 1998',
    'Ji, baithiye. Train ke baare mein poochna hai?', 'Register yahin rehta hai. Aaj har entry ka waqt likh raha hoon.', /18|warning|bridge|report|pul|चेतावनी|पुल|रिपोर्ट/i, 'stationmaster', 'office-testimony'),
  nirmala: witness('Nirmala', 'Tea stall owner · 1998',
    'Chai loge? Baarish kam hone wali toh lagti nahi.', 'Roz aakhri train tak rukti hoon. Uske baad ketli bandh.', /18|runner|warning|nephew|bridge|message|ladk|चेतावनी|संदेश|पुल/i, 0, 'tea-testimony'),
  prakash: witness('Prakash Naik', 'Signalman · 1998',
    'Track pe mat jaiye. Idhar se baat kar sakte hain.', 'Mera beta sochta hai ye ghadi mujhe railway ne di. Maine khud khareedi thi.', /siding|bridge|route|signal|lever|goods|bridge|pul|पुल|सिग्नल|लाइन/i, 1, 'signal-testimony'),
  jadhav: witness('Constable Jadhav', 'Railway police · 1998',
    'Naam likhwa dijiye. Duty log yahin hai.', 'Jo dekha hai woh likhta hoon. Jo suna hai uske aage naam bhi likhna padta hai.', /log|train|report|warning|dispatch|लॉग|रिपोर्ट|ट्रेन/i, 2),
  retired: witness('Jadhav', 'Retired constable · 2028',
    'Renovation ke liye aaye ho? Main pehle yahan duty karta tha.', 'Prakash jab bhi chhutti leta tha, sabko lagta tha ghadi ruk gayi. Waqt ka bada pakka tha.', /log|report|warning|runner|message|18:42|लॉग|रिपोर्ट|चेतावनी/i, 3, 'retired-testimony'),
  desai: witness('Desai', 'Bridge fitter · 1998',
    'Joote dekho mere. Paani ghutne tak aa gaya hai.', 'Jo chai Nirmala banati hai, uske liye do station door se log aate hain.', /bridge|survey|stone|warning|pul|पुल|चेतावनी/i, 4, 'desai-testimony'),
  leela: witness('Leela', 'Renovation crew · 2028',
    'Renovation crew se ho? Khidki ke paas dhyaan se, lakdi kamzor hai.', 'Jin cheezon ka record mil jaaye, unhe hum display mein rakh sakte hain.', /archive|shelf|damage|paper|rain|tin|कागज़|बारिश/i, 5, 'leela-testimony'),
};

const guardedLines = {
  'tea-testimony': 'Desai ne pul hilte dekha. Saadhe chhe ke baad mere bhatije ko warning le kar bheja tha. Log mein waqt likha hoga.',
  'office-testimony': 'Warning aayi thi. Main signed order ka wait kar raha tha. Prakash ke paas wait karne ka waqt nahi tha.',
  'signal-testimony': 'Pul ki taraf bhejna theek nahi tha. Train ko us line pe bheja jahan samaan utarta hai. Dispatch ki copy drawer mein hai.',
  'retired-testimony': 'Haan, Nirmala ka bhatija tha. Waqt maine likha, message nahi padha. Final report mein sirf lever badalne ki baat reh gayi.',
  'desai-testimony': 'Beech wale pier ka patthar hila tha. Neeche chalk se nishaan lagaya. Warning maine Nirmala ko di thi.',
  'leela-testimony': 'Neeche ke drawers sab bheeg gaye. Upar ke shelf par tin ka dabba mila tha. Uske andar kagaz sookhe the.',
};

const relevantEvidence = {
  retired: ['report', 'police-log'],
  nirmala: ['police-log'],
  stationmaster: ['tea-testimony', 'timetable'],
  prakash: ['archive-compare', 'office-testimony', 'bridge-survey', 'goods-route'],
  desai: ['tea-testimony'],
  leela: ['damaged-desk', 'damage-map'],
};

export function replyToQuestion(id, question, game, available, offeredClue = '') {
  const person = people[id];
  if (offeredClue && (!game.clues.includes(offeredClue) || !relevantEvidence[id]?.includes(offeredClue))) {
    return { text: 'Yeh dekha hai. Iska us raat ki entry se kya taalluq hai?' };
  }
  if (person.clue && (offeredClue || person.topics.test(question))) {
    if (available.includes(person.clue)) return { text: guardedLines[person.clue], reveal: person.clue };
    return { text: witnessNudges[id] };
  }
  const social = smallTalk(id, question);
  if (social) return { text: social, kind: 'social' };
  if (storyQuestion.test(question)) return { text: witnessNudges[id] };
  if (person.topics.test(question) || /prakash|aap|naam|devgarh|duty|station|chai|baarish|स्टेशन|बारिश/i.test(question)) {
    return { text: person.everyday };
  }
  return { text: 'Is baare mein mujhe pata nahi. Station ke baare mein poochhiye.' };
}
