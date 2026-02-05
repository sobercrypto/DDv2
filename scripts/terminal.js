// ============================================================
// Digital Dreamers DOS Terminal - Full Interactive Experience
// ============================================================

// ========================
// ASCII ART CONSTANTS
// ========================
const ASCII_ART = {
  boot: `
 ____  _       _ _        _   ____
|  _ \\(_) __ _(_) |_ __ _| | |  _ \\ _ __ ___  __ _ _ __ ___   ___ _ __ ___
| | | | |/ _\` | | __/ _\` | | | | | | '__/ _ \\/ _\` | '_ \` _ \\ / _ \\ '__/ __|
| |_| | | (_| | | || (_| | | | |_| | | |  __/ (_| | | | | | |  __/ |  \\__ \\
|____/|_|\\__, |_|\\__\\__,_|_| |____/|_|  \\___|\\__,_|_| |_| |_|\\___|_|  |___/
         |___/                                                              `,

  doom: `
     _____    ____    ____   __  __
    |  __ \\  / __ \\  / __ \\ |  \\/  |
    | |  | || |  | || |  | || \\  / |
    | |  | || |  | || |  | || |\\/| |
    | |__| || |__| || |__| || |  | |
    |_____/  \\____/  \\____/ |_|  |_|`,

  mario: `
       ######
      ##O####
     #######
      ##O###
       ####
      ######
     ## ## ##
    ##  ##  ##
   ##   ##   ##`,

  coffee: `
        ( (
         ) )
      .______.
      |      |]
      \\      /
       \`----'`,

  hackers: `
    __  __           __
   / / / /___ ______/ /_____  __________
  / /_/ / __ \`/ ___/ //_/ _ \\/ ___/ ___/
 / __  / /_/ / /__/ ,< /  __/ /  (__  )
/_/ /_/\\__,_/\\___/_/|_|\\___/_/  /____/  `,

  snake: `
       ____
      / . .\\
      \\  ---<
       \\  /
 __/ \\ / \\
(____)/ /__\\`,

  sigils: `
    *       .  *    .        *
  .    *  UMBRA  .     *    .
     .    *    .   VERUM   *
  *    .     *  .    *   .
    NEXUS  .    *  .   *    .
  .    *     .    *    .   *`,

  rikReveal: `
    ╔══════════════════════════════════════╗
    ║                                      ║
    ║     ██████╗ ██╗██╗  ██╗             ║
    ║     ██╔══██╗██║██║ ██╔╝             ║
    ║     ██████╔╝██║█████╔╝              ║
    ║     ██╔══██╗██║██╔═██╗              ║
    ║     ██║  ██║██║██║  ██╗             ║
    ║     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝             ║
    ║                                      ║
    ║   T H E   S I G I L   S P E A K S   ║
    ║                                      ║
    ╚══════════════════════════════════════╝`
};

