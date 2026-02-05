# Digital Dreamers - Retro Playground Universe
## Master Task List v2

**Last Updated:** February 5, 2026  
**Status:** Active Development  
**Repo:** https://github.com/sobercrypto/DDv2

---

## Project Vision

The bedroom isn't just a menu - it's a living world. Every object is a portal to infinite experiences. Digital Dreamers is a retro playground where users can:
- Play AI-generated comic book adventures
- Explore mini-games and hidden secrets
- Unlock characters through puzzles and achievements
- Raise virtual pets
- Create mutant creatures
- Discover easter eggs and cross-references between experiences

---

## ✅ COMPLETED

### Phase 1: Core Game Revival
- [x] Fix OpenAI model name (dall-e-3)
- [x] Fix stylesheet paths in index.html
- [x] Add pageNumber to API requests
- [x] Create assets/sounds folder structure
- [x] Comment out broken /games/ links
- [x] Server running on localhost:3000

### Phase 2: Character System
- [x] Implement character configuration system
- [x] **Pixldrift** - Neon cyberpunk aesthetic (active)
- [x] **Spudnik** - Studio Ghibli meets Pixar (active)
- [x] **Steve** - Minecraft voxel art (active)
- [x] **Rik** - Occult-tech hacker (configured, locked)
- [x] Remove Fifi (reserved due to dev departure)
- [x] Character selection UI updated
- [x] Backwards compatibility aliases (pixl → pixldrift)

### Phase 3: Story & Art Improvements
- [x] DALL-E content policy sanitization (violence words filtered)
- [x] Story pacing rules (no wheel-spinning, advance every page)
- [x] Image container fix (object-fit: contain, aspect-ratio)
- [x] Dynamic scene composition (show environment, not just character)
- [x] Detailed art style prompts per character
- [x] Scene extraction from story text

---

## 🔄 IN PROGRESS

### Phase 4: Story System Enhancements

#### 4.1 Story Arc Structure
- [ ] Extend stories from 5 pages to 8 pages
- [ ] Implement 3-act structure in prompts:
  - Pages 1-2: Setup (world + inciting incident)
  - Pages 3-5: Conflict (escalation, complications, stakes)
  - Pages 6-7: Climax (major confrontation/revelation)
  - Page 8: Resolution (satisfying ending based on choices)
- [ ] Final page instruction: "Deliver conclusion reflecting player's journey and moral alignment"

#### 4.2 Story Summary System
- [ ] Generate summary via Claude API after story ends
- [ ] Create adventure title (e.g., "Spudnik and the Moonlit Sprites")
- [ ] 2-3 sentence recap of key moments
- [ ] Display on back-of-comic summary page

#### 4.3 Achievement System
- [ ] Database schema for achievements
- [ ] Track and store achievements per player
- [ ] Achievement list:
  - "First Steps" - Complete first story
  - "Hero's Path" - Finish with good alignment
  - "Dark Journey" - Finish with evil alignment
  - "Balanced Soul" - Finish with neutral alignment
  - "Speed Runner" - Finish in under 10 minutes
  - "Deep Thinker" - Spend over 30 minutes
  - "Completionist" - Finish with each character
  - "[Character] Master" - Complete 3 stories with same character
- [ ] Display achievements on summary page

#### 4.4 Roguelite Memory System
- [ ] Store after each playthrough:
  - Character used
  - Moral alignment
  - Key entities encountered
  - Ending type
- [ ] Fetch previous runs on new playthrough
- [ ] Add to Claude prompt: "Reference past adventures as legends/rumors/deja vu"
- [ ] Subtle callbacks only - don't force it

#### 4.5 Summary Page Updates
- [ ] Display generated story title
- [ ] Show 2-3 sentence summary
- [ ] Moral alignment badge with icon
- [ ] Achievements unlocked THIS run (highlighted)
- [ ] Total achievements (all time)
- [ ] "Play Again" button
- [ ] "Choose New Character" button

---

## 📋 TODO

### Phase 5: Bedroom Universe Expansion

The retro bedroom becomes an explorable hub with interactive objects leading to different experiences.

#### 5.1 MS-DOS Terminal (PRIORITY)
**Status:** Ready for implementation  
**Spec:** See MSDOS_TERMINAL_SPEC.md

- [ ] Expand existing terminal.js into full CLI experience
- [ ] Welcome screen with boot sequence
- [ ] `/help` command with command list
- [ ] File system navigation (fake directories)
- [ ] ASCII art displays
- [ ] Hidden puzzles that unlock Rik
- [ ] Prince of Persia unlock pathway
- [ ] Easter eggs and secrets

#### 5.2 Interactive Poster System
- [ ] DOOM Poster
  - Play E1M1 riff (Web Audio API)
  - Screen flash effect
  - Eventually: mini demon shooter game
- [ ] Mario Poster
  - Coin sound effect
  - Fun quote/trivia popup
  - Eventually: one-button jump game
- [ ] Lords of Magic Poster (TODO - needs special treatment)
  - Placeholder for now
  - User has deep love for this game
  - Want to incorporate REAL game experience somehow
- [ ] Alien Logic Poster (TODO - needs special treatment)
  - Placeholder for now
  - Same as Lords of Magic - needs meaningful implementation

#### 5.3 Arcade Cabinet
- [ ] Snake game
- [ ] Breakout clone
- [ ] Space Invaders
- [ ] Shared high score system
- [ ] Retro cabinet UI wrapper

#### 5.4 Old Mac Computer
- [ ] Fake 1994 Mac OS desktop
- [ ] Clickable folders and files
- [ ] Fake emails from "Anthropic 1994"
- [ ] Hidden secrets in files

