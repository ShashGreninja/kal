# Experience revision

The user rejected the previous split-screen marketing composition. The new page is a collection of memories from Devgarh: unevenly sized prints, arches drawn from the station entrance, actual portraits, and a direct demo action.

Inventory: Devgarh's archway, tiled roofs, monsoon, 1998 and 2028, the last service, Prakash's watch, Jadhav's duty log, Nirmala's stall, Anay's notebook, a preserved carbon copy.
Argument: enter a playable mystery (actual scene and demo link); care about a familiar name (Anay's memory versus the file); compare time (live era slider); talk to people (three portraits and their perspectives); understand how to play (complete FAQ); return to the station (clear final action).

Direction: Photographs at uneven sizes, seed 836009717. The station's two eras become a collection of memories laid out at different sizes. The live thing is the two-era comparison. Two prints form the hero, with title and supporting copy placed together above them so the action stays on the first screen. The pinned text/photo intro was replaced because the user explicitly rejected text over images. The FAQ has six real questions, not sample marketing claims.

Tokens: mist #e8e7df, paper #d8dcd6, railway ink #20343b, slate #4c6367, petrol #245c63, white #ffffff. This maps the dealt palette proportions to the station's cool monsoon materials; green/chocolate would repeat the rejected green framing. Young Serif display with Source Serif 4 body, locally hosted with OFL licenses. Game UI retains its readable system body face; no new dashboard conventions imposed on a game.

Layout comparison:
Rejected: [fixed image | solid block of copy] repeated down the page.
Chosen: [large title | short invitation], then [small past print / wide present print], followed by differently sized scene and portrait groups. Equal outer margins; text always on a reading surface.

Plan review: a generic railway landing could use a train photograph and travel slogan. This page instead shows the same fictional station before and after its closure, the three people involved in its record, and a real comparison mechanic. Station arches shape media instead of adding decorative blobs. No external stock imagery or invented proof. Existing game assets are reused.

Game surfaces: a pocket notebook for arrival and records; a compact dark conversation bench; a legible pause folio; quiet location and current-question HUD. Automatic motion is restrained; interaction, audio, movement and discoveries carry feedback.

Speech reference: [Gnani voice catalogue](https://docs.gnani.ai/api/TTS/available-voices). Existing Timbre v2.5 voices are Hindi-preferred and retain hi-IN. Hindi portions of generated speech get Devanagari text; English words remain English. This addresses Roman-script ambiguity, but pronunciation quality still needs listening tests.

## Final user-directed revision

Mocha replaces the pale palette across the game and landing. The hero now gives the station a single broad frame before a solid title marquee; overlapping small prints were rejected. The title, demo CTA, comparison, portraits and FAQ retain working destinations. User preference overrides the earlier dealt palette and uneven-print composition. Motion is deliberately restrained to the initial title and direct feedback, rather than the inspector’s requested entrance on every section.

Microphone path: synthetic Hindi speech through Gnani TTS and Prisma STT correctly returned the test question, including Prakash. This does not verify the user’s physical microphone. Added capture processing, a live level meter, and editable recognition before sending. No user recording was collected.

Validation: 13 unit tests and production build pass. Full case browser playthrough reached the exhibit. Responsive UI smoke passed at four game sizes; sprint regression measured 2.10x and verified release/pause behavior. Browser recording test uses a synthetic MediaStream, real MediaRecorder and WAV conversion, with a stubbed transcript; review-before-send and meter cleanup pass. Separate live Gnani synthesis/transcription recovered the Hindi test question; the live opening endpoint returned 291884 bytes of audio. These tests do not establish real-player pacing or physical microphone quality.

Visual review: mocha surfaces replace all pale reading panels; the selected journal entry is visibly distinct and close controls now have sufficient contrast. The broad station hero gives the artwork priority. The inspector flagged restrained motion and absence of video; retained intentionally under frontend-design guidance. Its tablet heading wrap and mobile small text were corrected. The title clipping report was not visible in the reviewed fold screenshot; it remains a scroll-sampling review limitation.

## Character-led reference revision

Reference: https://jjettas.com/ (viewed live in Chrome, desktop hero and scroll). Take the dominant portrait, small peripheral story details, and confident scale; do not reuse its branding, sports assets or pale texture. KAL uses Anay’s existing illustrated portrait, a 1998 platform vignette and dark mocha surfaces. The artwork is a supplied game asset, not a new photograph. Direction: The name as a monument, seed 424358506; hero geometry adjusted for the explicit character-led reference. On this page Anay’s return becomes the portrait-led invitation; the two-era comparison remains the live interaction.

ROUND 2 — character-led landing
Seen in one second: Anay returning to an old Indian railway station.
Idea (one sentence): Anay's return becomes the portrait-led invitation to revisit Devgarh.
Live thing: keyboard- and touch-operable comparison between 1998 and 2028.
Layout words by section: hero=portrait with peripheral story / story=colour field and scene / eras=wide comparison / people=unequal portraits / visit=questions / footer=large name.
Scores: design 7 · usability 8 · creativity 7 · content 8 → overall 7.3.
Caps applied: repeated entrance motion limits design to 7; this is a basic reference-inspired adaptation, not the reference's bespoke 3D production.
Top three problems, each with screenshot and fix:
1. Tablet hero headline wrapped to three lines (character-final/tablet-fold.jpg); shortened to One last evening.
2. Entrances did not persist for measurement (character-final report); retained completed Web Animations, with reduced-motion bypass.
3. Mobile type scale remains more varied than ideal (character-verified/mobile-page-01.jpg); retained readable role sizes, documented rather than claiming perfect consistency.
Final inspector: zero FAIL at 1440, 768 and 390. Warnings: warm lettering on the requested mocha palette; no authentic video asset; mobile type-size count; name-only detector despite the visible time-travel mystery description. No borrowed imagery, fabricated testimonials or sample claims. Existing game raster art supplies the portrait and station scenes.

Final gameplay verification: 15 unit tests pass, production build passes, responsive UI smoke passes, full-case Chrome playthrough completes the first-shift sequence (1998, return to 2028, deliberate return to 1998) and reaches the exhibit. Live dialogue check returned source=llm, phonetic Devanagari speechText and 798764 bytes of Gnani audio. Actual pronunciation still needs human listening; no claim of perfect synthesis. Background gain no longer changes on conversation state.
Additional skip/persistence/mobile cutscene browser regression was blocked before execution by automatic approval review because of account usage limits. This is an unverified check, not a passing result.

Microphone revision: explicit input selection persisted locally, selectable noise suppression, echo cancellation, 128 kbps supported recorder codec, bounded quiet-speech gain, DC removal, strongest-channel selection, and local WAV playback. Silent input is reported before transcription. Build and 18 unit tests pass; synthetic browser capture and WAV conversion pass. Physical microphone quality is not verified by these tests.
