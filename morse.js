const MORSE_MAP = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.',
  h: '....', i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.',
  o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-', u: '..-',
  v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': '/'
};

let morseMode = false;
let audioCtx = null;
let morseQueue = Promise.resolve(); // chain, so sequences never overlap
let lastSpokenText = '';

function beep(durationMs) {
  return new Promise((resolve) => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 600;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      resolve();
    }, durationMs);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playMorseForText(text) {
  const UNIT = 20; // ms — tune this, not the logic, if timing feels off
  for (const ch of text.toLowerCase()) {
    const code = MORSE_MAP[ch];
    if (!code) continue;
    if (code === '/') {
      await wait(UNIT * 7);
      continue;
    }
    for (const symbol of code) {
      await beep(symbol === '.' ? UNIT : UNIT * 3);
      await wait(UNIT);
    }
    await wait(UNIT * 3);
  }
}

function queueMorse(newText) {
  if (!morseMode || newText === lastSpokenText) return;
  const delta = newText.startsWith(lastSpokenText)
    ? newText.slice(lastSpokenText.length).trim() // only speak the new part
    : newText; // caption reset/changed entirely — speak all of it
  lastSpokenText = newText;
  if (!delta) return;
  morseQueue = morseQueue.then(() => playMorseForText(delta));
}

function toggleMorseMode() {
    morseMode = !morseMode;
  }

  // Expose only the two things the other file needs — not internals.
  window.queueMorse = queueMorse;
  window.toggleMorseMode = toggleMorseMode;