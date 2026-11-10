# KAL — The Last Train

A 20–30 minute single-player mystery for the Gnani hackathon. Players explore a small Indian railway station across two eras and learn what happened to its last passenger train by interviewing witnesses in Hinglish.

Read this PRD before changing the game. Update it when an agreed product decision changes. Keep implementation details in the README and code.

## Story

In 2028, Anay arrives at Devgarh to inventory the closed station before renovation. He spent childhood monsoons here with his mother and remembers Prakash, the signalman who taught him to tell a passenger train from a goods train by sound. The closure report says Prakash diverted the final service without authority. A pocket instrument in the station lets Anay step into the evening of that service in 1998.

Nirmala remembers who carried the bridge warning. The stationmaster remembers why the warning went unsigned. Desai, the fitter, can explain what he saw underneath the bridge. Prakash will tell Anay why he pulled the lever once Anay can show that he understands the decision. Jadhav’s two accounts give the story a human cost. His younger self is careful about what goes into the duty log. His older self has had thirty years to think about what he left out.

The train was deliberately sent down the goods line to avoid the damaged bridge. The warning was omitted from the official account. Anay preserves the original dispatch in the past and restores Prakash’s name in the renovated station exhibit.

## Playthrough

| Chapter | Target | Experience |
| --- | --- | --- |
| Arrival | 4–5 min | Boarded-up Devgarh, Anay’s memory, the official account, and the first shift to 1998. Teach movement and interaction through play. |
| Two accounts | 7–9 min | Reconcile what the police log, timetable, and witnesses say. Learn who carried the bridge warning and how the train reached safety. |
| The dispatch | 7–10 min | Interpret the track diagram and route markers, establish trust with Prakash, and preserve the original dispatch somewhere it will survive thirty years. |
| The exhibit | 2–4 min | Recover the dispatch, reconstruct the sequence, and see what telling the story correctly means to Jadhav and Anay. |

These are playtest targets. Measure actual playtime with new players before making a public duration claim.

## Player experience

- Ten connected locations in each era for at least twenty explorable scenes. A player moves continuously left or right and leaves through passages at the ends of the walkable path. The station approach leads left to the platform and right to the railway police outpost.
- Use the approved flat cinematic art. Keep the two years aligned at each location. Use believable changes in light, maintenance, signage, and vegetation. Characters should have recognizable silhouettes, natural-looking walk poses, and distinct voices.
- Open with Anay arriving and a brief reason to care. Introduce walking, inspecting, and shifting time as each becomes relevant. Give players time to take in the scene.
- Keep the station as the primary screen. The **heads-up display (HUD)** stays over the game and leaves the world visible. It shows the year, nearby interactions, and access to the journal, sound, and pause. Journal and pause overlays stop movement and return the player to the same spot when closed.
- Shift gently from third person into the player's viewpoint for conversations. Keep witness framing in the game viewport and return to the same spot after speaking.
- Let players interview the stationmaster, Nirmala, Prakash, Desai, Leela, and both versions of Jadhav. Give optional witnesses enough personality and local knowledge to reward curiosity. Let players speak freely in Hinglish or type when needed. A question has up to 20 seconds and a reply stays short. Each character keeps to what they know and what the player has earned. Use short in-character responses when they cannot answer.
- Let players infer the next move from the scene, witness accounts, and documents. Offer an interaction cue only when close to something. Keep optional help in the journal. Route reconstruction, preservation, and the final chronology should depend on evidence the player can find. A wrong answer gives feedback and allows another attempt.
- Use rain and restrained instrumentals. Lower them during conversations. Keep subtitles available and provide a mute control.

## Demo presentation and interaction

- Introduce KAL with a cinematic landing page that clearly calls it a playable demo for the Gnani hackathon. Show the actual station and an interactive preview of its two eras. Do not promise an unmeasured playtime or award outcome.
- The game fills its viewport. Use neutral charcoal around the artwork, warm legible type, and restrained amber controls. Remove green framing bands and oversized rectangular forms.
- Arrival plays as a short, skippable sequence inside the station. Anay introduces himself and why Prakash matters. Teach movement through moving, then introduce inspection, conversations, and the instrument when needed.
- Characters have individual faces, clothing, ages, and silhouettes consistent with their conversation portraits. Walking includes planted feet, bent knees, elbows, weight shifts, and a settling idle pose.
- Conversation artwork always retains its original proportions. Approach the witness with a gentle camera transition. Keep faces visible above compact subtitles and a quiet voice/text input. Evidence presentation appears only when the player chooses it.
- Witnesses answer greetings, wellbeing, thanks, introductions, weather, and everyday Hindi, English, and Hinglish questions naturally in their own voices. Social exchanges never award evidence or bypass story gates. Unrelated requests stay in character.
- Keep recording limits internal. Show friendly states such as Listening or Thinking, without technical time-limit labels.
- Inspection feels like looking at an object in its environment. Use unobtrusive side annotations for observations, a readable document treatment for records, and appropriate layouts for route puzzles and the exhibit. Journal and pause stay inside the HUD, pause movement, and restore focus on closing.

