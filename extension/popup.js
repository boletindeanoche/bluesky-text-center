const BRAILLE_SPACE = '\u2800'; // U+2800 invisible braille blank

// Create off-screen canvas to measure exact pixel widths with Bluesky font metrics
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function getTextWidth(text) {
  return ctx.measureText(text).width;
}

// Measured width of 1 braille space in px (typically 10.0px)
const BRAILLE_PX = ctx.measureText(BRAILLE_SPACE).width || 10.0;

const config = {
  linesTop: 2,
  linesBottom: 2,
  mode: 'mobile', // 'mobile' (320px) | 'pc' (520px) | 'block'
  nudge: 0,
  style: 'normal'
};

const unicodeMaps = {
  mono: {
    base: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    target: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
  },
  bold: {
    base: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    target: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝙴𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝙼𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
  },
  italic: {
    base: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    target: '𝘢𝘣𝘤𝘥𝚎𝚏𝚐𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝚙𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝗤𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡'
  }
};

function convertChars(text, style) {
  if (style === 'normal' || !unicodeMaps[style]) return text;
  const map = unicodeMaps[style];
  const baseChars = Array.from(map.base);
  const targetChars = Array.from(map.target);
  const dict = {};
  baseChars.forEach((c, i) => dict[c] = targetChars[i]);

  return Array.from(text).map(ch => dict[ch] || ch).join('');
}

function generateFormattedText() {
  const rawInput = document.getElementById('inputText').value;
  if (!rawInput.trim()) return '';

  const lines = rawInput.split('\n');
  const styledLines = lines.map(line => convertChars(line, config.style));

  let formattedLines = [];

  // Mode is 'mobile' (~320px) or 'pc' (~520px)
  const targetPx = config.mode === 'pc' ? 520 : 320;
  formattedLines = styledLines.map(l => {
    if (!l.trim()) return '';
    const linePx = getTextWidth(l);
    const diffPx = Math.max(0, (targetPx - linePx) / 2);
    const count = Math.max(0, Math.round(diffPx / BRAILLE_PX) + config.nudge);
    return BRAILLE_SPACE.repeat(count) + l;
  });

  // 1 braille space per blank line protects the newline from being stripped
  const topPadding = config.linesTop > 0 ? (BRAILLE_SPACE + '\n').repeat(config.linesTop) : '';
  const bottomPadding = config.linesBottom > 0 ? ('\n' + BRAILLE_SPACE).repeat(config.linesBottom) : '';

  return topPadding + formattedLines.join('\n') + bottomPadding;
}

function render() {
  const formatted = generateFormattedText();
  const preview = document.getElementById('previewText');
  
  if (!formatted) {
    preview.textContent = '(Escribe arriba para ver la vista previa centrada)';
    preview.className = 'post-body empty';
  } else {
    preview.textContent = formatted;
    preview.className = 'post-body';
  }

  const count = Array.from(formatted).length;
  const countElem = document.getElementById('charCount');
  const badge = document.getElementById('charBadge');
  countElem.textContent = count;

  if (count > 300) {
    badge.className = 'char-badge error';
  } else if (count > 260) {
    badge.className = 'char-badge warn';
  } else {
    badge.className = 'char-badge';
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputText');
  input.addEventListener('input', render);

  // Steppers vertical
  document.getElementById('btnTopMinus').addEventListener('click', () => {
    config.linesTop = Math.max(0, config.linesTop - 1);
    document.getElementById('linesTopVal').textContent = config.linesTop;
    render();
  });
  document.getElementById('btnTopPlus').addEventListener('click', () => {
    config.linesTop = Math.min(8, config.linesTop + 1);
    document.getElementById('linesTopVal').textContent = config.linesTop;
    render();
  });

  document.getElementById('btnBottomMinus').addEventListener('click', () => {
    config.linesBottom = Math.max(0, config.linesBottom - 1);
    document.getElementById('linesBottomVal').textContent = config.linesBottom;
    render();
  });
  document.getElementById('btnBottomPlus').addEventListener('click', () => {
    config.linesBottom = Math.min(8, config.linesBottom + 1);
    document.getElementById('linesBottomVal').textContent = config.linesBottom;
    render();
  });

  // Mode buttons (Mobile, PC)
  const modeBtns = {
    mobile: document.getElementById('btnAlignMobile'),
    pc: document.getElementById('btnAlignPC')
  };

  const indicator = document.getElementById('targetIndicator');

  Object.entries(modeBtns).forEach(([m, btn]) => {
    btn.addEventListener('click', () => {
      config.mode = m;
      Object.values(modeBtns).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      indicator.textContent = m === 'mobile' ? 'Móvil' : 'PC';
      render();
    });
  });

  // Nudge stepper (- / + spaces)
  document.getElementById('btnNudgeMinus').addEventListener('click', () => {
    config.nudge = Math.max(-10, config.nudge - 1);
    document.getElementById('nudgeVal').textContent = config.nudge > 0 ? `+${config.nudge}` : config.nudge;
    render();
  });
  document.getElementById('btnNudgePlus').addEventListener('click', () => {
    config.nudge = Math.min(15, config.nudge + 1);
    document.getElementById('nudgeVal').textContent = config.nudge > 0 ? `+${config.nudge}` : config.nudge;
    render();
  });

  // Styles
  const styleBtns = {
    normal: document.getElementById('styleNormal'),
    mono: document.getElementById('styleMono'),
    bold: document.getElementById('styleBold'),
    italic: document.getElementById('styleItalic')
  };

  Object.entries(styleBtns).forEach(([s, btn]) => {
    btn.addEventListener('click', () => {
      config.style = s;
      Object.values(styleBtns).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });


  // Copy button
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnLabel = document.getElementById('copyBtnLabel');

  copyBtn.addEventListener('click', () => {
    const text = generateFormattedText();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      const orig = copyBtnLabel.textContent;
      copyBtnLabel.textContent = '¡Copiado!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtnLabel.textContent = orig;
        copyBtn.classList.remove('copied');
      }, 1800);
    }).catch(err => {
      console.error(err);
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyBtnLabel.textContent = '¡Copiado!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtnLabel.textContent = 'Copiar para Bluesky';
        copyBtn.classList.remove('copied');
      }, 1800);
    });
  });

  // Initial render (starts empty)
  render();
});