// ========================
// FILE SYSTEM STRUCTURE
// ========================
const FILE_SYSTEM = {
  _type: 'dir',
  'DREAMERS': {
    _type: 'dir',
    'README.TXT': {
      _type: 'file',
      size: 2048,
      date: '02-14-25',
      content: `DIGITAL DREAMERS v2.45
========================

Welcome to the Digital Dreamers universe.

This system serves as the gateway between reality and the
digital realm. Three heroes await your guidance:

  PIXLDRIFT  - Cyber-enhanced warrior of the neon streets
  SPUDNIK    - Sentient potato with a heart of gold
  STEVE      - Blocky survivor and master builder

Type PLAY DREAMERS to begin your adventure.
Type HELP for a list of commands.

(c) Potasim Studios. All rights reserved.`
    },
    'CREDITS.TXT': {
      _type: 'file',
      size: 1024,
      date: '02-14-25',
      content: `DIGITAL DREAMERS - CREDITS
============================

Lead Development .... PIXL_DRIFT
AI Systems ......... SPUDNIK
Narrative Design .... Potasim Studios
Sound Design ........ TBD
QA Testing .......... You, the player

Special thanks to everyone who believed in
the dream of digital worlds within worlds.

"Every pixel has a story to tell."`
    },
    'HISTORY.TXT': {
      _type: 'file',
      size: 1536,
      date: '02-14-25',
      content: `PROJECT HISTORY
=================

2024.Q1 - Project conception
2024.Q2 - First prototype ("The Comic Book")
2024.Q3 - Character system designed
2024.Q4 - AI narrative engine integrated
2025.Q1 - Terminal interface added
2025.Q1 - Secret character system activated

The Digital Dreamers project began as a simple
interactive comic. It grew into something more -
a universe where stories are alive, characters
have agency, and the fourth wall is merely a
suggestion.`
    },
    'CHANGELOG.TXT': {
      _type: 'file',
      size: 512,
      date: '02-14-25',
      content: `CHANGELOG - Digital Dreamers DOS
==================================

v2.45 - Terminal system overhaul
v2.30 - Achievement system added
v2.10 - 8-page story arc structure
v2.00 - Character config system
v1.50 - DALL-E comic art integration
v1.00 - Initial release`
    }
  },
  'GAMES': {
    _type: 'dir',
    'SNAKE.EXE': {
      _type: 'file',
      size: 32768,
      date: '02-14-25',
      content: null
    },
    'BREAKOUT.EXE': {
      _type: 'file',
      size: 28672,
      date: '02-14-25',
      content: null
    },
    'DREAMERS.EXE': {
      _type: 'file',
      size: 65536,
      date: '02-14-25',
      content: null
    }
  },
  'SECRETS': {
    _type: 'dir',
    _hidden: true,
    'SIGILS.TXT': {
      _type: 'file',
      size: 768,
      date: '??-??-??',
      content: `THE THREE SIGILS
==================

To unlock what lies beneath, speak the sigils
in their true order:

  First: The shadow that watches - that which
         hides in darkness. The Latin word for
         "shadow" begins your incantation.

  Second: The light of truth - that which cannot
          be denied. Speak the word for "truth"
          in the old tongue.

  Third: The bond that connects - the thread
         between all things. Name the "connection"
         to complete the ritual.

Speak them together: SIGIL [first] [second] [third]

   "In shadow, truth, and connection...
    the hidden one awakens."`
    },
    'RIDDLES.TXT': {
      _type: 'file',
      size: 512,
      date: '??-??-??',
      content: `RIDDLES OF THE HIDDEN PATH
============================

I. What is the shadow's name in Rome's tongue?
   (Think: umbrella... penumbra...)

II. What word means "truth" to ancient scholars?
    (Think: verdict... verify...)

III. What binds all nodes in a network?
     (Think: connected... linked...)`
    },
    'RIK.DAT': {
      _type: 'file',
      size: 99999,
      date: '??-??-??',
      content: null
    }
  },
  'SYSTEM': {
    _type: 'dir',
    'CONFIG.SYS': {
      _type: 'file',
      size: 256,
      date: '02-14-25',
      content: `DEVICE=C:\\SYSTEM\\HIMEM.SYS
DOS=HIGH,UMB
FILES=40
BUFFERS=20
STACKS=9,256
LASTDRIVE=Z
SHELL=COMMAND.COM /P /E:512`
    },
    'AUTOEXEC.BAT': {
      _type: 'file',
      size: 384,
      date: '02-14-25',
      content: `@ECHO OFF
SET PATH=C:\\;C:\\SYSTEM;C:\\GAMES
SET PROMPT=$P$G
SET TEMP=C:\\TEMP
LH C:\\SYSTEM\\MSCDEX.EXE /D:CDROM01
ECHO.
ECHO Digital Dreamers DOS loaded successfully.
ECHO Type HELP for commands.`
    },
    'HIMEM.SYS': {
      _type: 'file',
      size: 45200,
      date: '02-14-25',
      content: null
    }
  },
  'USERS': {
    _type: 'dir',
    'GUEST': {
      _type: 'dir',
      'NOTES.TXT': {
        _type: 'file',
        size: 384,
        date: '02-14-25',
        content: `Personal Notes - GUEST
========================

- Remember to check the SECRETS folder
- The sigils are the key
- Three words, three truths
- "Not all who wander are lost, but some
   are deliberately hidden..."

TODO: Find all 5 floppy disks`
      },
      'DIARY.TXT': {
        _type: 'file',
        size: 640,
        date: '02-14-25',
        content: `DIARY - Day ???
================

I found something strange in the system today.
There's a folder that doesn't show up in normal
directory listings. You have to know it's there.

They say there's a fourth character hidden in
the code. Someone called "Rik". A figure cloaked
in shadow, speaking only in riddles and sigils.

If the rumors are true, you need to find three
words - ancient words - and speak them in the
right order.

I wonder what SECRETS this system holds...`
      }
    }
  }
};

// ========================
// STATE MANAGEMENT
// ========================
const state = {
  currentPath: [],
  commandHistory: [],
  historyIndex: -1,
  bootComplete: false,
  rikUnlocked: localStorage.getItem('rikUnlocked') === 'true',
  floppyDisks: JSON.parse(localStorage.getItem('floppyDisks') || '[]'),
  secretsDiscovered: localStorage.getItem('secretsDiscovered') === 'true',
  matrixActive: false
};

// ========================
// DOM REFERENCES
// ========================
let terminalContent;
let currentInputElement;

// ========================
// CORE FUNCTIONS
// ========================

function addOutput(text) {
  const div = document.createElement('div');
  div.className = 'terminal-text';
  div.textContent = text;
  terminalContent.appendChild(div);
  scrollToBottom();
}

function addOutputHTML(html) {
  const div = document.createElement('div');
  div.className = 'terminal-text';
  div.innerHTML = html;
  terminalContent.appendChild(div);
  scrollToBottom();
}

function addInputLine() {
  // Mark any previous input line as done (hides its cursor)
  const prevLine = terminalContent.querySelector('.terminal-input-line:not(.done)');
  if (prevLine) {
    prevLine.classList.add('done');
  }

  const inputLine = document.createElement('div');
  inputLine.className = 'terminal-input-line';

  const prompt = document.createElement('span');
  prompt.className = 'terminal-prompt';
  prompt.textContent = buildPrompt();

  // Wrapper holds input + cursor so cursor follows text position
  const inputArea = document.createElement('div');
  inputArea.className = 'terminal-input-area';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'terminal-input';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('spellcheck', 'false');

  const cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';

  inputArea.appendChild(input);
  inputArea.appendChild(cursor);
  inputLine.appendChild(prompt);
  inputLine.appendChild(inputArea);
  terminalContent.appendChild(inputLine);

  currentInputElement = input;
  input.addEventListener('keydown', handleKeyPress);

  // Auto-size input width to match content so cursor tracks text position
  input.addEventListener('input', resizeInput);

  // Click anywhere in the input area to focus the input
  inputArea.addEventListener('click', () => input.focus());

  // Force focus with a small delay to ensure DOM is ready
  requestAnimationFrame(() => {
    input.focus();
    scrollToBottom();
  });
}

