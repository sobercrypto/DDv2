# Digital Dreamers v2

An interactive, AI-powered comic book game featuring classic video game characters in an immersive retro computing environment.

## Overview

Digital Dreamers is a unique interactive storytelling experience that combines:
- **AI-Generated Stories**: Dynamic narratives powered by Claude (Anthropic)
- **Comic Book Art**: Custom illustrations generated with OpenAI's image models
- **Character Selection**: Play as Steve, Mario, Sonic, or Link
- **Roguelite Elements**: Previous playthroughs influence future stories
- **Retro Aesthetics**: Nostalgic 90s bedroom setting with interactive elements

## Features

- 🎮 **Interactive Comic Book**: Make choices that shape your character's story
- 🎨 **Dynamic Art Generation**: Each page features unique AI-generated comic art
- 💾 **Save System**: SQLite database persists game sessions and story choices
- 🔄 **Replayability**: Multiple story paths with varying moral alignments (Good/Neutral/Evil)
- 📖 **Achievement System**: Track your accomplishments across playthroughs
- 🖥️ **Retro UI**: Immersive vintage computer interface with terminal interactions

## Tech Stack

### Backend
- **Node.js** with Express
- **SQLite3** for data persistence
- **Anthropic Claude** (Sonnet 4) for story generation
- **OpenAI** (gpt-image-1) for comic art generation
- **CORS** and body-parser middleware

### Frontend
- **React 19** for UI components
- **Vanilla JavaScript** for terminal interactions
- **Custom CSS** with retro/pixel art styling
- **Google Fonts** (Press Start 2P, IBM Plex Mono)

## Project Structure

```
DDv2/
├── server.js              # Express server with API endpoints
├── client/
│   ├── index.html         # Main HTML entry point
│   ├── script.js          # Core game logic
│   ├── components/        # React components
│   ├── pages/             # Game pages/views
│   ├── styles/            # CSS stylesheets
│   └── .data/             # SQLite database files
├── scripts/
│   ├── terminal.js        # Terminal emulator logic
│   ├── character-select.js # Character selection UI
│   └── terminal-mount.js  # Terminal initialization
└── package.json           # Dependencies and scripts

```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sobercrypto/DDv2.git
cd DDv2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

4. Start the server:
```bash
npm start
```

5. Open your browser to `http://localhost:3000`

## API Endpoints

- `POST /api/generate-story` - Generate story content and choices
- `POST /api/save-choice` - Save player's choice to database
- `GET /api/story/:sessionId/:pageNumber` - Retrieve saved story data
- `GET /health` - Health check endpoint

## Database Schema

### game_sessions
- `id`: Session identifier
- `player_id`: Player identifier
- `character_type`: Selected character
- `current_page`: Current story page
- `created_at`: Session creation timestamp

### story_choices
- `id`: Choice identifier
- `session_id`: Reference to game session
- `page_number`: Story page number
- `choice_made`: Index of choice selected
- `story_text`: Generated story text
- `choice1_text`, `choice2_text`, `choice3_text`: Choice options
- `image_url`: URL to generated comic art

### achievements
- `id`: Achievement identifier
- `session_id`: Reference to game session
- `achievement_type`: Type of achievement
- `unlocked_at`: Timestamp when unlocked

## Development

The project uses:
- Node.js >=16.x
- NPM for package management
- Express for server framework
- React 19 for frontend components

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
