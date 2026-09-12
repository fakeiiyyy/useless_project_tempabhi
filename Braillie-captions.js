// Braillie-captions.js
// Grade-1 (uncontracted) Braille overlay for YouTube captions.
// Scope: this is a JOKE accessibility project, not real a11y tooling.

(() => {
  const BRAILLE_MAP = {
    a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓',
    i: '⠊', j: '⠚', k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏',
    q: '⠟', r: '⠗', s: '⠎', t: '⠞', u: '⠥', v: '⠧', w: '⠺', x: '⠭',
    y: '⠽', z: '⠵',
    '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', "'": '⠄', '-': '⠤',
    '0': '⠼⠚', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙',
    '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊',
    ' ': ' '
  };

  function toBraille(text) {
    return text
      .toLowerCase()
      .split('')
      .map(ch => BRAILLE_MAP[ch] ?? ch) // unknown chars pass through unchanged
      .join('');
  }

  // Poll for the caption container instead of assuming it's there at load —
  // it doesn't exist until the user turns captions on.
  function waitForCaptionContainer(callback) {
    const existing = document.querySelector('.ytp-caption-window-container');
    if (existing) return callback(existing);

    const bodyObserver = new MutationObserver(() => {
      const container = document.querySelector('.ytp-caption-window-container');
      if (container) {
        bodyObserver.disconnect();
        callback(container);
      }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  function hideNativeCaptions(captionContainer) {
    captionContainer.style.opacity = '0';
    captionContainer.style.pointerEvents = 'none';
  }

  function setupBrailleOverlay(captionContainer) {
  const overlay = document.createElement('div');
  overlay.id = 'braillie-overlay';

  let darkMode = true; // default: current look (dark bg, white text)

  function applyTheme() {
    overlay.style.background = darkMode ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)';
    overlay.style.color = darkMode ? '#fff' : '#000';
  }

  Object.assign(overlay.style, {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '28px',
    padding: '4px 12px',
    borderRadius: '4px',
    zIndex: 9999,
    pointerEvents: 'none',
    whiteSpace: 'pre-wrap',
    maxWidth: '80%',
    textAlign: 'center',
    minHeight: '2.4em',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  });

  applyTheme(); // set initial colors — don't rely on defaults matching your intent

  const player = document.querySelector('#movie_player') || document.body;
  player.style.position = 'relative';
  player.appendChild(overlay);

    const captionObserver = new MutationObserver(() => {
     const segments = captionContainer.querySelectorAll('.ytp-caption-segment');
     const text = Array.from(segments).map(s => s.textContent).join(' ').trim();
     overlay.textContent = text ? toBraille(text) : '';
     window.queueMorse(text);
    });

    captionObserver.observe(captionContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });

    document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'b' && e.altKey) {
      darkMode = !darkMode;
      applyTheme();
    }
  });

  document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'm' && e.altKey) {
    window.toggleMorseMode();
  }
});

    hideNativeCaptions(captionContainer);

  }

  function initBraillieCaptions() {
  waitForCaptionContainer(setupBrailleOverlay);
}

  function runFirstTimeGate() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    Object.assign(modal.style, {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.95)', color: '#fff', zIndex: 999999,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontSize: '24px', textAlign: 'center', gap: '20px'
    });

    const timerEl = document.createElement('div');
    Object.assign(timerEl.style, {
      position: 'fixed', bottom: '16px', right: '16px',
      fontSize: '16px', color: '#aaa'
    });

    document.body.appendChild(modal);
    document.body.appendChild(timerEl);

    let interval; // single reference — always clear before starting a new one

    function showStepA() {
      clearInterval(interval);
      modal.innerHTML = `<p>⠉⠁⠝ ⠽⠕⠥ ⠎⠑⠑⠦</p><button id="braillie-no">No</button>`;
      const noBtn = document.getElementById('braillie-no');

      let t = 7;
      timerEl.textContent = t;
      interval = setInterval(() => {
        t--;
        timerEl.textContent = t;
        if (t <= 0) {
          clearInterval(interval);
          cleanup();
          resolve();
        }
      }, 1000);

      noBtn.onclick = () => {
        clearInterval(interval); // stop A's timer immediately — prevents double-resolve race
        showStepB();
      };
    }

    function showStepB() {
      clearInterval(interval);
      modal.innerHTML = `<p>Pinne nee enghanada kuthiye?</p>`;

      let t = 5;
      timerEl.textContent = `Retry: ${t}`;
      interval = setInterval(() => {
        t--;
        timerEl.textContent = `Retry: ${t}`;
        if (t <= 0) {
          clearInterval(interval);
          showStepA(); // loop back
        }
      }, 1000);
    }

    function cleanup() {
      modal.remove();
      timerEl.remove();
    }

    showStepA();
  });
}

(async () => {
  const stored = await browser.storage.local.get('braillieOnboarded');

  if (stored.braillieOnboarded !== true) {
    await runFirstTimeGate();
    await browser.storage.local.set({ braillieOnboarded: true });
  }

  initBraillieCaptions()
})();
})();