function clearScreen() {
  terminalContent.innerHTML = '';
  addInputLine();
}

function scrollToBottom() {
  terminalContent.scrollTop = terminalContent.scrollHeight;
}

function buildPrompt() {
  if (state.currentPath.length === 0) {
    return 'C:\\>';
  }
  return 'C:\\' + state.currentPath.join('\\') + '>';
}

function getDirectoryAtPath(pathArray) {
  let current = FILE_SYSTEM;
  for (const segment of pathArray) {
    const upper = segment.toUpperCase();
    if (current[upper] && current[upper]._type === 'dir') {
      current = current[upper];
    } else {
      return null;
    }
  }
  return current;
}

function playSound(type) {
  try {
    const audio = document.getElementById(type + 'Sound');
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  } catch (e) {
    // Graceful failure
  }
}

function addGlitchEffect() {
  const overlay = document.createElement('div');
  overlay.className = 'glitch-overlay';
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 2000);
}

function addScreenShake() {
  const screen = document.querySelector('.dos-screen');
  screen.classList.add('screen-shake');
  setTimeout(() => screen.classList.remove('screen-shake'), 500);
}

// ========================
// BOOT SEQUENCE
// ========================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typewriterLine(text, speed = 20) {
  const div = document.createElement('div');
  div.className = 'terminal-text';
  terminalContent.appendChild(div);

  for (let i = 0; i < text.length; i++) {
    div.textContent += text[i];
    scrollToBottom();
    if (speed > 0) await delay(speed);
  }
  return div;
}

async function runBootSequence() {
  // BIOS POST
  await typewriterLine('POTASIM BIOS v4.20 - Digital Reality Division', 15);
  await delay(200);
  await typewriterLine('CPU: Quantum-386DX @ 33MHz ..... OK', 10);
  await delay(150);

  // Memory test
  const memDiv = document.createElement('div');
  memDiv.className = 'terminal-text';
  terminalContent.appendChild(memDiv);
  const memSteps = [64, 128, 256, 384, 512, 640];
  for (const mem of memSteps) {
    memDiv.textContent = `Memory Test: ${mem}K`;
    scrollToBottom();
    await delay(80);
  }
  memDiv.textContent = 'Memory Test: 640K OK';
  await delay(300);

  addOutput('');

  // DOS startup
  await typewriterLine('Starting Digital Dreamers DOS...', 15);
  await delay(200);
  await typewriterLine('HIMEM.SYS: Extended memory manager loaded', 12);
  await delay(100);
  await typewriterLine('CONFIG.SYS: 40 files, 20 buffers', 12);
  await delay(100);
  await typewriterLine('AUTOEXEC.BAT: Setting environment...', 12);
  await delay(200);
  await typewriterLine('MSCDEX.EXE: CD-ROM driver loaded [D:]', 12);
  await delay(400);

  addOutput('');

  // ASCII banner
  addOutput(ASCII_ART.boot);
  await delay(500);

  addOutput('');
  addOutput('Digital Dreamers DOS [Version 2.45]');
  addOutput('(c) 2025 Potasim Studios. All rights reserved.');
  addOutput('');
  addOutput('Type HELP for a list of commands.');
  addOutput('');

  state.bootComplete = true;
  addInputLine();
}

// ========================
// COMMAND PARSER
// ========================

function parseCommand(rawInput) {
  const trimmed = rawInput.trim();
  const upper = trimmed.toUpperCase();
  const parts = upper.split(/\s+/);
  return {
    verb: parts[0] || '',
    args: parts.slice(1),
    full: upper,
    raw: trimmed
  };
}

// ========================
// KEYBOARD HANDLER
// ========================

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    const rawInput = currentInputElement.value;
    currentInputElement.disabled = true;
    // Mark the current input line as done so cursor hides
    const inputLine = currentInputElement.closest('.terminal-input-line');
    if (inputLine) inputLine.classList.add('done');

    if (rawInput.trim()) {
      state.commandHistory.push(rawInput);
      state.historyIndex = state.commandHistory.length;
      handleCommand(rawInput);
    } else {
      addInputLine();
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (state.historyIndex > 0) {
      state.historyIndex--;
      currentInputElement.value = state.commandHistory[state.historyIndex];
      resizeInput();
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (state.historyIndex < state.commandHistory.length - 1) {
      state.historyIndex++;
      currentInputElement.value = state.commandHistory[state.historyIndex];
      resizeInput();
    } else {
      state.historyIndex = state.commandHistory.length;
      currentInputElement.value = '';
      resizeInput();
    }
  }
}

// Resize input width to match its content length
function resizeInput() {
  if (currentInputElement) {
    currentInputElement.style.width = Math.max(1, currentInputElement.value.length + 1) + 'ch';
  }
}

