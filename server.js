const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Static file serving and middleware setup
app.use(express.static(path.join(__dirname, "client")));
app.use(express.static("client"));
app.use("/assets", express.static("assets"));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "x-api-key",
      "anthropic-version",
      "authorization",
    ],
    credentials: true,
  })
);

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' https://api.anthropic.com https://api.openai.com data: blob:;"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-api-key, anthropic-version"
  );
  next();
});

// Preflight OPTIONS handling
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// Database initialization
const dbDir = path.join(__dirname, "client", ".data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(
  path.join(__dirname, "client", ".data", "game.db"),
  (err) => {
    if (err) {
      console.error("Database connection error:", err.message);
    } else {
      console.log("Connected to the game database.");

      // Create tables if they don't exist
      db.run(`CREATE TABLE IF NOT EXISTS game_sessions (
      id INTEGER PRIMARY KEY,
      player_id TEXT,
      character_type TEXT,
      current_page INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

      db.run(`CREATE TABLE IF NOT EXISTS story_choices (
      id INTEGER PRIMARY KEY,
      session_id INTEGER,
      page_number INTEGER,
      choice_made INTEGER,
      story_text TEXT,
      choice1_text TEXT,
      choice2_text TEXT,
      choice3_text TEXT,
      image_url TEXT,
      FOREIGN KEY(session_id) REFERENCES game_sessions(id)
    )`);

      // Add achievements table
      db.run(`CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY,
      player_id TEXT,
      achievement_type TEXT,
      achievement_name TEXT,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

      // Add completed playthroughs table for tracking
      db.run(`CREATE TABLE IF NOT EXISTS completed_playthroughs (
      id INTEGER PRIMARY KEY,
      player_id TEXT,
      character_type TEXT,
      moral_alignment TEXT,
      story_summary TEXT,
      adventure_title TEXT,
      duration_seconds INTEGER,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    }
  }
);

// ===================
// ACHIEVEMENT DEFINITIONS
// ===================
const ACHIEVEMENTS = {
  // Completion achievements
  first_steps: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first story',
    icon: '🎬'
  },
  heros_path: {
    id: 'heros_path',
    name: "Hero's Path",
    description: 'Finish a story with good alignment',
    icon: '✨'
  },
  dark_journey: {
    id: 'dark_journey',
    name: 'Dark Journey',
    description: 'Finish a story with evil alignment',
    icon: '🌑'
  },
  balanced_soul: {
    id: 'balanced_soul',
    name: 'Balanced Soul',
    description: 'Finish a story with neutral alignment',
    icon: '⚖️'
  },
  // Speed achievements
  speed_runner: {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Finish a story in under 10 minutes',
    icon: '⚡'
  },
  deep_thinker: {
    id: 'deep_thinker',
    name: 'Deep Thinker',
    description: 'Spend over 30 minutes on a playthrough',
    icon: '🤔'
  },
  // Character mastery
  completionist: {
    id: 'completionist',
    name: 'Completionist',
    description: 'Finish a story with each character',
    icon: '🏆'
  },
  pixldrift_master: {
    id: 'pixldrift_master',
    name: 'Pixldrift Master',
    description: 'Complete 3 stories with Pixldrift',
    icon: '💜'
  },
  spudnik_master: {
    id: 'spudnik_master',
    name: 'Spudnik Master',
    description: 'Complete 3 stories with Spudnik',
    icon: '🥔'
  },
  steve_master: {
    id: 'steve_master',
    name: 'Steve Master',
    description: 'Complete 3 stories with Steve',
    icon: '⛏️'
  }
};

// ===================
// CHARACTER CONFIGURATION SYSTEM
// ===================

const characterConfig = {
  // ACTIVE CHARACTERS
  pixldrift: {
    id: "pixldrift",
    name: "Pixldrift",
    artStyle: "Neon cyberpunk comic art, Blade Runner meets Spider-Verse aesthetic, high contrast with deep blacks and vivid neon pinks/blues/purples, rain-slicked reflective surfaces, holographic UI elements, glowing edge lighting, urban decay mixed with high technology, dramatic cinematic lighting, lens flares and light bloom effects, gritty yet stylish",
    characterInScene: "a hooded figure with glowing circuit patterns under translucent skin and a high-tech jacket with illuminated trim",
    tone: {
      good: "Heroic protector of the digital underclass, fighting corporate oppression with style and compassion",
      neutral: "Cool and detached operator navigating the shadows between megacorps and street gangs",
      evil: "Ruthless data thief willing to sell anyone out for the right price, cold and calculating"
    },
    defaultTone: "neutral",
    unlocked: true
  },

  spudnik: {
    id: "spudnik",
    name: "Spudnik",
    artStyle: "Warm storybook illustration style, Studio Ghibli meets Pixar aesthetic, soft rounded shapes, gentle watercolor-like lighting, rich earthy colors with pops of magical glow, whimsical and heartfelt mood, expressive character animation style, lush environmental details, cozy and inviting atmosphere with touches of magical realism",
    characterInScene: "a small round potato with large expressive eyes, tiny stubby limbs, and a small green sprout on top",
    tone: {
      good: "Endlessly optimistic and kind, believing the best in everyone, spreading joy wherever they roll",
      neutral: "Curious and open-minded, taking each situation as it comes with gentle humor",
      evil: "Passive-aggressive and petty, using guilt trips and emotional manipulation while maintaining a cheerful facade"
    },
    defaultTone: "good",
    unlocked: true
  },

  steve: {
    id: "steve",
    name: "Steve",
    artStyle: "Minecraft voxel art style, everything rendered as 3D cubes and rectangular prisms, blocky low-poly aesthetic, limited color palette with flat shading, chunky pixels, no smooth curves - all edges are hard and angular, reminiscent of 16-bit era 3D graphics, nostalgic video game aesthetic",
    characterInScene: "blocky Steve with his iconic blue shirt, dark brown cubic hair, and square proportions, holding a diamond sword or pickaxe",
    tone: {
      good: "Helpful builder who shares resources and protects villages from monsters",
      neutral: "Lone adventurer focused on exploration, mining, and survival",
      evil: "Greedy hoarder who raids villages and traps creatures for sport"
    },
    defaultTone: "neutral",
    unlocked: true
  },

  // UNLOCKABLE CHARACTER - Rik (unlocked via terminal sigil puzzle)
  rik: {
    id: "rik",
    name: "Rik",
    artStyle: "Dark occult-tech fusion, mystical symbols mixed with digital glitch effects, shadowy atmospheric scenes with glowing arcane sigils floating in air, matrix-style code rain combined with ancient runes, deep purples and blacks with gold/cyan magical accents, mysterious and cerebral mood, smoke and particle effects",
    characterInScene: "a cloaked figure with face hidden in shadow, surrounded by floating glowing sigils and runes, eyes occasionally flashing with arcane light",
    tone: {
      good: "Cryptic guardian who speaks in riddles but ultimately guides heroes toward wisdom",
      neutral: "Enigmatic observer who offers knowledge at a price, neither helping nor hindering",
      evil: "Dark sorcerer whose riddles lead victims into traps, feeding on confusion and despair"
    },
    defaultTone: "neutral",
    unlocked: false,
    unlockCondition: "Find and speak the three sigils in the terminal..."
  },

  // UNLOCKABLE CHARACTER - Prince (unlocked via Prince of Persia Level 1)
  prince: {
    id: "prince",
    name: "The Prince",
    artStyle: "Persian prince character art in cinematic comic style, flowing silk robes with intricate patterns, ornate scimitar sword, palace architecture with Islamic geometric patterns and arabesque designs, warm desert colors (golds, deep blues, rich reds), dramatic lighting with silk and sand textures, inspired by classic Persian miniature paintings meets modern action game art, cinematic composition",
    characterInScene: "a Persian prince in flowing silk robes wielding an ornate scimitar, athletic and regal bearing",
    tone: {
      good: "Noble, athletic, determined, honorable. Speaks with dignity and courage. Expert swordsman and acrobat. References destiny, honor, time, and fate. Faces deadly challenges with grace. Protective of the innocent. Driven by duty to save the Princess and restore justice.",
      neutral: "Pragmatic warrior-prince navigating palace intrigue and ancient traps. Balances honor with survival, making calculated decisions between duty and self-preservation.",
      evil: "Ruthless prince consumed by the Sands of Time. Uses acrobatic prowess and blade mastery to seize power, viewing others as obstacles to destiny."
    },
    defaultTone: "good",
    unlocked: false,
    unlockCondition: "Beat Level 1 of Prince of Persia in the terminal arcade..."
  },
};

// Alias mappings for character lookup
const characterAliases = {
  "pixl": "pixldrift",
  "pixl_drift": "pixldrift",
  "pixldrift": "pixldrift",
  "spudnik": "spudnik",
  "steve": "steve",
  "rik": "rik",
  "prince": "prince",
  "the prince": "prince",
  "persia": "prince",
};

// Get character config by ID (handles aliases)
function getCharacterConfig(characterId) {
  const normalizedId = characterId.toLowerCase().replace(/[^a-z0-9_]/g, "");
  const mappedId = characterAliases[normalizedId] || normalizedId;
  return characterConfig[mappedId] || null;
}

// Calculate player tone based on choice history
// Choices are indexed 1-3 where: 1=Good, 2=Neutral, 3=Evil
function calculatePlayerTone(previousChoices) {
  if (!previousChoices || previousChoices.length === 0) {
    return "neutral";
  }

  let score = 0;
  previousChoices.forEach(choice => {
    const choiceNum = typeof choice === 'object' ? choice.choice : choice;
    if (choiceNum === 1) score += 1;      // Good choice
    else if (choiceNum === 2) score += 0;  // Neutral choice
    else if (choiceNum === 3) score -= 1;  // Evil choice
  });

  const avgScore = score / previousChoices.length;
  if (avgScore > 0.3) return "good";
  if (avgScore < -0.3) return "evil";
  return "neutral";
}

// Sanitize story text for DALL-E content policy compliance
function sanitizePromptForDallE(text) {
  // Words/phrases that trigger content policy - map to safe alternatives
  const replacements = {
    // Violence-related
    'zombie': 'mysterious creature',
    'zombies': 'mysterious creatures',
    'attack': 'confront',
    'attacked': 'confronted',
    'attacking': 'confronting',
    'kill': 'defeat',
    'killed': 'defeated',
    'killing': 'defeating',
    'murder': 'eliminate',
    'blood': 'energy',
    'bloody': 'intense',
    'death': 'peril',
    'dead': 'fallen',
    'die': 'fall',
    'dying': 'fading',
    'weapon': 'tool',
    'weapons': 'tools',
    'sword': 'blade',
    'gun': 'device',
    'shoot': 'aim',
    'stab': 'strike',
    'wound': 'mark',
    'gore': 'damage',
    'violent': 'intense',
    'violence': 'conflict',
    'fight': 'clash',
    'fighting': 'clashing',
    'battle': 'showdown',
    'war': 'conflict',
    'destroy': 'overcome',
    'explosion': 'burst of light',
    'explode': 'burst',
    // Horror-related
    'monster': 'creature',
    'monsters': 'creatures',
    'demon': 'shadow entity',
    'demons': 'shadow entities',
    'evil': 'dark',
    'terror': 'tension',
    'horror': 'mystery',
    'scary': 'mysterious',
    'creepy': 'eerie',
    'nightmare': 'dream',
    // Other potentially flagged terms
    'corpse': 'fallen figure',
    'skeleton': 'ancient remains',
    'skull': 'symbol',
  };

  let sanitized = text.toLowerCase();
  for (const [term, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    sanitized = sanitized.replace(regex, replacement);
  }

  return sanitized;
}

// ===================
// SCENE-FOCUSED COMIC ART GENERATION
// ===================

// Camera angles matched to scene type
const CAMERA_ANGLES = {
  largeThreat: 'dramatic low angle shot looking up',
  discovery: 'wide establishing shot',
  action: 'dynamic dutch angle',
  conversation: 'medium two-shot',
  exploration: 'sweeping wide angle',
  tension: 'tight claustrophobic framing',
  triumph: 'heroic low angle',
  default: 'cinematic medium shot'
};

// Extract scene elements from story text
function extractSceneElements(storyText) {
  const sanitized = sanitizePromptForDallE(storyText);
  const lower = sanitized.toLowerCase();

  // === KEY ENTITIES ===
  // Look for creatures, NPCs, objects that should be VISIBLE in the scene
  const entityPatterns = [
    // Creatures/monsters
    { pattern: /golem/i, desc: 'massive golem constructed of angular blocks' },
    { pattern: /dragon/i, desc: 'fearsome dragon with scales and wings' },
    { pattern: /sprite|sprites/i, desc: 'tiny luminescent sprites with delicate wings' },
    { pattern: /zombie|zombies/i, desc: 'shambling undead creatures' },
    { pattern: /skeleton|skeletons/i, desc: 'animated skeletal warriors' },
    { pattern: /creeper/i, desc: 'green blocky creeper creature' },
    { pattern: /enderman/i, desc: 'tall dark enderman with purple eyes' },
    { pattern: /wolf|wolves/i, desc: 'wild wolves' },
    { pattern: /spider/i, desc: 'giant spider with multiple eyes' },
    { pattern: /villager|villagers/i, desc: 'villagers in robes' },
    { pattern: /robot|droid|drone/i, desc: 'sleek robotic drones' },
    { pattern: /guard|guards|soldier/i, desc: 'armored guards' },
    { pattern: /merchant|trader/i, desc: 'mysterious merchant figure' },
    { pattern: /wizard|mage|sorcerer/i, desc: 'robed magic user with glowing hands' },
    { pattern: /ghost|spirit/i, desc: 'ethereal ghostly apparition' },
    { pattern: /giant/i, desc: 'towering giant figure' },
    { pattern: /crowd|group|mob/i, desc: 'gathered crowd of figures' },
    // Objects
    { pattern: /portal/i, desc: 'swirling magical portal' },
    { pattern: /treasure|chest/i, desc: 'ornate treasure chest' },
    { pattern: /turnip|turnips/i, desc: 'arranged glowing turnips' },
    { pattern: /crystal/i, desc: 'luminous crystal formations' },
    { pattern: /terminal|computer|mainframe/i, desc: 'massive holographic terminal display' },
    { pattern: /vehicle|car|bike/i, desc: 'futuristic vehicle' },
  ];

  let keyEntities = [];
  for (const { pattern, desc } of entityPatterns) {
    if (pattern.test(sanitized)) {
      keyEntities.push(desc);
    }
  }

  // === ENVIRONMENT ===
  const environments = {
    cave: 'deep underground cave with glowing crystals and stalactites',
    mine: 'dark mineshaft with wooden supports and ore veins',
    forest: 'dense enchanted forest with towering ancient trees',
    woods: 'mysterious woodland with dappled sunlight',
    clearing: 'moonlit forest clearing with soft grass',
    village: 'rustic village with wooden buildings',
    city: 'sprawling neon-lit cyberpunk cityscape',
    street: 'rain-slicked urban street reflecting neon signs',
    alley: 'dark narrow alley between towering buildings',
    farm: 'pastoral farmland with rolling hills',
    barn: 'rustic wooden barn interior with hay bales',
    cellar: 'dim underground cellar with wooden crates',
    mountain: 'dramatic mountain peaks against stormy sky',
    ocean: 'vast churning ocean with massive waves',
    beach: 'sandy shoreline with crashing waves',
    desert: 'endless sand dunes under harsh sun',
    swamp: 'murky swamp with twisted trees and fog',
    castle: 'imposing stone castle with tall towers',
    dungeon: 'dark stone dungeon with chains and torches',
    temple: 'ancient temple with mysterious symbols',
    tower: 'tall tower interior with spiral stairs',
    rooftop: 'city rooftop overlooking urban sprawl',
    space: 'vast starfield with distant planets',
    nether: 'hellish landscape with lava and fire',
    end: 'void dimension with floating islands',
    laboratory: 'high-tech laboratory with glowing screens',
    warehouse: 'industrial warehouse with stacked crates',
  };

  let environment = 'dramatic atmospheric environment';
  for (const [keyword, desc] of Object.entries(environments)) {
    if (lower.includes(keyword)) {
      environment = desc;
      break;
    }
  }

  // === ACTION ===
  const actions = {
    fight: 'intense confrontation',
    battle: 'chaotic battle scene',
    attack: 'moment of attack',
    chase: 'high-speed chase',
    run: 'fleeing in motion',
    hide: 'hiding in shadows',
    sneak: 'stealthy approach',
    discover: 'moment of discovery',
    explore: 'cautious exploration',
    talk: 'tense conversation',
    negotiate: 'diplomatic standoff',
    climb: 'precarious climbing',
    fall: 'dramatic falling',
    fly: 'soaring through air',
    swim: 'underwater movement',
    build: 'construction in progress',
    craft: 'crafting at workbench',
    hack: 'digital infiltration',
    cast: 'magical spell casting',
    summon: 'mystical summoning ritual',
  };

  let action = 'dramatic scene';
  for (const [keyword, desc] of Object.entries(actions)) {
    if (lower.includes(keyword)) {
      action = desc;
      break;
    }
  }

  // === SCALE (look for size descriptors) ===
  let scale = 'normal';
  if (/giant|massive|huge|towering|enormous|colossal/i.test(sanitized)) {
    scale = 'large';
  } else if (/tiny|small|little|miniature|swarm|dozens|hundreds/i.test(sanitized)) {
    scale = 'small_many';
  }

  // === EMOTION/MOOD ===
  const emotions = {
    terror: { words: ['terror', 'horror', 'fear', 'dread', 'panic'], mood: 'terrifying atmosphere with harsh shadows' },
    joy: { words: ['joy', 'happy', 'delight', 'celebrat', 'laugh'], mood: 'joyful warm lighting' },
    mystery: { words: ['mystery', 'strange', 'curious', 'wonder', 'secret'], mood: 'mysterious ethereal atmosphere' },
    tension: { words: ['tense', 'danger', 'threat', 'confront', 'standoff'], mood: 'tense dramatic lighting' },
    triumph: { words: ['victory', 'triumph', 'succeed', 'win', 'hero'], mood: 'triumphant golden lighting' },
    sadness: { words: ['sad', 'loss', 'mourn', 'grief', 'lonely'], mood: 'melancholic blue-tinted atmosphere' },
    anger: { words: ['anger', 'rage', 'fury', 'wrath'], mood: 'intense red-accented lighting' },
  };

  let mood = 'cinematic dramatic lighting';
  for (const [, { words, mood: moodDesc }] of Object.entries(emotions)) {
    if (words.some(w => lower.includes(w))) {
      mood = moodDesc;
      break;
    }
  }

  // === CAMERA ANGLE based on scene type ===
  let cameraAngle = CAMERA_ANGLES.default;
  if (scale === 'large') {
    cameraAngle = CAMERA_ANGLES.largeThreat;
  } else if (action.includes('discovery') || action.includes('exploration')) {
    cameraAngle = CAMERA_ANGLES.discovery;
  } else if (action.includes('battle') || action.includes('chase') || action.includes('attack')) {
    cameraAngle = CAMERA_ANGLES.action;
  } else if (action.includes('conversation') || action.includes('standoff')) {
    cameraAngle = CAMERA_ANGLES.conversation;
  }

  return {
    keyEntities,
    environment,
    action,
    scale,
    mood,
    cameraAngle
  };
}

// Build scene-focused image prompt
// Template: [Art style], [camera angle], [scene with KEY ENTITIES and CHARACTER in proper scale], [action], [environment], [mood], comic panel, no text
function buildSceneFocusedPrompt(config, storyText, playerTone) {
  const scene = extractSceneElements(storyText);

  // Build entity description
  let entityDesc = '';
  if (scene.keyEntities.length > 0) {
    entityDesc = scene.keyEntities.slice(0, 3).join(' and '); // Max 3 entities
  }

  // Character description for scene (shorter, as part of scene)
  const characterDesc = config.characterInScene;

  // Build the scene description based on scale
  let sceneDesc;
  if (scene.scale === 'large' && entityDesc) {
    // Large entity - character is small in frame
    sceneDesc = `${entityDesc} looming over ${characterDesc} who stands defiantly below`;
  } else if (scene.scale === 'small_many' && entityDesc) {
    // Many small entities - swirling around character
    sceneDesc = `${entityDesc} swirling around ${characterDesc}`;
  } else if (entityDesc) {
    // Normal scale - character and entities interact
    sceneDesc = `${characterDesc} facing ${entityDesc}`;
  } else {
    // No special entities - focus on character in environment
    sceneDesc = `${characterDesc} in ${scene.action}`;
  }

  // Construct final prompt
  // [Art style], [camera angle], [scene description], [environment], [mood], comic panel, no text
  const prompt = `${config.artStyle}, ${scene.cameraAngle}, ${sceneDesc}, ${scene.environment}, ${scene.mood}, cinematic comic book panel composition, no text no speech bubbles`;

  return prompt;
}

// Build fallback prompt (simpler, for content policy retries)
function buildFallbackPrompt(config, playerTone) {
  const moodMap = {
    good: 'heroic determined stance',
    neutral: 'alert ready stance',
    evil: 'menacing powerful stance'
  };
  const stance = moodMap[playerTone] || moodMap.neutral;

  return `${config.artStyle}, dramatic cinematic shot, ${config.characterInScene} in ${stance}, atmospheric environment, dramatic lighting, comic book panel, no text`;
}

// Helper function to generate comic art using OpenAI Images
async function generateComicArt(storyText, character, previousChoices = []) {
  const config = getCharacterConfig(character);
  const playerTone = calculatePlayerTone(previousChoices);

  let primaryPrompt;
  let fallbackPrompt;

  if (config) {
    console.log(`[API] Character: ${config.name}, Tone: ${playerTone}`);

    // Extract scene elements for logging
    const scene = extractSceneElements(storyText);
    console.log(`[API] Scene elements:`, {
      entities: scene.keyEntities,
      environment: scene.environment.substring(0, 30) + '...',
      action: scene.action,
      scale: scene.scale
    });

    primaryPrompt = buildSceneFocusedPrompt(config, storyText, playerTone);
    fallbackPrompt = buildFallbackPrompt(config, playerTone);
  } else {
    console.log(`[API] Unknown character: ${character}, using default style`);
    const sanitized = sanitizePromptForDallE(storyText).substring(0, 150);
    primaryPrompt = `Comic book style art, dramatic cinematic shot, ${sanitized}, atmospheric environment, dramatic lighting, comic book panel, no text`;
    fallbackPrompt = `Comic book style art, dramatic scene, atmospheric lighting, comic panel composition, no text`;
  }

  console.log("[API] Generating comic art with DALL-E 3...");
  console.log("[API] Primary prompt:", primaryPrompt.substring(0, 150) + "...");

  // Try primary prompt first, fall back to simpler prompt on content policy error
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: primaryPrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    return response.data[0].url;
  } catch (error) {
    const isContentPolicy = error.message?.includes('content_policy') ||
                           error.code === 'content_policy_violation' ||
                           error.status === 400;

    if (isContentPolicy) {
      console.warn("[API] Content policy violation, trying fallback prompt...");
      console.log("[API] Fallback prompt:", fallbackPrompt);

      try {
        const fallbackResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: fallbackPrompt,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        });
        return fallbackResponse.data[0].url;
      } catch (fallbackError) {
        console.error("[API] Fallback also failed:", fallbackError.message);
        throw fallbackError;
      }
    }

    console.error("Error generating comic art:", error);
    throw error;
  }
}

// Story generation endpoint
app.post("/api/generate-story", async (req, res) => {
  try {
    const { character, pageNumber, previousChoices, previousStory } = req.body;
    console.log("[API] Request received:", {
      character,
      pageNumber,
      previousChoices,
    });

    if (!character) {
      return res.status(400).json({ error: "Character not provided" });
    }
    
    // Get character configuration for enhanced storytelling
    const charConfig = getCharacterConfig(character);
    const playerTone = calculatePlayerTone(previousChoices);

    // Build character context for the AI
    let characterContext = "";
    let toneGuidance = "";

    if (charConfig) {
      characterContext = `Character: ${charConfig.name}
Appearance: ${charConfig.characterInScene}
Art Style Context: ${charConfig.artStyle}`;

      toneGuidance = `The player's current moral alignment is "${playerTone}".
Character's ${playerTone} personality: ${charConfig.tone[playerTone]}
Reflect this tone subtly in the narrative and how the character reacts to situations.`;
    }

    // Story arc structure (8 pages total)
    // Act 1 - Setup (pages 1-2): World building and inciting incident
    // Act 2 - Conflict (pages 3-5): Escalating challenges and complications
    // Act 3 - Resolution (pages 6-8): Climax and conclusion
    const pacingGuidance = {
      // ACT 1: SETUP
      1: "ARC: ACT 1 - SETUP. This is the HOOK. Establish the world quickly (2-3 sentences max), then END with an inciting incident that DEMANDS action. The protagonist should be propelled into adventure by the end of this page.",
      2: "ARC: ACT 1 - SETUP. The adventure has BEGUN. The protagonist is now in a NEW location or situation. Introduce a key character, obstacle, or discovery that will matter later. Do NOT repeat the opening setting.",

      // ACT 2: CONFLICT
      3: "ARC: ACT 2 - CONFLICT BEGINS. The protagonist faces their first REAL challenge - genuine danger, a difficult moral choice, or an unexpected complication. Something goes wrong. Stakes become clear.",
      4: "ARC: ACT 2 - ESCALATION. Raise the stakes significantly. A new threat emerges, an ally may betray them, or the situation gets much worse. The protagonist is in over their head. Introduce a key item, ally, or piece of information.",
      5: "ARC: ACT 2 - MIDPOINT TWIST. Deliver a major revelation or unexpected turn that reframes everything. The protagonist must adapt their approach. This is the point of no return.",

      // ACT 3: RESOLUTION
      6: "ARC: ACT 3 - RESOLUTION BEGINS. Begin moving toward the climax. The protagonist gathers allies, resources, or courage for the final confrontation. Past choices start showing their consequences.",
      7: "ARC: ACT 3 - CLIMAX. The major confrontation or challenge. Everything the protagonist has learned and every choice they've made leads to this moment. High stakes, intense action or emotion.",
      8: "ARC: ACT 3 - FINALE. Deliver a SATISFYING CONCLUSION. Show the consequences of the player's choices and moral alignment. Give the protagonist growth or change. End with a sense of closure (triumphant, bittersweet, or dark based on their journey). This is the FINAL page - no choices needed, write an ending."
    };

    // Check if this is the final page
    const isFinalPage = pageNumber >= 8;

    // Build a dynamic prompt based on the page number and previous choices
    let prompt = "";
    if (pageNumber === 1) {
      prompt = `You are writing an interactive comic book story for Digital Dreamers.

${characterContext}

The reader has chosen to play as ${charConfig ? charConfig.name : character}.

${pacingGuidance[1]}

=== CRITICAL PACING RULES ===
- Every page MUST advance the plot significantly: new location, new character, new challenge, or major revelation
- The opening should be BRIEF (2-3 sentences of setup max), then something happens that forces action
- End the page with the protagonist about to DO something, not still contemplating

=== CHOICE RULES ===
- Each choice leads to a DIFFERENT situation, not variations of the same scene
- One choice: direct/bold action. One choice: clever/indirect approach. One choice: chaotic/selfish move.
- ALL choices must ADVANCE the story - no "wait and see" or "go back" options
- Choices should lead to different LOCATIONS or ENCOUNTERS, not just different attitudes

Write the opening scene (1-2 SHORT paragraphs) that establishes the world, then IMMEDIATELY thrusts the protagonist into action.

Format the response exactly like this:
STORY:
[Your story text here]

CHOICES:
1. [Bold/heroic action that moves forward]
2. [Clever/pragmatic action that moves forward differently]
3. [Chaotic/selfish action that still moves the plot]`;
    } else if (isFinalPage) {
      // FINAL PAGE - No choices, just a satisfying conclusion
      const choicesText = (previousChoices && previousChoices.length)
        ? previousChoices.map(c => `Choice ${c.choice}`).join(", ")
        : "None";
      const prevStory = previousStory || "No previous story.";

      prompt = `You are writing the FINALE of an interactive comic book story for Digital Dreamers.

${characterContext}

${toneGuidance}

This is the FINAL PAGE (page ${pageNumber}) of ${charConfig ? charConfig.name : character}'s story.
The complete story so far: ${prevStory}
All choices made during the journey: ${choicesText}

${pacingGuidance[8]}

=== FINALE REQUIREMENTS ===
- This is the END. Write a satisfying conclusion (2-3 paragraphs)
- Show the CONSEQUENCES of the player's choices throughout the adventure
- Reflect their moral alignment (${playerTone}) in how the story resolves
- Give the protagonist growth, change, or realization based on their journey
- End with a sense of CLOSURE - this adventure is complete

=== ENDING TONE BASED ON ALIGNMENT ===
- Good alignment: Triumphant, hopeful, heroic resolution
- Neutral alignment: Bittersweet, pragmatic, complex resolution
- Evil alignment: Dark, pyrrhic victory, or cautionary resolution

=== DO NOT ===
- Leave cliffhangers or unresolved threads
- Offer more choices - this is THE END
- Rush the ending - give it emotional weight

Write the finale (2-3 paragraphs) that brings this adventure to a satisfying close.

Format the response exactly like this:
STORY:
[Your finale text here - make it memorable]

THE END`;
    } else {
      // REGULAR CONTINUATION (pages 2-7)
      const choicesText = (previousChoices && previousChoices.length)
        ? previousChoices.map(c => `Choice ${c.choice}`).join(", ")
        : "None";
      const prevStory = previousStory || "No previous story.";
      const currentPacing = pacingGuidance[pageNumber] || pacingGuidance[5];

      // Add arc-specific instructions
      let arcInstructions = "";
      if (pageNumber <= 2) {
        arcInstructions = "ACT 1 FOCUS: Establish key characters, setting, and the central conflict. Plant seeds for later payoffs.";
      } else if (pageNumber <= 5) {
        arcInstructions = "ACT 2 FOCUS: Escalate conflict, introduce complications, test the protagonist. Each choice should have meaningful consequences.";
      } else {
        arcInstructions = "ACT 3 FOCUS: Begin resolving threads. Past choices matter now. Move toward the climax with purpose.";
      }

      prompt = `You are continuing the interactive comic book story for Digital Dreamers.

${characterContext}

${toneGuidance}

This is page ${pageNumber} of 8 in ${charConfig ? charConfig.name : character}'s story.
The story so far: ${prevStory}
Previous choices made: ${choicesText}

${currentPacing}

${arcInstructions}

=== CRITICAL PACING RULES ===
- This page MUST be in a NEW situation from the previous page - new location, new character present, or new challenge
- NEVER repeat the same setting for more than 1 page unless something DRAMATIC happens there
- Move the plot FORWARD - things happen, situations change, stakes rise
- Keep paragraphs SHORT and punchy - this is a comic book, not a novel

=== CHOICE RULES ===
- Each choice leads to a genuinely DIFFERENT next scene
- FORBIDDEN: "wait and observe", "go back", "think about it more", or any passive option
- ALL three choices must result in ACTION and FORWARD MOVEMENT
- Choices should lead to different locations, different characters, or different approaches with different consequences

Continue the story (1-2 SHORT paragraphs) with significant plot advancement. The narrative should reflect the player's moral trajectory.

Format the response exactly like this:
STORY:
[Your story text here - something NEW must happen]

CHOICES:
1. [Bold action leading to situation A]
2. [Clever action leading to situation B]
3. [Chaotic action leading to situation C]`;
    }

    console.log("[API] Sending prompt to Anthropic API...");
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[API Error]:", error);
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    console.log("[API] Response received from Anthropic");

    if (
      !data.content ||
      !Array.isArray(data.content) ||
      data.content.length === 0
    ) {
      console.error("[API Error]: Invalid response format", data);
      return res.status(500).json({ error: "Invalid response from Anthropic API" });
    }

    const responseText = data.content[0].text;
    console.log("Response text from Anthropic:", responseText);

    // Parse response differently for finale vs regular pages
    let storyText;
    let choices = [];

    if (isFinalPage) {
      // Finale page - no choices, look for "THE END" marker
      storyText = responseText
        .replace("STORY:", "")
        .replace("THE END", "")
        .trim();
      choices = []; // No choices on finale
      console.log("[API] Finale page - no choices");
    } else {
      // Regular page - parse choices
      const [storySection, choicesSection] = responseText.split("CHOICES:");
      storyText = storySection.replace("STORY:", "").trim();
      choices = choicesSection
        ? choicesSection
            .trim()
            .split("\n")
            .filter((choice) => choice.trim())
            .map((choice) => choice.replace(/^\d+\.\s*/, "").trim())
        : [];
    }

    // Add references if there were previous playthroughs
    const previousPlaythroughs = await checkPreviousPlaythroughs(character);
    if (previousPlaythroughs > 0 && pageNumber === 1) {
      storyText = addPreviousPlaythroughReferences(storyText, previousPlaythroughs);
    }

    // Generate comic art with tone awareness
    let imageUrl = null;
    try {
      console.log("[API] Generating comic art...");
      imageUrl = await generateComicArt(storyText, character, previousChoices);
    } catch (imageError) {
      console.error("Comic art generation failed:", imageError);
    }

    // Store story data if sessionId exists
    if (req.body.sessionId) {
      await storeStoryData(
        req.body.sessionId,
        pageNumber,
        storyText,
        choices,
        imageUrl
      );
    }

    res.json({
      storyText,
      choices,
      imageUrl,
      previousPlaythroughs,
      isFinalPage,
      totalPages: 8,
      currentArc: pageNumber <= 2 ? "setup" : pageNumber <= 5 ? "conflict" : "resolution"
    });
  } catch (error) {
    console.error("[Server Error]:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});


// Save player choice endpoint
app.post("/api/save-choice", async (req, res) => {
  const { sessionId, pageNumber, choiceIndex } = req.body;

  db.run(
    `UPDATE story_choices 
     SET choice_made = ? 
     WHERE session_id = ? AND page_number = ?`,
    [choiceIndex, sessionId, pageNumber],
    (err) => {
      if (err) {
        console.error("Error saving choice:", err);
        res.status(500).json({ error: "Failed to save choice" });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Story retrieval endpoint
app.get("/api/story/:sessionId/:pageNumber", async (req, res) => {
  const { sessionId, pageNumber } = req.params;

  db.get(
    `SELECT * FROM story_choices 
     WHERE session_id = ? AND page_number = ?`,
    [sessionId, pageNumber],
    (err, row) => {
      if (err) {
        console.error("Error retrieving story:", err);
        res.status(500).json({ error: "Database error" });
      } else if (!row) {
        res.status(404).json({ error: "Story not found" });
      } else {
        res.json({
          storyId: row.id,
          storyText: row.story_text,
          choices: [row.choice1_text, row.choice2_text, row.choice3_text],
          imageUrl: row.image_url,
        });
      }
    }
  );
});

// Helper function to generate story prompts based on page number
function generateStoryPrompt(character, pageNumber, previousChoices) {
  const choicesHistory = previousChoices
    ? previousChoices.map((c) => c.choice).join(", ")
    : "none";

  switch (pageNumber) {
    case 2:
      return `Continue the Digital Dreamers story for ${character}. This is page 2 where we further develop the conflict. Their previous choice was: ${choicesHistory}. 
              Write 1-2 paragraphs advancing the story and provide 3 new choices that build on their previous decision.`;
    case 3:
      return `Continue the Digital Dreamers story for ${character}. This is page 3 where they face their first major challenge. Their previous choices were: ${choicesHistory}. 
              Write 1-2 paragraphs about their encounter and provide 3 choices for how to handle it.`;
    case 4:
      return `Continue the Digital Dreamers story for ${character}. This is page 4 - the climax. Based on their previous choices: ${choicesHistory}, 
              write 1-2 paragraphs about their final challenge and provide 3 possible resolutions.`;
    case 5:
      return `Conclude the Digital Dreamers story for ${character}. This is page 5 - the resolution. Based on their journey (choices: ${choicesHistory}), 
              write 1-2 paragraphs wrapping up their story and provide 3 choices for their final decision that hints at future adventures.`;
    default:
      return `You are writing an interactive comic book story for Digital Dreamers. The reader has chosen to play as ${character}. 
              Write the opening scene of their story (1-2 paragraphs) and provide 3 distinct choices for how they could proceed.`;
  }
}

// Helper function to check previous playthroughs
async function checkPreviousPlaythroughs(character) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(DISTINCT id) as count 
       FROM game_sessions 
       WHERE character_type = ? AND current_page = 5`,
      [character],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.count : 0);
      }
    );
  });
}

