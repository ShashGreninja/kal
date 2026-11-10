import { icon } from './icons.mjs';

export function mountGame(root) {
  root.innerHTML = `
    <main class="game" aria-label="KAL — The Last Train">
      <div class="stage" id="stage" data-mode="title">
        <div class="camera" id="camera">
          <div class="world" id="world">
            <div class="backdrop" id="backdrop"></div>
            <div id="actors"></div>
            <div id="player" class="actor player"></div>
            <button class="exit exit-left" id="left" aria-label="Walk left">${icon('back')}<span></span></button>
            <button class="exit exit-right" id="right" aria-label="Walk right"><span></span>${icon('arrow')}</button>
          </div>
        </div>
        <div class="rain" id="rain" aria-hidden="true"></div>
        <div class="world-shade" aria-hidden="true"></div>
        <div class="hud" id="hud" hidden>
          <div class="location"><span id="year"></span><div><span id="room" aria-live="polite"></span><span id="chapter">A return to Devgarh</span></div></div>
          <div class="hud-actions">
            <button id="journal" class="hud-button" title="Journal (J)">${icon('book')}<span>Journal</span><small id="journal-count"></small></button>
            <button id="fullscreen" class="hud-button icon-button" aria-label="Enter fullscreen" title="Fullscreen">${icon('expand')}</button>
            <button id="pause" class="hud-button icon-button" aria-label="Pause" title="Pause (Escape)">${icon('pause')}</button>
          </div>
        </div>
        <p id="case-question" class="case-question"></p>
        <div class="lower-hud" id="lower-hud" hidden>
          <div class="walk-controls" id="walk-controls"><button id="walk-left" aria-label="Walk left">${icon('back')}</button><button id="walk-right" aria-label="Walk right">${icon('arrow')}</button></div>
          <button class="shift" id="shift" hidden title="Turn the dial (Q)">${icon('time')}<span>Turn the dial<small id="shift-destination">1998</small></span><kbd>Q</kbd></button>
        </div>
        <button class="interact" id="interact" hidden></button>
        <p class="tutorial" id="tutorial" hidden></p>
        <p class="notification" id="notification" role="status"></p>
        <section class="overlay title-screen" id="title-screen" aria-label="Begin the demo">
          <a class="game-home" href="/">${icon('back')} KAL</a>
          <div class="title-content">
            <h1>The Last Train</h1>
            <p>You came back to catalogue a station.<br>One name in the files makes you stay.</p>
            <button id="start" class="primary">Begin a new story ${icon('arrow')}</button>
            <button id="continue" class="quiet" hidden>Continue saved visit</button>
            <p id="saved-visit" class="title-note" hidden></p>
            <p class="title-note">A playable demo · headphones recommended</p>
          </div>
          <span class="title-place">Devgarh, Western Ghats<br>Monsoon, 2028</span>
        </section>
        <section class="overlay intro-screen" id="intro-screen" aria-labelledby="intro-title" hidden>
          <div class="intro-location"><span>Devgarh</span><span>2028</span></div>
          <button id="skip-intro" class="quiet">Skip arrival</button>
          <div class="intro-copy"><div id="intro-progress" class="intro-progress" aria-label="Arrival progress"></div><h2 id="intro-title"></h2><p id="intro-body"></p><button id="intro-next" class="quiet">Continue ${icon('arrow')}</button></div>
        </section>
        <section class="overlay paper-overlay" id="paper-overlay" role="dialog" aria-modal="true" aria-labelledby="paper-title" hidden>
          <div class="paper" id="paper-panel">
            <div class="paper-heading"><p id="paper-context"></p><button id="paper-dismiss" class="quiet icon-button" aria-label="Close inspection">${icon('close')}</button></div>
            <h2 id="paper-title"></h2>
            <div id="paper-illustration" aria-hidden="true"></div>
            <div id="paper-body"></div>
            <p id="paper-feedback" role="status"></p>
            <button id="close-paper" class="quiet">Back to the station ${icon('arrow')}</button>
          </div>
        </section>
        <section class="overlay conversation" id="conversation" role="dialog" aria-modal="true" aria-labelledby="speaker" hidden>
          <div class="portrait" id="portrait"></div>
          <div class="conversation-shade" aria-hidden="true"></div>
          <div class="speaker-bar"><div><h2 id="speaker"></h2><p id="speaker-detail"></p></div><button id="leave" class="hud-button">Step away ${icon('close')}</button></div>
          <div class="dialogue">
            <p id="last-question" class="last-question" hidden></p>
            <p id="response" class="response" lang="hi-Latn" aria-live="polite"></p>
            <form id="question-form">
              <label for="question" class="sr-only">Talk in Hindi, English, or Hinglish</label>
              <input id="question" placeholder="Kuch poochna hai?" maxlength="360" autocomplete="off" required>
              <button type="submit" class="send" aria-label="Ask">${icon('arrow')}</button>
              <button id="record" class="primary" type="button" hidden>Speak</button>
            </form>
            <div class="dialogue-tools">
              <button id="evidence-toggle" class="quiet" aria-expanded="false" aria-controls="evidence-tray">${icon('paper')} Show evidence</button>
              <button id="listen" class="quiet" hidden>${icon('sound')} Listen again</button>
              <span id="voice-status" role="status"></span>
              <span class="conversation-language">Hindi, English, Hinglish</span>
            </div>
            <div id="evidence-tray" class="evidence-tray" hidden><label id="evidence-label" for="offered-clue">From your journal</label><select id="offered-clue" aria-label="Evidence to show"></select><button id="show-clue" class="primary">Present</button></div>
          </div>
        </section>
        <div class="transition" id="transition" aria-hidden="true"></div>
      </div>
    </main>`;
}