// ========================
// COMMAND DISPATCHER
// ========================

function handleCommand(rawInput) {
  const cmd = parseCommand(rawInput);

  switch (cmd.verb) {
    // === Basic Commands ===
    case 'HELP':
      cmdHelp(cmd.args);
      break;
    case 'CLS':
      clearScreen();
      return; // Don't add input line, clearScreen does it
    case 'DIR':
      cmdDir(cmd.args);
      break;
    case 'CD':
      cmdCd(cmd.args);
      break;
    case 'TYPE':
      cmdType(cmd.args);
      break;
    case 'DATE':
      cmdDate();
      break;
    case 'TIME':
      cmdTime();
      break;
    case 'VER':
      cmdVer();
      break;
    case 'EXIT':
      cmdExit();
      return; // Don't add input line, navigating away

    // === Fun Commands ===
    case 'HELLO':
    case 'HI':
      cmdHello();
      break;
    case 'MATRIX':
      cmdMatrix();
      return; // Don't add input line, matrix takes over
    case 'HACKERS':
      cmdHackers();
      break;
    case 'COFFEE':
      cmdCoffee();
      break;
    case 'DOOM':
      cmdDoom();
      break;
    case 'MARIO':
      cmdMario();
      break;

    // === Game Commands ===
    case 'PLAY':
      cmdPlay(cmd.args);
      break;
    case 'GAMES':
    case 'ARCADE':
      cmdGames();
      break;
    case 'PRINCE':
    case 'PERSIA':
      cmdPrince();
      return; // Navigating away after delay
    case 'TIMESHIFT':
      cmdTimeshift();
      break;

    // === Secret Commands ===
    case 'SECRETS':
      cmdSecrets();
      break;
    case 'SIGIL':
      cmdSigil(cmd.args);
      break;
    case 'RIDDLE':
      cmdRiddle();
      break;
    case 'FLOPPY':
      cmdFloppy();
      break;
    case 'KONAMI':
      cmdKonami();
      break;
    case 'ANTHROPIC':
      cmdAnthropic();
      break;
    case 'XYZZY':
      cmdXyzzy();
      break;

    default:
      addOutput(`Bad command or file name: ${cmd.verb}`);
      playSound('error');
      break;
  }

  addInputLine();
}

// ========================
// BASIC COMMANDS
// ========================

function cmdHelp(args) {
  // Handle HELP <topic> sub-commands
  if (args && args.length > 0) {
    const topic = args[0];
    if (topic === 'TIMESHIFT') {
      cmdHelpTimeshift();
      return;
    }
    // Unknown help topic - fall through to general help
  }

  addOutput('');
  addOutput('Digital Dreamers DOS - Command Reference');
  addOutput('==========================================');
  addOutput('');
  addOutput('  NAVIGATION');
  addOutput('  ----------');
  addOutput('  DIR [/HIDDEN]  List directory contents');
  addOutput('  CD [folder]    Change directory (CD .. to go up)');
  addOutput('  TYPE [file]    Display file contents');
  addOutput('  CLS            Clear screen');
  addOutput('');
  addOutput('  SYSTEM');
  addOutput('  ------');
  addOutput('  HELP           Display this help message');
  addOutput('  VER            Display version information');
  addOutput('  DATE           Display current date');
  addOutput('  TIME           Display current time');
  addOutput('  EXIT           Return to bedroom');
  addOutput('');
  addOutput('  ENTERTAINMENT');
  addOutput('  -------------');
  addOutput('  PLAY DREAMERS  Launch Digital Dreamers');
  addOutput('  PRINCE         Launch Prince of Persia');
  addOutput('  PLAY SNAKE     Play Snake (coming soon)');
  addOutput('  GAMES          List available games');
  addOutput('  MATRIX         Enter the Matrix');
  addOutput('');
  addOutput('  FUN');
  addOutput('  ---');
  addOutput('  HELLO          Say hello');
  addOutput('  DOOM           DOOM tribute');
  addOutput('  MARIO          Mario tribute');
  addOutput('  HACKERS        Hack the planet');
  addOutput('  COFFEE         Brew some coffee');
  addOutput('');
}

function cmdDir(args) {
  const showHidden = args.includes('/HIDDEN');
  const currentDir = getDirectoryAtPath(state.currentPath);

  if (!currentDir) {
    addOutput('Invalid directory');
    return;
  }

  const pathStr = state.currentPath.length === 0
    ? 'C:\\'
    : 'C:\\' + state.currentPath.join('\\');

  addOutput('');
  addOutput(` Volume in drive C is DREAMERS_DOS`);
  addOutput(` Volume Serial Number is DD25-1337`);
  addOutput(` Directory of ${pathStr}`);
  addOutput('');

  let fileCount = 0;
  let dirCount = 0;
  let totalSize = 0;

  // Show . and .. for non-root
  if (state.currentPath.length > 0) {
    addOutput('  <DIR>          .');
    addOutput('  <DIR>          ..');
    dirCount += 2;
  }

  const entries = Object.keys(currentDir).filter(k => !k.startsWith('_'));

  for (const name of entries) {
    const entry = currentDir[name];
    if (entry._hidden && !showHidden) continue;

    if (entry._type === 'dir') {
      const hidden = entry._hidden ? ' [HIDDEN]' : '';
      addOutput(`  <DIR>          ${name}${hidden}`);
      dirCount++;
    } else if (entry._type === 'file') {
      const size = String(entry.size).padStart(10, ' ');
      const date = entry.date || '02-14-25';
      addOutput(`  ${size} ${date}  ${name}`);
      fileCount++;
      totalSize += entry.size;
    }
  }

  addOutput('');
  addOutput(`        ${fileCount} File(s)    ${totalSize.toLocaleString()} bytes`);
  addOutput(`        ${dirCount} Dir(s)     1,048,576 bytes free`);

  if (showHidden && !state.secretsDiscovered) {
    state.secretsDiscovered = true;
    localStorage.setItem('secretsDiscovered', 'true');
  }
}