// Helper function to add roguelite elements
function addPreviousPlaythroughReferences(storyText, playthroughCount) {
  const references = [
    "A sense of déjà vu washes over you...",
    "You've been here before, though something feels different this time...",
    "The digital realm seems to remember your previous adventures...",
    "Echoes of past decisions ripple through the code...",
  ];

  return `${references[playthroughCount % references.length]} ${storyText}`;
}

// Helper function to store story data
async function storeStoryData(
  sessionId,
  pageNumber,
  storyText,
  choices,
  imageUrl
) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO story_choices (
        session_id, 
        page_number, 
        story_text, 
        choice1_text, 
        choice2_text, 
        choice3_text, 
        image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [
        sessionId,
        pageNumber,
        storyText,
        choices[0],
        choices[1],
        choices[2],
        imageUrl,
      ],
      function (err) {
        if (err) {
          console.error("Error storing story data:", err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

// ===================
// STORY SUMMARY & ACHIEVEMENTS API
// ===================

// Generate story summary endpoint
app.post("/api/generate-summary", async (req, res) => {
  try {
    const { character, storyHistory, previousChoices, moralAlignment } = req.body;

    console.log("[API] Generating story summary for:", character);

    const charConfig = getCharacterConfig(character);
    const characterName = charConfig ? charConfig.name : character;

    // Build the full story text
    const fullStory = Array.isArray(storyHistory) ? storyHistory.join("\n\n") : storyHistory;
    const choicesSummary = previousChoices
      ? previousChoices.map((c, i) => `Page ${i + 1}: Choice ${c.choice}`).join(", ")
      : "No choices recorded";

    const prompt = `You are summarizing a completed interactive comic book adventure from Digital Dreamers.

CHARACTER: ${characterName}
MORAL ALIGNMENT: ${moralAlignment}
CHOICES MADE: ${choicesSummary}

FULL STORY:
${fullStory}

Please provide:
1. A fun, comic-book style TITLE for this specific adventure (like "The Quantum Turnip Caper" or "Neon Shadows: A Pixldrift Story")
2. A 2-3 sentence SUMMARY capturing the key moments, the hero's journey, and how their choices shaped the outcome

Format your response exactly like this:
TITLE: [Your creative adventure title]
SUMMARY: [Your 2-3 sentence summary]`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[API] Summary generation error:", error);
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const responseText = data.content[0].text;

    // Parse the response
    const titleMatch = responseText.match(/TITLE:\s*(.+)/i);
    const summaryMatch = responseText.match(/SUMMARY:\s*(.+)/is);

    const adventureTitle = titleMatch ? titleMatch[1].trim() : `${characterName}'s Adventure`;
    const summary = summaryMatch ? summaryMatch[1].trim() : responseText;

    console.log("[API] Generated summary:", { adventureTitle, summary: summary.substring(0, 100) + "..." });

    res.json({
      adventureTitle,
      summary,
      character: characterName,
      moralAlignment
    });
  } catch (error) {
    console.error("[API] Summary generation failed:", error);
    res.status(500).json({ error: "Failed to generate summary", details: error.message });
  }
});

// Complete story and check achievements endpoint
app.post("/api/complete-story", async (req, res) => {
  try {
    const {
      playerId,
      character,
      moralAlignment,
      storySummary,
      adventureTitle,
      durationSeconds
    } = req.body;

    console.log("[API] Completing story:", { playerId, character, moralAlignment });

    // Store the completed playthrough
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO completed_playthroughs
         (player_id, character_type, moral_alignment, story_summary, adventure_title, duration_seconds)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [playerId, character, moralAlignment, storySummary, adventureTitle, durationSeconds],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // Check and award achievements
    const newAchievements = [];

    // Helper to check if achievement already exists
    const hasAchievement = async (achievementId) => {
      return new Promise((resolve, reject) => {
        db.get(
          `SELECT id FROM achievements WHERE player_id = ? AND achievement_type = ?`,
          [playerId, achievementId],
          (err, row) => {
            if (err) reject(err);
            else resolve(!!row);
          }
        );
      });
    };

    // Helper to award achievement
    const awardAchievement = async (achievementId) => {
      const achievement = ACHIEVEMENTS[achievementId];
      if (!achievement) return;

      const alreadyHas = await hasAchievement(achievementId);
      if (alreadyHas) return;

      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO achievements (player_id, achievement_type, achievement_name)
           VALUES (?, ?, ?)`,
          [playerId, achievementId, achievement.name],
          (err) => {
            if (err) reject(err);
            else {
              newAchievements.push(achievement);
              resolve();
            }
          }
        );
      });
    };

    // Check: First Steps (first completion)
    const completionCount = await new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count FROM completed_playthroughs WHERE player_id = ?`,
        [playerId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? row.count : 0);
        }
      );
    });

    if (completionCount === 1) {
      await awardAchievement('first_steps');
    }

    // Check: Moral alignment achievements
    if (moralAlignment === 'good') {
      await awardAchievement('heros_path');
    } else if (moralAlignment === 'evil') {
      await awardAchievement('dark_journey');
    } else if (moralAlignment === 'neutral') {
      await awardAchievement('balanced_soul');
    }

    // Check: Speed achievements
    if (durationSeconds && durationSeconds < 600) { // Under 10 minutes
      await awardAchievement('speed_runner');
    }
    if (durationSeconds && durationSeconds > 1800) { // Over 30 minutes
      await awardAchievement('deep_thinker');
    }

    // Check: Character mastery (3 completions with same character)
    const characterCompletions = await new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count FROM completed_playthroughs
         WHERE player_id = ? AND character_type = ?`,
        [playerId, character],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? row.count : 0);
        }
      );
    });

    if (characterCompletions >= 3) {
      const masteryId = `${character.toLowerCase()}_master`;
      if (ACHIEVEMENTS[masteryId]) {
        await awardAchievement(masteryId);
      }
    }

    // Check: Completionist (completed with all characters)
    const uniqueCharacters = await new Promise((resolve, reject) => {
      db.all(
        `SELECT DISTINCT character_type FROM completed_playthroughs WHERE player_id = ?`,
        [playerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows ? rows.map(r => r.character_type) : []);
        }
      );
    });

    const requiredCharacters = ['pixldrift', 'spudnik', 'steve'];
    const hasAllCharacters = requiredCharacters.every(c =>
      uniqueCharacters.some(uc => uc.toLowerCase().includes(c))
    );

    if (hasAllCharacters) {
      await awardAchievement('completionist');
    }

    // Get all player achievements
    const allAchievements = await new Promise((resolve, reject) => {
      db.all(
        `SELECT achievement_type, achievement_name, unlocked_at FROM achievements WHERE player_id = ?`,
        [playerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    // Map to full achievement data
    const achievementsWithDetails = allAchievements.map(a => ({
      ...ACHIEVEMENTS[a.achievement_type],
      unlockedAt: a.unlocked_at
    }));

    res.json({
      success: true,
      newAchievements,
      allAchievements: achievementsWithDetails,
      totalCompletions: completionCount
    });
  } catch (error) {
    console.error("[API] Complete story failed:", error);
    res.status(500).json({ error: "Failed to complete story", details: error.message });
  }
});

// Get player achievements endpoint
app.get("/api/achievements/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;

    const achievements = await new Promise((resolve, reject) => {
      db.all(
        `SELECT achievement_type, achievement_name, unlocked_at FROM achievements WHERE player_id = ?`,
        [playerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    const achievementsWithDetails = achievements.map(a => ({
      ...ACHIEVEMENTS[a.achievement_type],
      unlockedAt: a.unlocked_at
    }));

    // Also get completion stats
    const stats = await new Promise((resolve, reject) => {
      db.get(
        `SELECT
          COUNT(*) as totalCompletions,
          COUNT(DISTINCT character_type) as uniqueCharacters
         FROM completed_playthroughs WHERE player_id = ?`,
        [playerId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row || { totalCompletions: 0, uniqueCharacters: 0 });
        }
      );
    });

    res.json({
      achievements: achievementsWithDetails,
      stats,
      availableAchievements: Object.values(ACHIEVEMENTS)
    });
  } catch (error) {
    console.error("[API] Get achievements failed:", error);
    res.status(500).json({ error: "Failed to get achievements" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
});