## Hackathon acceptance

- The public Gnani hackathon demo shows onboarding, a natural walk, an era switch, a real Hinglish witness exchange, and a visible consequence in the future without spoiling the ending.
- All twenty scenes are reachable, passages are consistent between years, and opening a HUD overlay does not move the player.
- The case can be completed by combining witness accounts and physical evidence. An early or unrelated question cannot reveal the decisive clue.
- A fresh playtest measures the complete experience against the 20–30 minute target. Returning to the game restores the investigation when saves are enabled.

## Clarity and conversation revision

- Begin a new story always opens the arrival sequence with an empty journal. Continuing is a separate, clearly labelled choice showing the saved year and journal entry count. Starting over never imports evidence from an older visit.
- The arrival explains Anay's job, his memory of Prakash, and the question behind the visit. A quiet HUD question follows the investigation; the notebook offers a west-to-east station guide and optional concrete hints. The timetable is in the ticket hall.
- Every valid witness question goes to the language model when connected, including greetings, casual questions, evidence presentation and follow-ups. Characters can improvise ordinary preferences, reactions and routines. They remember the current conversation and respond to meaning rather than requiring specific words.
- Witnesses know only their era and the case facts available to them. Undiscovered decisive testimony remains protected, and casual conversation does not grant evidence. Authored dialogue is a service-outage fallback, not the normal conversation route.
- The English-language landing page separates reading from cinematic artwork. The station stays beside the opening story; the two-era comparison is interactive. It clearly identifies the Gnani hackathon demo.

## Sound, movement, and tactile interaction

- Holding Shift while moving makes Anay walk 2.1 times normal walking speed; releasing Shift restores walking speed. Menus and conversations stop movement. Walking stays upright with restrained knee lift, and nearby interaction prompts do not cover the legs.
- The arrival has a quiet original musical phrase beneath the rain. Turning the pocket instrument plays a short bell-like time-shift cue. New journal discoveries have a small confirmation sound. The sound control governs ambience and automatic witness playback.
- When a conversation opens, the witness speaks the first subtitle through Gnani. Asking a question or leaving cancels any pending opening line. Voice failure never blocks the text conversation. Hindi speech uses Devanagari pronunciation text while subtitles remain readable Hinglish.
- The game HUD uses a coherent field-notebook and railway-pass treatment. The scene remains visible around the intro, conversation, journal and pause surfaces. Buttons have balanced padding and centred labels.
- The landing page uses staggered illustrated memories and station-arch silhouettes with English copy and an interactive two-era view. It keeps the demo action clear and uses real game imagery, not repeated marketing blocks.

## Mocha visual revision

Use warm mocha and espresso surfaces throughout the landing page and game overlays, with cream lettering and brass actions. Do not use white or pale paper backgrounds. The landing opens as a game title composition with a broad view of Devgarh; the artwork and reading surfaces remain separate.

Spoken questions appear in the input for review before sending. A microphone level indicator confirms capture; players can correct a misheard word without restarting the conversation.

## The first turn of the dial

The instrument belonged to Prakash: his name is scratched inside its lid. Anay remembers it as a watch. Its first use pauses exploration for a skippable four-beat scene: surprise at the living station, noticing 1998 on the instrument, testing a return to 2028, and deliberately going back to find Prakash. It establishes the dial’s rules without explaining away the mystery. Completion is remembered per saved visit; subsequent shifts remain quick. Rain and music keep a steady quiet level through speaking, listening and exploration rather than pumping between them.

Spoken replies retain Hinglish subtitles while sending phonetic Devanagari, including English loanwords and proper names, to the Hindi voice. Voice quality remains subject to listening review. The landing uses a dark, character-led composition inspired by the supplied jjettas reference, using KAL artwork and its own story.

## Microphone capture

Players can choose an available microphone, toggle background-noise filtering, and listen to their own last recording locally before retrying. Quiet speech receives a bounded boost; silence prompts an input check rather than a misleading transcript. Recognition remains editable before submission. Recording previews are released when leaving the conversation and are not added to the save.