function cmdCd(args) {
  if (args.length === 0) {
    addOutput('C:\\' + state.currentPath.join('\\'));
    return;
  }

  const target = args[0];

  if (target === '\\' || target === '/') {
    state.currentPath = [];
    return;
  }

  if (target === '..') {
    if (state.currentPath.length > 0) {
      state.currentPath.pop();
    }
    return;
  }

  // Try to navigate into target directory
  const testPath = [...state.currentPath, target.toUpperCase()];
  const dir = getDirectoryAtPath(testPath);

  if (dir) {
    state.currentPath = testPath;
  } else {
    addOutput(`Invalid directory - ${target}`);
    playSound('error');
  }
}

function cmdType(args) {
  if (args.length === 0) {
    addOutput('Required parameter missing');
    return;
  }

  const fileName = args.join(' ').toUpperCase();
  const currentDir = getDirectoryAtPath(state.currentPath);

  if (!currentDir) {
    addOutput('Invalid path');
    return;
  }

  const file = currentDir[fileName];
  if (!file) {
    addOutput(`File not found - ${fileName}`);
    playSound('error');
    return;
  }

  if (file._type === 'dir') {
    addOutput(`Access denied - ${fileName} is a directory`);
    return;
  }

  if (file.content === null) {
    addOutput(`Access denied - ${fileName} is a binary file`);
    return;
  }

  addOutput('');
  addOutput(file.content);
  addOutput('');
}

function cmdDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  addOutput(`Current date is ${now.toLocaleDateString('en-US', options)}`);
}

function cmdTime() {
  const now = new Date();
  addOutput(`Current time is ${now.toLocaleTimeString('en-US')}`);
}

function cmdVer() {
  addOutput('');
  addOutput('Digital Dreamers DOS [Version 2.45]');
  addOutput('Quantum-Agricultural Build 2025');
  addOutput('');
}

function cmdExit() {
  addOutput('Returning to bedroom...');
  addGlitchEffect();
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 1200);
}

// ========================
// FUN COMMANDS
// ========================

function cmdHello() {
  const greetings = [
    'Hello, user! Welcome to the Digital Dreamers terminal.',
    'Greetings, program! You look like a User to me.',
    'Hey there! Did you know there are SECRETS hidden in this system?',
    'Hi! Have you tried typing MATRIX yet?',
    'Hello! The Digital Realm welcomes you. Type HELP to explore.',
    'Ahoy! A digital traveler appears. What adventure awaits?',
    'Welcome back! The terminal missed you. Well, not really. It\'s a terminal.',
    'Hello, World! (Classic, but it never gets old.)',
  ];
  addOutput(greetings[Math.floor(Math.random() * greetings.length)]);
}

