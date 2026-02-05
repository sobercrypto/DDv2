// ============================================================
// Prince of Persia - Game Wrapper for Digital Dreamers
// ============================================================
// Manages game state, unlock progression, and debug controls.
// Since PrinceJS doesn't emit postMessage events we can detect,
// debug buttons allow manual unlock testing.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // ========================
  // ELEMENT REFERENCES
  // ========================

  const statusDisplay = document.getElementById('status-display');
  const exitButton = document.getElementById('exit-button');
  const achievementBanner = document.getElementById('achievement-banner');
  const trialNotice = document.getElementById('trial-notice');
  const fullNotice = document.getElementById('full-notice');
  const completionNotice = document.getElementById('completion-notice');
  const gameContainer = document.querySelector('.game-container');

  // ========================
  // HELPERS
  // ========================

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========================
  // STATE FROM LOCALSTORAGE
  // ========================

  let princeUnlocked = localStorage.getItem('princeUnlocked') === 'true';
  let ocarinaUnlocked = localStorage.getItem('ocarinaUnlocked') === 'true';

  // ========================
  // INITIAL UI STATE
  // ========================

  function updateUI() {
    if (ocarinaUnlocked) {
      statusDisplay.textContent = 'STATUS: MASTER';
      trialNotice.classList.add('hidden');
      fullNotice.classList.add('hidden');
      completionNotice.classList.remove('hidden');
    } else if (princeUnlocked) {
      statusDisplay.textContent = 'STATUS: FULL GAME';
      trialNotice.classList.add('hidden');
      fullNotice.classList.remove('hidden');
      completionNotice.classList.add('hidden');
    } else {
      statusDisplay.textContent = 'STATUS: TRIAL';
      trialNotice.classList.remove('hidden');
      fullNotice.classList.add('hidden');
      completionNotice.classList.add('hidden');
    }

    // Update debug button states
    updateDebugButtons();
  }

  updateUI();

  // ========================
  // EXIT BUTTON
  // ========================

  exitButton.addEventListener('click', () => {
    window.location.href = '/pages/terminal.html';
  });

  // ========================
  // KEYBOARD SHORTCUT
  // ========================

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.location.href = '/pages/terminal.html';
    }
  });

  // ========================
  // ACHIEVEMENT DISPLAY
  // ========================

  async function showAchievement(lines, duration) {
    // Clear previous content
    achievementBanner.innerHTML = '';

    // Build multi-line achievement display
    lines.forEach(line => {
      const div = document.createElement('div');
      div.textContent = line;
      if (line.includes('LEGENDARY') || line.includes('OCARINA')) {
        div.classList.add('achievement-legendary');
      }
      achievementBanner.appendChild(div);
    });

    achievementBanner.classList.remove('hidden');

    // Wait for the specified duration
    await delay(duration || 8000);
  }

  // ========================
  // UNLOCK: PRINCE CHARACTER
  // ========================

  async function unlockPrince() {
    if (princeUnlocked) return;

    // Save to localStorage immediately
    localStorage.setItem('princeUnlocked', 'true');
    princeUnlocked = true;

    // Show achievement banner with animation
    await showAchievement([
      '\u2694\uFE0F LEVEL 1 COMPLETE \u2694\uFE0F',
      'THE PRINCE JOINS YOUR QUEST!'
    ], 5000);

    // Update notices
    updateUI();

    // After achievement fades, show follow-up message
    await showAchievement([
      'Prince character unlocked in Character Select!',
      'Full game now available - complete all 12 levels for ultimate power.'
    ], 6000);

    achievementBanner.classList.add('hidden');
  }

  // ========================
  // UNLOCK: SANDS OF TIME OCARINA
  // ========================

  async function unlockOcarina() {
    if (ocarinaUnlocked) return;

    // Must have Prince unlocked first
    if (!princeUnlocked) {
      await unlockPrince();
      await delay(1000);
    }

    // Save to localStorage
    localStorage.setItem('ocarinaUnlocked', 'true');
    localStorage.setItem('princeLevels', JSON.stringify(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    ));
    ocarinaUnlocked = true;

    // Show LEGENDARY achievement banner
    achievementBanner.classList.add('achievement-legendary-banner');

    await showAchievement([
      '\u2728 LEGENDARY ACHIEVEMENT \u2728',
      'ALL 12 LEVELS COMPLETE',
      'THE SANDS OF TIME OCARINA IS YOURS!'
    ], 6000);

    // Update notices
    updateUI();

    // Follow-up message
    await showAchievement([
      'You have mastered the Prince\'s journey.',
      'Return to the terminal and type TIMESHIFT to wield the Sands of Time.'
    ], 8000);

    achievementBanner.classList.remove('achievement-legendary-banner');
    achievementBanner.classList.add('hidden');
  }

  // ========================
  // DEBUG: MANUAL UNLOCK BUTTONS
  // ========================
  // Since PrinceJS iframe doesn't emit detectable
  // postMessage events for level completion, these
  // debug buttons allow manual testing of the
  // unlock progression.

  function createDebugBar() {
    const debugBar = document.createElement('div');
    debugBar.className = 'debug-bar';
    debugBar.id = 'debug-bar';

    const label = document.createElement('span');
    label.className = 'debug-label';
    label.textContent = 'DEBUG:';

    const btnLevel1 = document.createElement('button');
    btnLevel1.className = 'debug-btn debug-btn-prince';
    btnLevel1.id = 'debug-unlock-prince';
    btnLevel1.textContent = 'Complete Level 1';
    btnLevel1.addEventListener('click', () => unlockPrince());

    const btnFullGame = document.createElement('button');
    btnFullGame.className = 'debug-btn debug-btn-ocarina';
    btnFullGame.id = 'debug-unlock-ocarina';
    btnFullGame.textContent = 'Complete Full Game';
    btnFullGame.addEventListener('click', () => unlockOcarina());

    const btnReset = document.createElement('button');
    btnReset.className = 'debug-btn debug-btn-reset';
    btnReset.id = 'debug-reset';
    btnReset.textContent = 'Reset Progress';
    btnReset.addEventListener('click', () => {
      localStorage.removeItem('princeUnlocked');
      localStorage.removeItem('ocarinaUnlocked');
      localStorage.removeItem('princeLevels');
      princeUnlocked = false;
      ocarinaUnlocked = false;
      achievementBanner.classList.add('hidden');
      achievementBanner.classList.remove('achievement-legendary-banner');
      updateUI();
    });

    debugBar.appendChild(label);
    debugBar.appendChild(btnLevel1);
    debugBar.appendChild(btnFullGame);
    debugBar.appendChild(btnReset);

    // Insert debug bar at the bottom of the game container
    gameContainer.appendChild(debugBar);
  }

  function updateDebugButtons() {
    const btnPrince = document.getElementById('debug-unlock-prince');
    const btnOcarina = document.getElementById('debug-unlock-ocarina');
    if (!btnPrince || !btnOcarina) return;

    if (princeUnlocked) {
      btnPrince.disabled = true;
      btnPrince.textContent = 'Level 1 \u2713';
    } else {
      btnPrince.disabled = false;
      btnPrince.textContent = 'Complete Level 1';
    }

    if (ocarinaUnlocked) {
      btnOcarina.disabled = true;
      btnOcarina.textContent = 'Full Game \u2713';
    } else {
      btnOcarina.disabled = false;
      btnOcarina.textContent = 'Complete Full Game';
    }
  }

  createDebugBar();
});
