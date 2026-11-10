# Visual review

## Before

The user's supplied screenshots are the reliable before record: the game was contained within green bars, portraits were stretched by background sheet sizing, every inspection used a central cream rectangle, and conversation controls filled a large opaque panel. The initial automated before capture failed to load the old assets after source relocation, so its numerical scores are not a valid baseline.

## ROUND 1

Seen in one second: KAL over the rain-soaked Devgarh platform.

Idea (one sentence): Devgarh's two versions of the same platform become a film poster that the visitor can turn through time.

Live thing: keyboard-accessible era comparison using the actual environment sheets.

Layout words by section: hero=full-bleed poster / story=split / eras=panorama / people=paired portraits / demo=questions beside a portrait / footer=full-bleed close.

Scores: design 8.0 · usability 7.5 · creativity 7.5 · content 8.0 → overall 7.8

Caps applied: none on the landing page. This is a self-review, not a user test or award prediction.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `.playtest/title.png`: an inspection dot appears on Anay while the title is open. Hide world affordances outside exploration.
2. `.playtest/witness-mobile.png`: the evidence tray remains open after presenting a clue and competes with the reply. Close it after presentation.
3. `.taste-skill/after/desktop-page-01.jpg`: too many near-identical text sizes. Consolidate the landing page to five typographic roles.

Production inspector at 1440, 768, and 390 pixels: zero failures, three warnings. The warm off-white is inherited from the approved cinematic palette, not a yellow page background. No video is used because the game has no genuine footage; the image drift and interactive era preview provide motion using actual assets. The size warning is being fixed.

## Asset provenance

All raster artwork is existing KAL artwork, reused from `public/art`: the platform era sheet, the station approach and tea stall sheet, the witness sheet, and the stationmaster image. No external photographs, footage, borrowed reviews, or fabricated audience statistics. The new side-view characters and pocket dial are purpose-built SVG drawings, not replacements presented as photographs.

## ROUND 2 — final render

Seen in one second: the station and the KAL title, with a visible Play demo action.

Idea (one sentence): Devgarh's past and present become the visitor's first interaction before entering the mystery.

Live thing: the era comparison works with pointer, Home/End, and arrow keys.

Layout words by section: hero=full-bleed poster / story=split / eras=panorama / people=paired portraits / demo=questions beside a portrait / footer=full-bleed close.

Scores: design 8.0 · usability 8.0 · creativity 7.5 · content 8.0 → overall 7.9

Caps applied: none on the landing page. These are self-review scores, not independent judging.

Top three remaining limitations, each with the screenshot it shows in and the next useful improvement:

1. `.playtest/final-characters.png`: the new vector characters are deliberately flatter than the raster environments. An artist's shared model sheet would unify their rendering further.
2. `.playtest/final-conversation-390.png`: portrait mode needs a close crop. Proportions are preserved and controls fit, but a separately composed vertical portrait would show more of the room.
3. `.taste-skill/after/desktop-fold.jpg`: enlarging the existing environment sheet softens detail. Dedicated high-resolution scene exports would improve large-screen sharpness.

All seven final landing screenshots were opened and reviewed, including full-page contact sheets at 1440, 768, and 390 pixels. Final inspector: **0 FAIL, 2 WARN**. Both warnings are intentional: warm off-white text from the approved art direction, and no video asset. The page uses actual game illustrations with subtle drift and the working comparison instead of unrelated footage. Source style lint: **0 FAIL, 0 WARN**. The only lint exceptions are neutral readability scrims over artwork, allowed by the skill.

Game screenshots reviewed: title, arrival, document inspection, journal, pause, new character silhouettes, ending, and conversations at 1440×900, 768×1024, 390×844, and 844×390. Browser checks confirm unchanged image proportions at all four conversation sizes.
