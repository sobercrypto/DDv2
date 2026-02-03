# Digital Dreamers - Retro Playground Revival

## Project Vision
Transform the DDv2 repository into a fully functional "Digital Retro Playground" - a nostalgic web destination featuring the Digital Dreamers AI comic book game as the centerpiece, surrounded by additional retro games and activities.

**Live URL Goal:** Host publicly so anyone can access and play

---

## Phase 1: Fix & Deploy Core Game (Priority: HIGH)

### 1.1 Audit Current State
- [ ] Review `server.js` - check API endpoint implementations
- [ ] Verify Anthropic Claude integration (model: claude-sonnet-4-20250514 or newer)
- [ ] Verify OpenAI integration (model: gpt-image-1)
- [ ] Check SQLite database schema and initialization
- [ ] Test all existing API endpoints:
  - `POST /api/generate-story`
  - `POST /api/save-choice`
  - `GET /api/story/:sessionId/:pageNumber`
  - `GET /health`
- [ ] Review React components in `client/components/`
- [ ] Check for hardcoded URLs, broken imports, deprecated dependencies

### 1.2 Fix Critical Issues
- [ ] Update any deprecated npm packages (`npm audit fix`)
- [ ] Fix any broken API calls between frontend and backend
- [ ] Ensure environment variables are properly loaded (.env pattern)
- [ ] Test the full game flow locally:
  1. Character selection (Steve/Mario/Sonic/Link)
  2. Story generation via Claude
  3. Comic art generation via OpenAI
  4. Choice selection and persistence
  5. Session continuity

### 1.3 Deployment Setup
- [ ] Choose hosting platform (recommend: Railway or Vercel)
- [ ] Configure build scripts in `package.json`
- [ ] Set up environment variables on host:
  - `ANTHROPIC_API_KEY`
  - `OPENAI_API_KEY`
  - `PORT`
- [ ] Configure SQLite for production (or migrate to PostgreSQL if needed)
- [ ] Set up GitHub integration for auto-deploy on push
- [ ] Test deployed version end-to-end

---

## Phase 2: Retro Playground Hub Structure

### 2.1 Create Hub Landing Page
- [ ] Design retro landing page with:
  - Animated pixel art logo
  - CRT monitor / scanline effects (CSS)
  - "Choose Your Adventure" style menu
  - Visitor counter (real or aesthetic)
  - Starfield or matrix rain background option
- [ ] Navigation to all activities/games
- [ ] Mobile-responsive (but desktop-first aesthetic)

### 2.2 Site Architecture
```
/                    → Landing hub page
/dreamers            → Main AI comic book game (existing DDv2)
/arcade              → Mini-games collection
/arcade/snake        → Snake game
/arcade/breakout     → Breakout clone
/arcade/invaders     → Space invaders
/terminal            → Interactive retro terminal
/jukebox             → Chiptune music player
/guestbook           → 90s-style guestbook
/about               → About page with credits
```

### 2.3 Shared Components
- [ ] Create reusable retro UI component library:
  - Pixel buttons
  - CRT screen wrapper
  - Retro window frames (Windows 95 / Mac OS 9 style)
  - Loading animations (hourglass, spinning disc)
  - Sound effects (bleeps, bloops) - optional toggle
- [ ] Consistent fonts: Press Start 2P, IBM Plex Mono, VT323
- [ ] Color palette: Classic CGA/EGA inspired

---

## Phase 3: Additional Games & Activities

### 3.1 Arcade Games (Vanilla JS or lightweight)
- [ ] **Snake** - Classic snake with pixel graphics, high score persistence
- [ ] **Breakout** - Paddle and bricks, power-ups optional
- [ ] **Space Invaders** - Waves of enemies, increasing difficulty
- [ ] **Memory Match** - Card matching with retro game characters
- [ ] Shared high score system (localStorage or database)

### 3.2 Terminal Experience
- [ ] Expand existing `terminal.js` into standalone feature
- [ ] Commands to implement:
  - `help` - list commands
  - `play dreamers` - launch comic game
  - `arcade` - list available games
  - `fortune` - random retro computing quote
  - `ascii [thing]` - generate ASCII art
  - `chat` - AI chatbot in terminal style
  - `hack` - fun fake "hacking" sequence
  - `dir` / `ls` - fake file listings
- [ ] Easter eggs and secrets

### 3.3 Jukebox
- [ ] Chiptune/8-bit music player
- [ ] Curated playlist (royalty-free chiptunes)
- [ ] Visualizer (simple waveform or bars)
- [ ] Track info display

### 3.4 Guestbook
- [ ] 90s-style guestbook where visitors can leave messages
- [ ] Fields: Name, Website (optional), Message
- [ ] Show recent entries with timestamps
- [ ] Basic moderation (profanity filter or approval queue)
- [ ] Persist to database

---

## Phase 4: Polish & Enhancements

### 4.1 Digital Dreamers Game Improvements
- [ ] Add more characters beyond initial 4
- [ ] Implement achievement display UI
- [ ] Add "Previously on..." recap for returning sessions
- [ ] Gallery of generated comic pages (shareable)
- [ ] Multiple story "worlds" or themes
- [ ] Difficulty/tone selector (lighthearted vs dramatic)

### 4.2 Site-wide Polish
- [ ] Loading states with retro animations
- [ ] Error pages (404, 500) with personality
- [ ] Favicon and meta tags for social sharing
- [ ] Open Graph images for link previews
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Accessibility basics (keyboard nav, alt text)

### 4.3 Optional Advanced Features
- [ ] User accounts (save progress across devices)
- [ ] Leaderboards for arcade games
- [ ] Daily challenges
- [ ] Unlockable content based on achievements
- [ ] Share comic pages to social media

---

## Technical Notes

### Stack
- **Backend:** Node.js + Express
- **Frontend:** React 19 + Vanilla JS for games
- **Database:** SQLite (dev) → consider PostgreSQL (prod)
- **AI:** Anthropic Claude (stories), OpenAI gpt-image-1 (art)
- **Hosting:** Railway, Vercel, or Render

### Environment Variables Required
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
PORT=3000
NODE_ENV=production
DATABASE_URL= (if using external DB)
```

### Key Files to Understand
- `server.js` - Express server, API routes
- `client/script.js` - Core game logic
- `client/components/` - React UI components
- `scripts/terminal.js` - Terminal emulator
- `scripts/character-select.js` - Character selection

---

## Success Criteria
1. ✅ Digital Dreamers game fully playable end-to-end
2. ✅ Publicly accessible URL anyone can visit
3. ✅ At least 3 working arcade mini-games
4. ✅ Functional retro terminal with easter eggs
5. ✅ Cohesive retro aesthetic throughout
6. ✅ Mobile-friendly (playable on phone)

---

## Getting Started (For AI Agent)

1. Clone repo: `git clone https://github.com/sobercrypto/DDv2.git`
2. Install deps: `npm install`
3. Create `.env` with required keys
4. Run locally: `npm start`
5. Test at `http://localhost:3000`
6. Work through Phase 1 tasks first before expanding

**Ask the user for clarification on:**
- API keys (they'll need to provide or have you use theirs)
- Domain name preference
- Hosting platform preference
- Any specific games they want prioritized
