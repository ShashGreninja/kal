# KAL: The Last Train

In 2028, Anay returns to a closed railway station in the Western Ghats. The official record blames a signalman for diverting the last passenger train. A brass dial takes Anay back to the same platform in 1998, when the witnesses were still there and the warning was still fresh.

KAL is a browser mystery built for the Gnani hackathon. Ask witnesses questions in Hindi, English or Hinglish, show them evidence, and work out what the railway left out of its report.

## Basic architecture

We built KAL as a browser game with a Vite frontend and a Node.js backend. When you speak to a witness, Gnani Prisma transcribes your question so you can review it before sending. The backend pulls the facts that witness can share from Supabase, based on the year and the evidence you’ve found, then passes them to the language model. Gnani Timbre reads the reply aloud. The game’s own rules decide whether the reply unlocks a clue, and Supabase saves your progress.

[Play the hosted demo](https://kal-the-last-train.onrender.com/) · [One-page submission pitch](PITCH.md)

## Run it locally

Install Node.js 24 and clone the repository.

```sh
git clone https://github.com/ShashGreninja/kal.git
cd kal
npm ci
npm run build
npm start
```

Open [localhost:3000](http://localhost:3000). The full case is playable with typed questions and no API keys. Walk with A/D or the arrow keys, hold Shift to run, and press E to inspect or talk. Q turns the dial once you find it, J opens the journal, and Escape pauses. You can also use the on-screen controls.

For development, keep the API running with `npm start`, then run `npm run dev` in another terminal and open [localhost:5173](http://localhost:5173). Vite forwards API calls to port 3000. Rebuild when you want the production server to pick up frontend edits.

## Turn on voice, live dialogue and saves

Copy [.env.example](.env.example) to `.env` in the project root. Restart the server after editing it.

| Variables | What they enable |
| --- | --- |
| `GNANI_API_KEY` | Prisma transcribes player audio and Timbre speaks witness replies. You can review and edit a transcript before sending it. |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Saved investigations and case facts. Run [db/setup.sql](db/setup.sql) in your Supabase SQL editor first. |
| `DIALOGUE_BASE_URL`, `DIALOGUE_API_KEY`, `DIALOGUE_MODEL` | Live witness dialogue using an OpenAI-compatible endpoint. Include the version prefix, usually `/v1`, in the base URL. This also requires Supabase. |

Keep these settings on the server. The browser sends recorded audio to the game's API for transcription. A deployed build needs HTTPS for microphone access. If live dialogue is unavailable, the game uses authored replies so the case can still be solved.

Witnesses get different facts depending on their role, the year, and the evidence you've found. The model can phrase the answer, while the game's rules decide what can enter the journal.

## Deploy

Use [a Render Node web service](https://render.com/docs/web-services) with this repository as its source, or import the included [Blueprint](render.yaml). The build command is `npm ci --include=dev && npm run build` and the start command is `npm start`. Use Node 24, set `HOST=0.0.0.0`, and let the host supply `PORT`. Add the service variables above in the host dashboard for the voice build. Check `/api/capabilities` for `voice`, `dialogue`, and `saves`, then try a real question in-game.

## Verify the build

- `npm test` checks clue gates, dialogue routing, saves, and audio encoding.
- `npm run test:play` runs the case from arrival to the exhibit without calling live providers.
- `npm run test:ui` checks the landing page and game controls across viewport sizes.
- `node scripts/voice-smoke.mjs` checks browser recording and transcript review with synthetic audio.

Build before running the browser scripts. They use an installed Chrome and separate local ports. Set `KAL_CHROME` to the Chrome executable if the default Windows path doesn't apply.

The case rules live in `src/shared/`, the browser game in `src/game/`, and provider calls in `server/`.
