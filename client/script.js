// ====================
// Debugging & Globals
// ====================
console.log("Script loaded!");
console.log("Current path:", window.location.pathname);
console.log("URL parameters:", window.location.search);

// ====================
// STORY MANAGER CLASS
// ====================
class StoryManager {
  constructor() {
    this.selectedCharacter = localStorage.getItem("selectedCharacter") || null;
    // storyHistory: array of story segments
    this.storyHistory = JSON.parse(localStorage.getItem("storyHistory")) || [];
    // previousChoices: array of choices made by the user
    this.previousChoices =
      JSON.parse(localStorage.getItem("storyChoices")) || [];
    // We'll store the current choices (from the latest API call) for display.
    this.currentChoices = [];
    this.baseUrl = window.location.origin;

    console.log("[StoryManager] Initialized with:", {
      selectedCharacter: this.selectedCharacter,
      storyHistoryLength: this.storyHistory.length,
      previousChoicesLength: this.previousChoices.length,
    });
  }

  async initialize() {
    if (!this.selectedCharacter) {
      console.error("[StoryManager] No character selected. Redirecting to character-select...");
      window.location.href = "character-select.html";
      return false;
    }
    console.log("[StoryManager] Starting story for character:", this.selectedCharacter);

    // Get DOM elements from within the comic container
    this.storyText = document.querySelector("#panelStoryText");
    this.storyImage = document.querySelector("#panelImage");
    this.loadingOverlay = document.querySelector(".loading-overlay");
    // Select only the choice texts within the comic container
    this.choicePanels = document.querySelectorAll(
      ".comic-container .choice .choice-text"
    );

    // Set up listeners on the entire choice elements
    document
      .querySelectorAll(".comic-container .choice")
      .forEach((choiceElem, index) => {
        choiceElem.addEventListener("click", () =>
          this.handleChoice(index + 1)
        );
      });

    /* 
      We expect the number of story segments to equal (previousChoices.length + 1). 
      If not, we need to generate a new segment.
    */
    if (this.storyHistory.length < this.previousChoices.length + 1) {
      await this.generateStoryContent();
    } else {
      this.updateStoryDisplay();
    }
    return true;
  }

