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
    captionContainer.style.display = 'none';
  }

  function setupBrailleOverlay(captionContainer) {
    // Our own overlay, separate from YouTube's caption box, so we don't
    // fight with their re-renders.
    const overlay = document.createElement('div');
    overlay.id = 'braillie-overlay';
    Object.assign(overlay.style, {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.75)',
    color: '#fff',
    fontSize: '28px',
    padding: '4px 12px',
    borderRadius: '4px',
    zIndex: 9999,
    pointerEvents: 'none',
    whiteSpace: 'pre-wrap',
    maxWidth: '80%',
    textAlign: 'center',
    minHeight: '2.4',        // reserve space for ~2 lines regardless of content
    display: 'flex',
    alignItems: 'flex-end',    // text sits at the bottom of that reserved space
    justifyContent: 'center'
  });

    const player = document.querySelector('#movie_player') || document.body;
    player.appendChild(overlay);

    const captionObserver = new MutationObserver(() => {
      const segments = document.querySelectorAll('.ytp-caption-segment');
      const text = Array.from(segments).map(s => s.textContent).join(' ').trim();
      overlay.textContent = text ? toBraille(text) : '';
    });

    captionObserver.observe(captionContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });

    hideNativeCaptions(captionContainer);

  }

  waitForCaptionContainer(setupBrailleOverlay);
})();