#### 5.5 Boombox / Stereo
- [ ] Chiptune jukebox
- [ ] Playlist of royalty-free 8-bit music
- [ ] Simple visualizer
- [ ] Track info display

#### 5.6 Mini Fridge
- [ ] Random item discovery
- [ ] "You found: Jolt Cola / old pizza / energy drink / mysterious floppy"
- [ ] Maybe items affect gameplay somehow?

---

### Phase 6: Deep Experiences

#### 6.1 Chemistry Set + TMNT Mutation Lab
- [ ] Creature mutation system
- [ ] Combine animals + chemicals = new mutants
- [ ] Persistent creature collection
- [ ] Could unlock mutant characters for comic adventures
- [ ] TMNT figures as base creatures

#### 6.2 Hidden Tamagotchi
- [ ] Find hidden object in room to unlock
- [ ] Virtual pet that persists across sessions
- [ ] Feed, play, watch it evolve
- [ ] Neglect consequences
- [ ] Maybe evolves into comic character?

#### 6.3 Explorable Room Expansion
- [ ] Multiple room views/areas
- [ ] D&D table zone (dice roller, character sheets, mini campaigns)
- [ ] Window with weather widget / time-of-day ambiance
- [ ] Poster wall with credits and links
- [ ] Navigation between areas (clickable hotspots or arrows)

---

### Phase 7: Unlock System & Meta Progression

#### 7.1 Character Unlocks
| Character | Unlock Method |
|-----------|---------------|
| Rik | Solve terminal puzzle (sigil/riddle based) |
| Prince of Persia | Find 5 hidden floppy disks around room |
| Tamagotchi Creature | Raise Tamagotchi to adult stage |
| Mutant Character | Create ultimate mutation in chem lab |
| Mystery Character | Beat comic with all 3 starter characters |

#### 7.2 Cross-Experience References
- [ ] Tamagotchi can appear in comic adventures
- [ ] Mutants you create show up as NPCs
- [ ] Terminal commands reference comic adventures
- [ ] Achievements visible across all experiences

---

### Phase 8: Polish & Deployment

#### 8.1 Visual Polish
- [ ] Loading states with retro animations
- [ ] Error pages (404, 500) with personality
- [ ] Favicon and meta tags
- [ ] Open Graph images for social sharing
- [ ] CRT scanline overlay option

#### 8.2 Audio Polish
- [ ] Hover sounds (optional)
- [ ] Click feedback
- [ ] Ambient room sounds?
- [ ] Music player persistent across navigation

#### 8.3 Deployment
- [ ] Choose host (Railway, Vercel, Render)
- [ ] Configure production database
- [ ] Set up environment variables
- [ ] GitHub auto-deploy
- [ ] Custom domain (if desired)

---

## 🎮 CHARACTER ROSTER

### Active (Playable)
| Character | Art Style | Status |
|-----------|-----------|--------|
| **Pixldrift** | Neon cyberpunk, Blade Runner meets Spider-Verse | ✅ Active |
| **Spudnik** | Studio Ghibli meets Pixar, warm storybook | ✅ Active |
| **Steve** | Minecraft voxel art, blocky cubes | ✅ Active |

### Locked (Configured, need unlock)
| Character | Art Style | Unlock |
|-----------|-----------|--------|
| **Rik** | Dark occult-tech, glowing sigils | Terminal puzzle |

### Planned (Not yet configured)
| Character | Concept | Unlock |
|-----------|---------|--------|
| **Prince of Persia** | Classic rotoscoped animation style | 5 floppy disks |
| **Tamagotchi Creature** | Pixel pet evolved form | Raise Tamagotchi |
| **Mutant** | Player-created hybrid | Mutation lab |

### Reserved
- **Fifi** - On hold (dev departure)
- **Andy** - On hold
- **Mystery** - TBD

---

## 🗂️ KEY FILES

```
DDv2/
├── server.js                    # Express server, API routes, AI integration
├── client/
│   ├── index.html               # Entry point
│   ├── script.js                # Core game logic
│   ├── pages/
│   │   ├── character-select.html
│   │   └── page1.html           # Story pages
│   ├── styles/
│   │   ├── style.css
│   │   └── page1.css
│   └── assets/
│       ├── images/
│       │   ├── bedroom.png      # Main room background
│       │   └── pixldrift_cover.webp
│       └── sounds/
├── scripts/
│   ├── terminal.js              # Terminal emulator (expand this!)
│   └── character-select.js
├── TASKS_v2.md                  # This file
├── MSDOS_TERMINAL_SPEC.md       # Terminal implementation spec
└── PROJECT_HANDOFF.md           # Project summary for new threads
```

---

## 🔑 ENVIRONMENT VARIABLES

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
PORT=3000
NODE_ENV=production
```

---

## 📝 NOTES

- **Lords of Magic & Alien Logic**: User has deep love for these games. Don't do half-measures - wait until we can implement something truly special.
- **Art assets**: Some Glitch CDN links may be dead. Check and replace with local files.
- **Character videos**: May need to regenerate with AI (Runway, Pika) if originals are lost.
- **Rik's sigil language**: When implementing, his riddles should feel genuinely cryptic and reward careful thinking.

---

## 🚀 QUICK START FOR NEW SESSIONS

```bash
cd C:\Users\st4ti\Documents\projects\ddv2
npm install
npm start
# Open http://localhost:3000
```

Then in another terminal:
```bash
cd C:\Users\st4ti\Documents\projects\ddv2
claude
# Give it tasks from this file
```
