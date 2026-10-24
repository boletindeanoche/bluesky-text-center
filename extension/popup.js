const BRAILLE_SPACE = '\u2800'; // U+2800 invisible braille blank

const config = {
  linesTop: 2,
  linesBottom: 2,
  align: 'center', // 'none' | 'center' | 'relative'
  targetWidth: 34,
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
    target: '𝘢𝘣𝘤𝘥𝘦𝚏𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝗤𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡'
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

function getVisualLength(line) {
  let w = 0;
  for (const ch of line) {
    if ('iljt1.,:;!\'|'.includes(ch)) w += 0.5;
    else if ('WMm@%#QO'.includes(ch)) w += 1.35;
    else if (ch === ' ' || ch === BRAILLE_SPACE) w += 0.8;
    else w += 1.0;
  }
  return w;
}

function generateFormattedText() {
  const rawInput = document.getElementById('inputText').value;
  if (!rawInput.trim()) return '';

  const lines = rawInput.split('\n');
  const styledLines = lines.map(line => convertChars(line, config.style));

  let formattedLines = [];
  if (config.align === 'none') {
    formattedLines = [...styledLines];
  } else if (config.align === 'relative') {
    const maxWidth = Math.max(...styledLines.map(l => getVisualLength(l)));
    formattedLines = styledLines.map(l => {
      if (!l.trim()) return '';
      const lineW = getVisualLength(l);
      const diff = Math.max(0, (maxWidth - lineW) / 2);
      const brailleCount = Math.round(diff / 0.8);
      return BRAILLE_SPACE.repeat(brailleCount) + l;
    });
  } else {
    formattedLines = styledLines.map(l => {
      if (!l.trim()) return '';
      const lineW = getVisualLength(l);
      const diff = Math.max(0, (config.targetWidth - lineW) / 2);
      const brailleCount = Math.round(diff / 0.8);
      return BRAILLE_SPACE.repeat(brailleCount) + l;
    });
  }

  const topPadding = config.linesTop > 0 ? (BRAILLE_SPACE + '\n').repeat(config.linesTop) : '';
  const bottomPadding = config.linesBottom > 0 ? ('\n' + BRAILLE_SPACE).repeat(config.linesBottom) : '';

  return topPadding + formattedLines.join('\n') + bottomPadding;
}

function render() {
  const formatted = generateFormattedText();
  const preview = document.getElementById('previewText');
  
  if (!formatted) {
    preview.textContent = '(Escribe arriba para ver la vista previa)';
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

  // Steppers
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

  // Alignment buttons
  const alignBtns = {
    none: document.getElementById('btnAlignNone'),
    center: document.getElementById('btnAlignCenter'),
    relative: document.getElementById('btnAlignRelative')
  };

  Object.entries(alignBtns).forEach(([mode, btn]) => {
    btn.addEventListener('click', () => {
      config.align = mode;
      Object.values(alignBtns).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  // Width slider
  const slider = document.getElementById('widthSlider');
  slider.addEventListener('input', (e) => {
    config.targetWidth = parseInt(e.target.value, 10);
    document.getElementById('widthIndicator').textContent = `Ancho: ${config.targetWidth}`;
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

  // Sample button
  const sampleBtn = document.getElementById('loadSampleBtn');
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      document.getElementById('inputText').value = "CAPÍTULO I\nEl Despertar del Titán\n\nPróximamente";
      render();
    });
  }

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

  render();
});