  async handleChoice(choiceIndex) {
    // Save the choice locally and on the server
    this.previousChoices.push({
      choice: choiceIndex,
      character: this.selectedCharacter,
    });
    localStorage.setItem("storyChoices", JSON.stringify(this.previousChoices));

    try {
      await fetch(`${this.baseUrl}/api/save-choice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: localStorage.getItem("sessionId"),
          pageNumber: this.storyHistory.length + 1, // current page number
          choiceIndex: choiceIndex,
        }),
      });
    } catch (error) {
      console.error("Error saving choice:", error);
    }

    // Redirect to the next page instead of reloading the same page
    let currentPage = parseInt(localStorage.getItem("currentPage") || "1", 10);
    currentPage++; // Increment page number
    localStorage.setItem("currentPage", currentPage);

    // Story is 8 pages - go to credits after page 8
    if (currentPage > 8) {
      window.location.href = "/pages/credits.html";
    } else {
      window.location.href = `/pages/page${currentPage}.html`;
    }
  }

  async generateStoryContent() {
    try {
      if (this.loadingOverlay) this.loadingOverlay.style.display = "flex";

      // Fetch new story content from your API
      const storyContent = await this.getStoryForCharacter(
        this.selectedCharacter
      );
      if (storyContent && storyContent.mainStory) {
        this.storyHistory.push(storyContent.mainStory);
        localStorage.setItem("storyHistory", JSON.stringify(this.storyHistory));
        // Save the current choices for display
        this.currentChoices = storyContent.choices;
      } else {
        console.error("No story content returned from API.");
      }

      this.updateStoryDisplay();

      // Update the image panel if provided
      if (this.storyImage && storyContent.imageUrl) {
        this.storyImage.style.backgroundImage = `url(${storyContent.imageUrl})`;
        this.storyImage.style.backgroundSize = "contain";
        this.storyImage.style.backgroundPosition = "center";
      }

      // Update the choice texts inside the comic container
      if (this.currentChoices && this.choicePanels) {
        this.choicePanels.forEach((panel, index) => {
          panel.textContent = this.currentChoices[index] || "";
        });
      }

      // Hide the loading overlay after a short delay
      setTimeout(() => {
        if (this.loadingOverlay) this.loadingOverlay.style.display = "none";
      }, 2000);
    } catch (error) {
      console.error("Error generating story:", error);
      if (this.loadingOverlay) {
        const loadingText = this.loadingOverlay.querySelector(".loading-text");
        if (loadingText) {
          loadingText.textContent = "Error loading story. Please try again.";
        }
        // Hide the spinner even on error
        this.loadingOverlay.style.display = "none";
      }
    }
  }

  async getStoryForCharacter(character) {
    console.log("Getting story for character:", character);
    // Map short character IDs to normalized names for server
    const characterMap = {
      pixl: "pixldrift",
      pixl_drift: "pixldrift",
      pixldrift: "pixldrift",
      spudnik: "spudnik",
      steve: "steve",
      rik: "rik",
      prince: "prince",
      "the prince": "prince",
      persia: "prince",
    };
    const mappedCharacter =
      characterMap[character.toLowerCase()] || character.toLowerCase();

    // Concatenate all previous story segments (if needed)
    const previousStory = this.storyHistory.join("\n\n") || "";

    try {
      // Calculate current page number based on story history
      const pageNumber = this.storyHistory.length + 1;

      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: mappedCharacter,
          pageNumber: pageNumber,
          previousChoices: this.previousChoices,
          previousStory: previousStory,
        }),
      });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();
      console.log("API response:", data);

      return {
        mainStory: data.storyText,
        choices: data.choices,
        imageUrl: data.imageUrl,
      };
    } catch (error) {
      console.error("Error fetching story from API:", error);
      throw error;
    }
  }

  updateStoryDisplay() {
    if (this.storyText) {
      if (this.storyHistory.length > 0) {
        // Display only the latest story segment
        const latestSegment = this.storyHistory[this.storyHistory.length - 1];
        this.storyText.innerHTML = latestSegment;
      } else {
        // Fallback text if no story has been generated yet
        this.storyText.innerHTML = "No story generated yet.";
      }
    }

    // Update the choice texts if we have current choices available
    if (this.currentChoices && this.choicePanels) {
      this.choicePanels.forEach((panel, index) => {
        panel.textContent = this.currentChoices[index] || "";
      });
    }
  }
}

// ==========================
// MODAL & INTERACTIVE ITEMS (unchanged)
// ==========================
function showModal(title, text, choices = null) {
  const modal = document.querySelector(".modal");
  const modalTitle = modal.querySelector(".modal-title");
  const modalText = modal.querySelector(".modal-text");
  modalTitle.textContent = title;
  if (choices) {
    const choicesHtml = choices
      .map(
        (choice) =>
          `<button class="choice-btn retro-btn">${choice.text}</button>`
      )
      .join("");
    modalText.innerHTML = `<p>${text}</p><div class="choices-container">${choicesHtml}</div>`;
    const choiceButtons = modalText.querySelectorAll(".choice-btn");
    choiceButtons.forEach((btn, index) => {
      btn.addEventListener("click", choices[index].action);
      btn.addEventListener("mouseenter", () => {
        const hoverSound = new Audio("assets/sounds/hover.mp3");
        hoverSound.volume = 0.2;
        hoverSound.play().catch(() => {});
      });
    });
  } else {
    modalText.textContent = text;
  }
  modal.classList.remove("hidden");
  const modalClose = modal.querySelector(".modal-close");
  modalClose.focus();
}

function hideModal() {
  document.querySelector(".modal").classList.add("hidden");
}

function handleKeyPress(e) {
  if (e.key === "Escape") hideModal();
}

function initializeFocusStates() {
  document.querySelectorAll(".interactive-item").forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.addEventListener("focus", () => {
      item.style.outline = "2px solid var(--neon-blue)";
      item.style.outlineOffset = "2px";
    });
    item.addEventListener("blur", () => {
      item.style.outline = "none";
      item.style.outlineOffset = "0";
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
}

// TODO: Sound effects are optional - add hover.mp3 to assets/sounds/ to enable
function addHoverSound() {
  const hoverSound = new Audio("assets/sounds/hover.mp3");
  document.querySelectorAll(".interactive-item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      hoverSound.currentTime = 0;
      hoverSound.volume = 0.2;
      hoverSound.play().catch(() => {}); // Silently fails if sound file missing
    });
  });
}

// ==================
// BOOT SEQUENCE CODE (unchanged)
// ==================
function startBootSequence() {
  const sequence = document.createElement("div");
  sequence.id = "boot-sequence";
  document.body.appendChild(sequence);
  const crtLines = document.createElement("div");
  crtLines.className = "crt-lines";
  sequence.appendChild(crtLines);
  const crtFlicker = document.createElement("div");
  crtFlicker.className = "crt-flicker";
  sequence.appendChild(crtFlicker);
  const content = document.createElement("div");
  content.className = "boot-content";
  sequence.appendChild(content);

  const showStudioLogo = () => {
    content.innerHTML = `
      <div class="studio-logo">
        <div class="logo-text">POTASIM STUDIOS</div>
        <div class="logo-subtext">DIGITAL REALITY DIVISION</div>
      </div>`;
  };
  const showLoadingScreen = () => {
    content.innerHTML = `
      <div class="loading-screen">
        <div class="loading-bar"><div class="loading-progress"></div></div>
        <div class="loading-text">INITIALIZING DIGITAL DREAMERS v2.45...</div>
        <div class="loading-details"></div>
      </div>`;
    const details = content.querySelector(".loading-details");
    const loadingTexts = [
      "Calibrating reality matrices...",
      "Loading quantum subsystems...",
      "Initializing retro protocols...",
      "Synchronizing timelines...",
      "Establishing neural link...",
    ];
    let currentText = 0;
    const textInterval = setInterval(() => {
      details.textContent = loadingTexts[currentText];
      currentText = (currentText + 1) % loadingTexts.length;
    }, 500);
    return () => clearInterval(textInterval);
  };
  const showWarningScreen = () => {
    content.innerHTML = `
      <div class="warning-screen">
        <div class="warning-symbol">!</div>
        <div class="warning-title">REALITY DISTORTION DETECTED</div>
        <div class="warning-text"></div>
      </div>`;
    const warningText = content.querySelector(".warning-text");
    const glitchChars = "PABOCDTEFA01T23O456789█▓░▒";
    const glitchInterval = setInterval(() => {
      let glitchString = "";
      for (let i = 0; i < 32; i++) {
        glitchString +=
          glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      warningText.textContent = glitchString;
    }, 50);
    return () => clearInterval(glitchInterval);
  };
  const showPortalEffect = () => {
    content.innerHTML = `
      <div class="portal-effect">
        <div class="portal-outer"></div>
        <div class="portal-inner"></div>
        <div class="portal-text">ENTERING DIGITAL REALM...</div>
      </div>`;
  };

  let cleanup = null;
  showStudioLogo();
  setTimeout(() => {
    cleanup = showLoadingScreen();
  }, 2000);
  setTimeout(() => {
    if (cleanup) cleanup();
    cleanup = showWarningScreen();
  }, 4000);
  setTimeout(() => {
    if (cleanup) cleanup();
    showPortalEffect();
  }, 6000);
  setTimeout(() => {
    sequence.classList.add("fade-out");
    setTimeout(() => {
      document.body.style.opacity = 0;
      setTimeout(() => {
        window.location.href = "../pages/main.html";
      }, 100);
    }, 900);
  }, 8000);
}

// ============================
// CHARACTER SELECT & MAIN MENU (unchanged)
// ============================

document.addEventListener("DOMContentLoaded", function () {
  const characterCards = document.querySelectorAll(".character-card");
  characterCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const video = card.querySelector("video");
      if (video) {
        video.play();
      }
    });
    card.addEventListener("mouseleave", () => {
      const video = card.querySelector("video");
      if (video) {
        video.pause();
        // Optionally, rewind the video:
        video.currentTime = 0;
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.getElementById("continueToCredits");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      localStorage.setItem(
        "storySummary",
        "Your journey has been epic and full of surprises. You've unlocked secret memories along the way!"
      );
      window.location.href = "/pages/credits.html";
    });
  }
});

function initializeCharacterSelect() {
  // Check Rik unlock from localStorage
  if (localStorage.getItem('rikUnlocked') === 'true') {
    characters.rik.unlocked = true;
  }

  // Check if Prince is unlocked
  const princeUnlocked = localStorage.getItem('princeUnlocked') === 'true';
  if (princeUnlocked) {
    characters.prince.unlocked = true;
  }

  // Dynamically inject unlockable character cards into the grid
  const characterGrid = document.querySelector('.character-grid');

  if (characterGrid && characters.rik) {
    const rikCard = createCharacterCard('rik', characters.rik);
    const lockedCards = characterGrid.querySelectorAll('.character-card.locked');
    if (lockedCards.length > 0) {
      characterGrid.insertBefore(rikCard, lockedCards[0]);
    } else {
      characterGrid.appendChild(rikCard);
    }
  }

  if (characterGrid && characters.prince) {
    const princeCard = createCharacterCard('prince', characters.prince);
    const lockedCards = characterGrid.querySelectorAll('.character-card.locked');
    if (lockedCards.length > 0) {
      characterGrid.insertBefore(princeCard, lockedCards[0]);
    } else {
      characterGrid.appendChild(princeCard);
    }
  }

  const characterCards = document.querySelectorAll(".character-card.available");
  const modal = document.querySelector(".modal");
  const closeBtn = document.querySelector(".close-btn");
  const selectBtn = document.querySelector(".select-btn");

  characterCards.forEach((card) => {
    card.addEventListener("click", () => {
      const charId = card.dataset.character;
      showCharacterDetails(charId);
    });
  });
  if (closeBtn)
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  if (selectBtn) {
    selectBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form submission

      const selected = modal.dataset.currentChar;
      if (!selected) {
        console.error("No character selected");
        return;
      }

      console.log("Character selected:", selected);

      // Store in localStorage
      localStorage.setItem("selectedCharacter", selected);

      // Clear previous story data for fresh playthrough
      localStorage.removeItem("storyHistory");
      localStorage.removeItem("storyChoices");
      localStorage.setItem("currentPage", "1");

      // Track story start time for achievements
      localStorage.setItem("storyStartTime", Date.now().toString());

      // Navigate to first page
      window.location.href = "../pages/page1.html";
    });
  }
}

function showCharacterDetails(charId) {
  const modal = document.querySelector(".modal");
  const modalTitle = modal.querySelector(".modal-title");
  const modalDescription = modal.querySelector(".modal-description");

  // Handle backwards compatibility aliases
  const normalizedId = characterIdAliases[charId] || charId;
  modal.dataset.currentChar = normalizedId;
  modal.classList.remove("hidden");

  const character = characters[normalizedId];
  if (character) {
    if (character.unlocked === false) {
      modalTitle.textContent = "LOCKED";
      modalDescription.textContent =
        character.unlockCondition || "Complete special requirements to unlock.";
    } else {
      modalTitle.textContent = character.name;
      modalDescription.textContent = character.description;
    }
  }
}

function createCharacterCard(id, character) {
  const card = document.createElement("div");
  card.className = `character-card ${
    character.unlocked ? "available" : "locked"
  } retro-border`;
  card.dataset.character = id;
  if (character.unlocked) {
    card.innerHTML = `
      <h3 class="char-name">${character.name}</h3>
      <div class="char-attributes">
        ${Object.entries(character.attributes)
          .map(
            ([attr, val]) => `
            <div class="attribute">
              <span>${attr}</span>
              <div class="attribute-bar"><div class="fill" style="width: ${val}%"></div></div>
            </div>
          `
          )
          .join("")}
      </div>`;
    card.addEventListener("click", () => selectCharacter(id));
  } else {
    card.innerHTML = `
      <h3 class="char-name">${character.name}</h3>
      <div class="locked-overlay">LOCKED</div>`;
  }
  return card;
}

function selectCharacter(characterId) {
  const character = characters[characterId];
  showModal(
    character.name,
    `
    <div class="character-details">
      <p>${character.description}</p>
      <button class="confirm-select">Choose ${character.name}</button>
    </div>
  `
  );
  const confirmBtn = document.querySelector(".confirm-select");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      localStorage.setItem("selectedCharacter", characterId);
      localStorage.setItem("characterData", JSON.stringify(character));
      // Clear previous story data and track start time
      localStorage.removeItem("storyHistory");
      localStorage.removeItem("storyChoices");
      localStorage.setItem("currentPage", "1");
      localStorage.setItem("storyStartTime", Date.now().toString());
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = "../pages/page1.html";
      }, 1000);
    });
  }
}

function initializeMainMenu() {
  const initStoryBtn = document.querySelector(".init-story");
  const optionsBtn = document.querySelector(".options");
  const creditsBtn = document.querySelector(".credits");
  if (initStoryBtn) {
    initStoryBtn.addEventListener("click", () => {
      window.location.href = "../pages/character-select.html";
    });
  }
  if (optionsBtn) {
    optionsBtn.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      const modalTitle = document.querySelector(".modal-title");
      const modalText = document.querySelector(".modal-text");
      if (modal && modalTitle && modalText) {
        modalTitle.textContent = "Options";
        modalText.textContent = "Options coming soon...";
        modal.classList.remove("hidden");
      }
    });
  }
  if (creditsBtn) {
    creditsBtn.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      const modalTitle = document.querySelector(".modal-title");
      const modalText = document.querySelector(".modal-text");
      if (modal && modalTitle && modalText) {
        modalTitle.textContent = "Credits";
        modalText.textContent =
          "PIXL_DRIFT - Lead Developer\nSPUDNIK - AI Systems & Narrative";
        modal.classList.remove("hidden");
      }
    });
  }
}

// ====================
// GENERAL INITIALIZATION
// ====================
function initializeInteractions() {
  document.querySelectorAll(".interactive-item").forEach((item) => {
    const type = Array.from(item.classList).find((cls) =>
      itemContent.hasOwnProperty(cls)
    );
    if (type) {
      item.addEventListener("click", () => handleItemClick(type));
    }
  });

  // Always attach the event listener to the modal "Close" button
  const modalClose = document.querySelector(".modal-close");
  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  // Allow closing the modal with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideModal();
  });
}

function handleItemClick(type) {
  const content = itemContent[type];
  if (content.choices) {
    showModal(content.title, content.text, content.choices);
  } else if (content.action) {
    content.action();
  } else {
    showModal(content.title, content.text);
  }
}

// Revised showModal function that preserves the Close button
function showModal(title, text, choices = null) {
  const modal = document.querySelector(".modal");
  const modalTitle = modal.querySelector(".modal-title");
  const modalText = modal.querySelector(".modal-text");

  // Set title
  modalTitle.textContent = title;

  // Clear previous modal text content
  modalText.innerHTML = "";

  // Create a paragraph for the main text
  const textPara = document.createElement("p");
  textPara.textContent = text;
  modalText.appendChild(textPara);

  // If there are choices, create a container and add buttons
  if (choices) {
    const choicesContainer = document.createElement("div");
    choicesContainer.classList.add("choices-container");
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice-btn retro-btn";
      button.textContent = choice.text;
      button.addEventListener("click", choice.action);
      button.addEventListener("mouseenter", () => {
        const hoverSound = new Audio("assets/sounds/hover.mp3");
        hoverSound.volume = 0.2;
        hoverSound.play().catch(() => {});
      });
      choicesContainer.appendChild(button);
    });
    modalText.appendChild(choicesContainer);
  }

  // Ensure the modal's Close button is visible
  const modalClose = modal.querySelector(".modal-close");
  modalClose.style.display = "block";

  // Display the modal and focus the Close button
  modal.classList.remove("hidden");
  modalClose.focus();
}
// Item content for interactive objects
const itemContent = {
  "comic-book": {
    title: "Digital Dreamers Comic",
    text: "Partially hidden under the desk lies a mysterious comic book, its pages glowing with an otherworldly energy. This is your gateway to the Digital Dreamers universe...",
    choices: [
      { text: "Put the comic book down", action: () => hideModal() },
      {
        text: "Open the comic book",
        action: () => {
          hideModal();
          startBootSequence();
        },
      },
    ],
  },
  "left-tv": {
    title: "Vintage Television Monitor",
    text: "A classic CRT television from the golden age of home computing. The screen flickers with a warm, familiar glow, reminiscent of late-night coding sessions and early video game adventures.",
  },
  "center-monitor": {
    title: "QUANTUM-DOS v3.14",
    text: 'The main development monitor pulses with an unsettling, otherworldly glow. A command prompt blinks ominously, green text cascading down the screen. The terminal awaits input...',
    choices: [
      { text: "Step away", action: () => hideModal() },
      {
        text: "Access Terminal",
        action: () => {
          hideModal();
          window.location.href = '/pages/terminal.html';
        },
      },
    ],
  },
  "right-tv": {
    title: "Test Station Monitor",
    text: "A professional-grade monitor used for debugging and testing. Its screen displays various diagnostic patterns, each telling a story of countless hours spent perfecting digital worlds.",
  },
  "center-computer": {
    title: "Primary Development System",
    text: "The heart of this digital sanctuary. This powerful machine has been the birthplace of countless games and digital experiments. Its keyboard bears the worn marks of endless lines of code.",
  },
  "left-computer": {
    title: "Archival Computing Unit",
    text: "A specialized machine dedicated to preserving digital history. Its mechanical keyboard provides satisfying tactile feedback, each key press echoing with the weight of code written long ago.",
  },
  "right-computer": {
    title: "Data Storage System",
    text: "This dedicated storage unit contains terabytes of archived data, game builds, and forgotten projects. The gentle whirring of its drives tells stories of digital worlds both launched and abandoned.",
  },
  "poster-doom": {
    title: "DOOM (1993) Original Poster",
    text: "A perfectly preserved poster of the game that revolutionized the FPS genre. The iconic imagery of the DOOM marine facing off against the hordes of Hell seems to pulse with demonic energy. The corners of the poster are slightly singed, though you don't remember that happening...",
  },
  "poster-mario": {
    title: "Super Mario Bros (1985) Original Poster",
    text: "This pristine Nintendo masterpiece poster captures the moment that changed gaming forever. Mario's pixelated form seems to move slightly when viewed from the corner of your eye, and you could swear you just heard a faint coin-collecting sound.",
  },
  "poster-alien-logic": {
    title: "Alien Logic: Skyrealms of Jorune (1994)",
    text: "An incredibly rare poster from one of gaming's most enigmatic titles. The bizarre alien landscapes and cryptic isho crystals depicted seem to shift and change when you're not looking directly at them. The poster appears to be printed on a material you can't quite identify.",
  },
  "poster-lords-magic": {
    title: "Lords of Magic: Special Edition (1998)",
    text: "A mystical poster showcasing the eight faiths of Lords of Magic. The symbols of Faith, Death, Life, Chaos, Order, Air, Earth, and Fire seem to radiate actual magical energy. Sometimes late at night, you swear you can hear spells being cast from within the poster.",
  },
  "alf-figurine": {
    title: "Mysterious ALF Collectible",
    text: "A seemingly ordinary ALF figurine from the 80s sits watchfully on the desk. Its eyes appear to follow you around the room, and occasionally you catch it in a slightly different pose than you remember leaving it in. There's a small tag on the base that reads \"No problem can't be solved by melmacking it!\" in text that somehow seems to rewrite itself every few seconds.",
  },
  lamp: {
    title: "Ambient Development Lamp",
    text: "This unique lamp provides the perfect atmospheric lighting for late-night coding sessions. Its warm glow seems to pulse in sync with the humming of the nearby computers.",
  },
  MDL: {
    title: "One Piece Collectible (1999)",
    text: 'A first-edition Monkey D. Luffy figure from the earliest days of One Piece stands proudly on display. Something about its grin seems more knowing than usual, and occasionally you swear you can hear faint echoes of "Gomu Gomu no..." when no one else is in the room. The tiny straw hat appears to cast an impossibly large shadow at certain angles.',
  },
};
// Character data used in select screens and modals
// ACTIVE CHARACTERS
const characters = {
  pixldrift: {
    name: "PIXLDRIFT",
    description:
      "A cyber-enhanced protagonist navigating a high-tech dystopia. Cool, stylish, high-stakes action with philosophical undertones.",
    artStyle: "Futuristic neon cyberpunk - Blade Runner meets Spider-Verse",
    attributes: { style: 95, tech: 90, resolve: 80 },
    unlocked: true,
  },
  spudnik: {
    name: "SPUDNIK",
    description:
      "A sentient potato with expressive eyes and a tiny sprout. Wholesome, heartfelt, funny - Ted Lasso energy, optimistic even in hard times.",
    artStyle: "Warm storybook illustration - Studio Ghibli meets Pixar",
    attributes: { heart: 95, humor: 90, resilience: 85 },
    unlocked: true,
  },
  steve: {
    name: "STEVE",
    description:
      "The iconic survivor from Minecraft. Adventure, exploration, building, and survival in a blocky voxel world.",
    artStyle: "Minecraft aesthetic - blocky, voxel-based, cubic",
    attributes: { survival: 90, building: 95, resourcefulness: 85 },
    unlocked: true,
  },
  // UNLOCKABLE CHARACTER
  rik: {
    name: "RIK",
    description:
      "A cloaked figure surrounded by floating glowing sigils. Cryptic, cerebral, puzzle-like. Speaks in riddles that manifest as physical sigils.",
    artStyle: "Dark occult-tech fusion - glowing sigils, shadowy environments",
    attributes: { mystery: 99, wisdom: 85, power: 90 },
    unlocked: false,
    unlockCondition: "Find and speak the three sigils in the terminal...",
  },
  // UNLOCKABLE CHARACTER - Prince (unlocked via Prince of Persia Level 1)
  // TODO: Generate prince_cover.webp with DALL-E
  // Prompt: "Persian prince character in ornate robes holding scimitar, palace background, golden hour lighting, comic book cover style"
  prince: {
    name: "THE PRINCE",
    description:
      "Master of blade and time, heir to the Persian throne. Skilled acrobat and swordsman who faces impossible odds with grace and determination.",
    artStyle: "Persian cinematic comic - warm golds, deep blues, palace architecture",
    attributes: { agility: 95, blade: 90, honor: 85 },
    unlocked: false,
    unlockCondition: "Beat Level 1 of Prince of Persia in the terminal arcade...",
  },
};

// Backwards compatibility aliases
const characterIdAliases = {
  pixl: "pixldrift",
  pixl_drift: "pixldrift",
};

// Additional character descriptions for the modal
const characterDescriptions = {
  pixldrift:
    "A cyber-enhanced protagonist navigating rain-slicked neon streets. Cool, stylish, fighting the good fight in a high-tech dystopia.",
  spudnik:
    "A sentient potato radiating warmth and optimism. With expressive eyes and a tiny sprout, Spudnik brings joy to every adventure.",
  steve:
    "The iconic blocky survivor from Minecraft. Master builder, fearless explorer, ready to craft solutions to any problem.",
  rik: "A mysterious cloaked figure whose riddles manifest as glowing sigils. Cryptic, cerebral, and deeply powerful.",
  prince: "Master of blade and time. A Persian prince who defies fate with acrobatic grace, scimitar in hand, driven by honor and destiny.",
};

// ====================
// INITIALIZATION LOGIC
// ====================
function init() {
  const currentPath = window.location.pathname;
  console.log("Current path:", currentPath);

  if (currentPath === "/" || currentPath.includes("index.html")) {
    // Interactive bedroom page
    initializeInteractions();
    initializeFocusStates();
    addHoverSound();
    console.log("Interactive room initialized!");
  } else if (currentPath.includes("main.html")) {
    // Main menu page
    initializeMainMenu();
    console.log("Main menu initialized!");
  } else if (currentPath.includes("character-select.html")) {
    // Character select screen
    initializeCharacterSelect();
    console.log("Character select initialized!");
  } else if (/page\d+\.html/.test(currentPath)) {
    // Story page – initialize the StoryManager
    console.log("Initializing StoryManager on story page:, currentPath");
    const storyManager = new StoryManager();
    storyManager.initialize().then((success) => {
      if (!success) console.error("StoryManager initialization failed");
      else console.log("StoryManager initialized successfully");
    });
  } else if (currentPath.includes("credits.html")) {
    // Credits / final summary page
    initializeCredits(); // You can define this function to load summary and credits data.
    console.log("Credits page initialized!");
  }
}

function initializeCredits() {
  // Credits page now handles its own initialization via inline script
  // This function is kept for backwards compatibility but credits.html
  // manages its own API calls for summary generation and achievements
  document.body.classList.add("fade-in");
  console.log("Credits page initialized - using inline script for API calls");
}

// ====================
// START THE APP
// ====================
document.addEventListener("DOMContentLoaded", () => {
  init();
});