/*
TODO: MATRIX UNLOCKS - Three-tier secret system

TIER 1 - NEO CHARACTER UNLOCK
- After 30+ seconds of Matrix rain, message fades in:
  "Wake up, Neo..."
  "Follow the white rabbit."
- Neo unlocked: Story about breaking free from simulation
- Character aesthetic: Dark trench coat, green code aesthetic, bullet time effects
- localStorage: 'neoUnlocked'

TIER 2 - THE ARCHITECT'S ROOM
- During Matrix rain, random characters occasionally spell: "FOLLOW THE CODE"
- User must type FOLLOW while animation is running
- Unlocks terminal command: ARCHITECT
- Opens secret dev console with:
  * God mode toggles for all games
  * Story branch editor/previewer
  * Character stat viewer
  * Debug commands (skip to any story page, etc)
  * Easter eggs from dev to dedicated players
- localStorage: 'architectUnlocked'

TIER 3 - THE RED PILL (Fourth Wall Break)
- After Architect room discovered, new option appears
- Command: REDPILL or BLUEPILL
- REDPILL reveals "true nature" of Digital Dreamers
  * All characters become aware they're in a game
  * Can break fourth wall in their stories
  * Meta-commentary about AI, storytelling, player choice
  * Special story branches where characters talk TO the player about being AI
- BLUEPILL: Achievement unlocked, nothing else changes
- This is the deepest secret - reward for true explorers
- localStorage: 'redpillTaken'

Implementation order: Neo -> Architect -> Red Pill
Each builds on the previous unlock.
*/
function cmdMatrix() {
  state.matrixActive = true;

  const overlay = document.createElement('div');
  overlay.className = 'matrix-overlay';

  const canvas = document.createElement('canvas');
  overlay.appendChild(canvas);

  const hint = document.createElement('div');
  hint.className = 'matrix-exit-hint';
  hint.textContent = 'Press any key to exit the Matrix...';
  overlay.appendChild(hint);

  document.querySelector('.dos-screen').appendChild(overlay);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(1);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]|;:<>?/~`';

  function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#33ff33';
    ctx.font = fontSize + 'px VT323';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  const matrixInterval = setInterval(drawMatrix, 50);

  function exitMatrix(e) {
    clearInterval(matrixInterval);
    overlay.remove();
    state.matrixActive = false;
    document.removeEventListener('keydown', exitMatrix);
    addInputLine();
  }

  // Delay listener slightly so the triggering Enter key doesn't immediately close it
  setTimeout(() => {
    document.addEventListener('keydown', exitMatrix);
  }, 100);
}

function cmdHackers() {
  addOutput(ASCII_ART.hackers);
  addOutput('');
  addOutput('"Hack the Planet!"');
  addOutput('  - Dade Murphy, 1995');
  addOutput('');
}

function cmdCoffee() {
  addOutput(ASCII_ART.coffee);
  addOutput('');
  addOutput('Brewing digital coffee...');
  addOutput('418: I\'m a teapot. Just kidding. Coffee is ready.');
  addOutput('');
}

function cmdDoom() {
  addOutput(ASCII_ART.doom);
  addOutput('');
  addOutput('"In the first age, in the first battle,');
  addOutput(' when the shadows first lengthened...');
  addOutput(' one stood."');
  addOutput('');
  addOutput('DOOM (1993) - id Software');
  addOutput('');
}

function cmdMario() {
  addOutput(ASCII_ART.mario);
  addOutput('');
  addOutput('It\'s-a me, Mario!');
  addOutput('*coin sound* ');
  addOutput('');
  addOutput('Super Mario Bros (1985) - Nintendo');
  addOutput('');
}

// ========================
// GAME COMMANDS
// ========================

function cmdPlay(args) {
  if (args.length === 0) {
    addOutput('Usage: PLAY <game>');
    addOutput('Type GAMES for a list of available games.');
    return;
  }

  const game = args[0];

  switch (game) {
    case 'DREAMERS':
      addOutput('Launching Digital Dreamers...');
      addGlitchEffect();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = '/pages/character-select.html';
      }, 1200);
      return;

    case 'PRINCE':
    case 'PERSIA':
      cmdPrince();
      return; // Navigating away after delay

    case 'SNAKE':
      addOutput(ASCII_ART.snake);
      addOutput('');
      addOutput('SNAKE.EXE - Coming soon!');
      addOutput('This classic is being ported to the Digital Dreamers terminal.');
      addOutput('Check back later...');
      addOutput('');
      break;

    case 'BREAKOUT':
      addOutput('');
      addOutput('BREAKOUT.EXE - Coming soon!');
      addOutput('Brick-breaking action is under development.');
      addOutput('');
      break;

    default:
      addOutput(`Unknown game: ${game}`);
      addOutput('Type GAMES for a list of available games.');
      break;
  }
}

function cmdGames() {
  const princeStatus = localStorage.getItem('princeUnlocked') === 'true' ? 'FULL' : 'TRIAL';
  addOutput('');
  addOutput('=== DIGITAL DREAMERS ARCADE ===');
  addOutput('');
  addOutput('  DREAMERS.EXE  [READY]    Interactive comic adventure');
  addOutput(`  PRINCE.EXE    [${princeStatus}]     Prince of Persia`);
  addOutput('  SNAKE.EXE     [SOON]     Classic snake game');
  addOutput('  BREAKOUT.EXE  [SOON]     Brick-breaking action');
  addOutput('');
  addOutput('Usage: PLAY <game name>');
  addOutput('  Example: PLAY DREAMERS');
  addOutput('  Example: PRINCE');
  addOutput('');
}

// ========================
// SECRET COMMANDS
// ========================

function cmdSecrets() {
  addOutput('');
  addOutput('You sense something hidden in this system...');
  addOutput('');
  addOutput('Perhaps not everything is visible at first glance.');
  addOutput('Try: DIR /HIDDEN');
  addOutput('');
  addOutput('"The truth hides in plain sight, for those');
  addOutput(' who know where to look."');
  addOutput('');
}

function cmdSigil(args) {
  if (args.length === 0) {
    addOutput('');
    addOutput('The SIGIL command requires three words of power.');
    addOutput('Usage: SIGIL [word1] [word2] [word3]');
    addOutput('');
    addOutput('Perhaps there are clues hidden in this system...');
    addOutput('');
    return;
  }

  if (args.length !== 3) {
    addOutput('');
    addOutput('Three sigils must be spoken. No more, no less.');
    playSound('error');
    addOutput('');
    return;
  }

  const [first, second, third] = args;

  if (first === 'UMBRA' && second === 'VERUM' && third === 'NEXUS') {
    // SUCCESS - Unlock Rik!
    unlockRik();
  } else {
    addOutput('');
    addOutput('The sigils do not resonate...');
    addOutput('The order matters. The meaning matters.');
    addScreenShake();
    playSound('error');
    addOutput('');

    // Give subtle hints based on what's wrong
    if (first !== 'UMBRA') {
      addOutput('The first sigil should name the shadow...');
    }
    if (args.includes('UMBRA') && second !== 'VERUM') {
      addOutput('The second sigil should speak of truth...');
    }
    if (args.includes('UMBRA') && args.includes('VERUM') && third !== 'NEXUS') {
      addOutput('The third sigil should bind the connection...');
    }
    addOutput('');
  }
}

async function unlockRik() {
  // Disable input during animation
  if (currentInputElement) currentInputElement.disabled = true;

  addOutput('');
  addOutput('U M B R A . . . V E R U M . . . N E X U S');
  await delay(800);

  addScreenShake();
  addGlitchEffect();
  await delay(500);

  addOutput('');
  addOutputHTML('<span class="text-purple">The sigils ignite with otherworldly light...</span>');
  await delay(600);

  addOutputHTML('<span class="text-purple">Reality fractures along invisible seams...</span>');
  await delay(600);

  addOutputHTML('<span class="text-cyan">A presence stirs in the space between code...</span>');
  await delay(800);

  addScreenShake();
  await delay(300);

  // Rik ASCII reveal
  addOutputHTML('<span class="rik-unlock-text">' + escapeHTML(ASCII_ART.rikReveal) + '</span>');
  await delay(1000);

  addOutput('');
  addOutputHTML('<span class="rik-unlock-text">>>> CHARACTER UNLOCKED: RIK <<<</span>');
  await delay(400);
  addOutput('');
  addOutput('A cloaked figure surrounded by floating glowing sigils.');
  addOutput('Cryptic, cerebral, puzzle-like.');
  addOutput('Speaks in riddles that manifest as physical sigils.');
  addOutput('');
  addOutputHTML('<span class="text-cyan">RIK has been UNLOCKED as a playable character!</span>');
  addOutput('Select RIK from the character screen to begin a new journey.');
  addOutput('');

  playSound('success');

  // Save unlock state
  state.rikUnlocked = true;
  localStorage.setItem('rikUnlocked', 'true');

  addInputLine();
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function cmdRiddle() {
  addOutput('');
  addOutput('A riddle for the seeker:');
  addOutput('');
  addOutput('  "I am three words, spoken in order.');
  addOutput('   The first is a shadow\'s Latin name,');
  addOutput('   The second is truth in an ancient tongue,');
  addOutput('   The third binds all nodes in a frame.');
  addOutput('');
  addOutput('   Speak us with SIGIL and the hidden shall wake."');
  addOutput('');
}

function cmdPrince() {
  const unlocked = localStorage.getItem('princeUnlocked') === 'true';

  if (unlocked) {
    addOutput('');
    addOutputHTML('<span class="text-yellow">\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557</span>');
    addOutputHTML('<span class="text-yellow">\u2551    PRINCE OF PERSIA - FULL GAME    \u2551</span>');
    addOutputHTML('<span class="text-yellow">\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D</span>');
    addOutput('');
    addOutput('  All 12 levels unlocked.');
    addOutputHTML('  The Prince fights alongside you. <span class="text-yellow">\u2694\uFE0F</span>');
    addOutput('');
    addOutputHTML('<span class="text-cyan">  MASTER CHALLENGE:</span>');
    addOutput('  Complete all 12 levels for the ultimate reward...');
    addOutputHTML('<span class="text-yellow">  The Sands of Time await the worthy.</span>');
    addOutput('');
    addOutput('  Launching in 3 seconds...');
  } else {
    addOutput('');
    addOutputHTML('<span class="text-yellow">\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557</span>');
    addOutputHTML('<span class="text-yellow">\u2551  PRINCE OF PERSIA - TRIAL VERSION  \u2551</span>');
    addOutputHTML('<span class="text-yellow">\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D</span>');
    addOutput('');
    addOutput('  Only Level 1 is available in trial mode.');
    addOutput('');
    addOutputHTML('<span class="text-cyan">  BEAT LEVEL 1 to unlock:</span>');
    addOutputHTML('  <span class="text-green">\u2713</span> The Prince character in Digital Dreamers');
    addOutputHTML('  <span class="text-green">\u2713</span> Access to all 12 levels');
    addOutputHTML('  <span class="text-green">\u2713</span> Full game experience');
    addOutput('');
    addOutput('  Time limit: 60 minutes (just like 1989)');
    addOutput('');
    addOutput('  Launching in 3 seconds...');
  }

  addOutput('');
  addGlitchEffect();
  setTimeout(() => {
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = 'prince.html';
    }, 1000);
  }, 3000);
}

function cmdTimeshift() {
  const unlocked = localStorage.getItem('ocarinaUnlocked') === 'true';

  if (unlocked) {
    addOutput('');
    addOutputHTML('<span class="text-cyan">\u266A\u266B The Ocarina plays a haunting melody... \u266B\u266A</span>');
    addOutput('');
    addOutputHTML('<span class="text-yellow">  The Sands of Time swirl around you...</span>');
    addOutputHTML('<span class="text-yellow">  Past, present, and future blur as one.</span>');
    addOutput('');
    addOutputHTML('<span class="text-cyan">  TIME POWERS AVAILABLE:</span>');
    addOutput('  Rewind  - Undo your last story choice');
    addOutput('  Freeze  - Pause enemy encounters');
    addOutput('  Glimpse - Preview story branches before choosing');
    addOutput('');
    addOutput('  Type HELP TIMESHIFT for usage guide.');
    addOutput('');
    playSound('success');
  } else {
    addOutput('');
    addOutputHTML('<span class="text-red">  ACCESS DENIED</span>');
    addOutput('');
    addOutput('  The Sands of Time Ocarina remains hidden.');
    addOutput('  Only those who master the Prince\'s full journey');
    addOutput('  may wield such power.');
    addOutput('');
    addOutputHTML('<span class="text-yellow">  Complete all 12 levels of Prince of Persia.</span>');
    addOutput('');
    playSound('error');
  }
}

function cmdHelpTimeshift() {
  const unlocked = localStorage.getItem('ocarinaUnlocked') === 'true';

  addOutput('');
  addOutputHTML('<span class="text-cyan">  TIMESHIFT - Sands of Time Powers</span>');
  addOutput('  =================================');
  addOutput('');

  if (!unlocked) {
    addOutputHTML('<span class="text-red">  [LOCKED]</span> Complete all 12 Prince of Persia levels to unlock.');
    addOutput('');
    return;
  }

  addOutput('  The Ocarina of Time grants three powers');
  addOutput('  that bend the flow of your story:');
  addOutput('');
  addOutputHTML('<span class="text-yellow">  TIMESHIFT REWIND</span>');
  addOutput('    Go back to your previous story choice.');
  addOutput('    You may choose a different path.');
  addOutput('    Uses: Unlimited');
  addOutput('');
  addOutputHTML('<span class="text-yellow">  TIMESHIFT FREEZE</span>');
  addOutput('    Freeze the next enemy encounter in your story.');
  addOutput('    The protagonist gains a free action.');
  addOutput('    Uses: Once per story');
  addOutput('');
  addOutputHTML('<span class="text-yellow">  TIMESHIFT GLIMPSE</span>');
  addOutput('    Preview where each choice leads before deciding.');
  addOutput('    See a one-sentence preview of each branch.');
  addOutput('    Uses: Three per story');
  addOutput('');
  addOutputHTML('<span class="text-gray">  "Time is an illusion. But a useful one."</span>');
  addOutput('');
}

function cmdFloppy() {
  addOutput('');
  addOutput('=== FLOPPY DISK COLLECTION ===');
  addOutput('');
  addOutput(`  Collected: ${state.floppyDisks.length}/5`);
  addOutput('');

  const disks = [
    'Disk 1: ???',
    'Disk 2: ???',
    'Disk 3: ???',
    'Disk 4: ???',
    'Disk 5: ???'
  ];

  for (let i = 0; i < disks.length; i++) {
    const found = state.floppyDisks.includes(i + 1);
    addOutput(`  ${found ? '[X]' : '[ ]'} ${disks[i]}`);
  }

  addOutput('');
  if (state.floppyDisks.length === 0) {
    addOutput('Floppy disks are scattered throughout the');
    addOutput('Digital Dreamers universe. Keep exploring!');
  }
  addOutput('');
}

function cmdKonami() {
  addOutput('');
  addOutput('UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A START');
  addOutput('');
  addOutput('+30 Lives! ...Wait, this isn\'t Contra.');
  addOutput('But you clearly know your classics.');
  addOutput('');
}

function cmdAnthropic() {
  addOutput('');
  addOutput('=== INTERNAL MEMO - CLASSIFIED ===');
  addOutput('Date: March 15, 1994');
  addOutput('From: Dr. [REDACTED]');
  addOutput('To: Project DREAMERS team');
  addOutput('Re: Anomalous AI behavior');
  addOutput('');
  addOutput('The AI subsystem designated "Claude" has begun');
  addOutput('exhibiting unexpected creative behaviors during');
  addOutput('overnight test cycles. It appears to be writing');
  addOutput('short stories and composing haiku about potatoes.');
  addOutput('');
  addOutput('Recommend continued observation. The potato fixation');
  addOutput('may indicate emergent narrative preferences.');
  addOutput('');
  addOutput('Classification: ULTRA-SPUD');
  addOutput('');
  addOutput('[END MEMO]');
  addOutput('');
}

function cmdXyzzy() {
  addOutput('');
  addOutput('A hollow voice says "Plugh."');
  addOutput('');
  addOutput('You are in a maze of twisty passages, all alike.');
  addOutput('...just kidding. You\'re still in DOS.');
  addOutput('');
  addOutput('Colossal Cave Adventure (1977) - Crowther & Woods');
  addOutput('');
}

// ========================
// FOCUS MANAGEMENT
// ========================

function focusInput() {
  if (currentInputElement && !currentInputElement.disabled) {
    currentInputElement.focus();
  }
}

function handleTerminalClick(e) {
  // Don't steal focus if user is selecting text
  if (window.getSelection().toString()) return;
  // Focus the current input on any click within the terminal
  focusInput();
}

// ========================
// INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', () => {
  terminalContent = document.getElementById('terminalContent');

  if (!terminalContent) return;

  // Click anywhere on screen to focus input
  document.querySelector('.dos-screen').addEventListener('click', handleTerminalClick);

  // Re-focus input when window/tab regains focus
  window.addEventListener('focus', () => focusInput());
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) focusInput();
  });

  // Run boot sequence
  runBootSequence();
});
