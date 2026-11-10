# KAL demo redesign

## Approved intent

Keep the existing case, twenty scenes, Hinglish voice interviews, Supabase evidence and saves. Improve the first impression, character craft, onboarding, and every interaction without spoiling the case. The player stays in the world. The public page clearly calls this a playable Gnani hackathon demo.

## Visual argument

- Devgarh is worth entering: the station artwork fills the first screen beside the name and a Play demo action.
- Time changes the place: an interactive 1998/2028 view uses the actual aligned game environments.
- Witnesses are people: large portrait compositions and short character-specific lines show the conversations.
- This is a playable demo: practical controls, voice/text options, demo status, and hackathon context are stated honestly.

## Inventory and idea

Devgarh; the Western Ghats; monsoon light; station arches; a last passenger service; 1998 and 2028; Anay's childhood visits; Prakash's watch; Nirmala's kettle; a damaged railway record; Hinglish speech; the pocket instrument.

On this page, Devgarh's two versions of the same platform become a film poster the visitor can turn through time. The live element is the era preview, operable by pointer and keyboard.

Direction: The place carries it, seed 412673451. Keep the existing serif/sans pairing and amber from the lamps. Replace green chrome with neutral charcoal. The direction's full-image composition takes precedence over the conflicting split-menu hero blueprint. No external stock photographs: use the game's own raster illustrations. Avoid a pinned three-screen intro because it delays entry into a playable demo; use a concise story introduction beside its own scene instead.

## Copy deck

- Hero: KAL / The Last Train. A voice-led mystery in a small Indian station, thirty years apart. Play demo.
- Story: Some stories wait. In 2028, Anay returns to Devgarh to catalogue a closed railway station. A familiar name in an old report gives him a reason to stay.
- Era preview: Same place. Another year. Explore Devgarh before and after its last passenger train. What survives can change what you believe.
- Witnesses: Start with a hello. Ask in Hindi, English, or Hinglish. Follow a memory, show a document, or stop for chai. People remember different parts of the same evening.
- Demo: Your visit to Devgarh. A single-player browser demo built for the Gnani hackathon. Voice is optional; the whole investigation works with typed dialogue.

## Implementation plan

1. Vite multi-page build; shared story domain; separate game rendering, services, UI, styles, and landing modules.
2. Conversational intent handling for greetings, wellbeing, thanks, introductions, weather, and everyday topics. Preserve clue gates and reject unrelated requests in character.
3. Full-window stage; corrected aspect-ratio artwork; detailed, distinct vector characters with articulated walking and idle movement.
4. Cinematic arrival, contextual tutorial, diegetic inspection panel, journal/pause HUD, compact conversation controls, gradual camera transitions.
5. Landing page with real artwork, era preview, witness feature, clear demo entry, and accessible mobile composition.
6. Unit checks, production build, full browser playthrough, responsive screenshots, and design inspection. Record remaining limits honestly.

## Progress

- Read PRD and inspected current code and supplied screenshots.
- Preserved original sources under `.work/redesign-before` (no environment secrets).
- Completed the Vite multi-page build and source module boundaries.
- Added multilingual social dialogue for every witness, retaining story gates and Supabase-backed investigation retrieval.
- Replaced the character SVGs with individual clothing, facial details, articulated limbs, and idle motion.
- Corrected raster cropping, removed the outer game frame, and rebuilt the HUD, onboarding, journal, pause, document inspection, and conversation controls.
- Added the demo landing page with an interactive era comparison and real game artwork.
- Production build and six unit tests pass. The complete text-mode case passes in Chrome from onboarding through the exhibit.
- UI browser checks pass for landing links, keyboard era control, intro skip, modal focus, inspection/journal/pause, Hinglish greeting, four responsive portrait sizes, and denied microphone permission. No live provider calls were made by these tests.
- The local server is running on port 3000. Root returns HTTP 200; configured voice, dialogue, and saves report enabled. A synthetic Hinglish wellbeing question was verified through `/api/interview` with speech disabled and no external model call.
- Landing visual inspection passes at 1440, 768, and 390 pixels with zero failures. Final critique and the two defended warnings are in `docs/visual-review.md`.

## Remaining validation before public launch

- Measure first-player completion time against the 20–30 minute target.
- Play a real microphone conversation with Gnani and assess recognition, voice quality, and latency.
- Judge the character art and walking in motion with a human player. The vector art is improved but remains flatter than the environment illustrations.
- Test cloud save/resume across a real returning browser session. This change preserves the existing database integration; the automated tests intentionally do not write player data.

## Constraints

No public duration claim until a timed first-player test. No claim of People's Choice success. Service keys stay on the server. Never send live provider requests during automated browser tests. Keep persistent progress in Supabase; local storage holds only the save identifier and interface preferences.
