// character-select.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Character select script loaded');

    // Character data - ACTIVE CHARACTERS ONLY
    const characterData = {
        pixldrift: {
            name: "PIXLDRIFT",
            description: "A cyber-enhanced protagonist navigating a high-tech dystopia. Cool, stylish, high-stakes action with philosophical undertones. Art style: Futuristic neon cyberpunk - Blade Runner meets Spider-Verse.",
        },
        spudnik: {
            name: "SPUDNIK",
            description: "A sentient potato with expressive eyes and a tiny sprout on top. Wholesome, heartfelt, funny - Ted Lasso energy, optimistic even in hard times. Art style: Warm storybook illustration - Studio Ghibli meets Pixar.",
        },
        steve: {
            name: "STEVE",
            description: "The iconic survivor from Minecraft. Adventure, exploration, building, survival in a blocky voxel world. Art style: Minecraft aesthetic - everything is cubes!",
        },
        // UNLOCKABLE - Rik (commented out until unlock system is implemented)
        /*
        rik: {
            name: "RIK",
            description: "A cloaked figure surrounded by floating glowing sigils. Cryptic, cerebral, puzzle-like. Speaks in riddles that manifest as physical sigils. Art style: Dark occult-tech fusion.",
            locked: true,
            unlockCondition: "Complete the game with all three main characters"
        }
        */
    };

    // Alias support for backwards compatibility
    const characterAliases = {
        pixl: "pixldrift",
        pixl_drift: "pixldrift"
    };

    // Initialize video elements
    const characterCards = document.querySelectorAll('.character-card');
    console.log('Found character cards:', characterCards.length);

    characterCards.forEach(card => {
        const video = card.querySelector('video');
        if (video) {
            // Reset all videos
            video.pause();
            video.currentTime = 0;

            card.addEventListener('mouseenter', () => {
                console.log('Mouse enter:', card.dataset.character);
                video.play().catch(err => {
                    console.warn('Video play error:', err);
                });
            });

            card.addEventListener('mouseleave', () => {
                console.log('Mouse leave:', card.dataset.character);
                video.pause();
                video.currentTime = 0;
            });
        }
    });

    // Modal functionality
    const modal = document.querySelector('.modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const selectBtn = modal.querySelector('.select-btn');
    const closeBtn = modal.querySelector('.close-btn');
    let selectedCharacter = null;

    // Character selection
    document.querySelectorAll('.character-card.available').forEach(card => {
        card.addEventListener('click', () => {
            let charId = card.dataset.character;
            // Handle aliases for backwards compatibility
            charId = characterAliases[charId] || charId;
            selectedCharacter = charId;
            console.log('Character clicked:', selectedCharacter);

            if (characterData[selectedCharacter]) {
                // Check if character is locked
                if (characterData[selectedCharacter].locked) {
                    modalTitle.textContent = "LOCKED";
                    modalDescription.textContent = characterData[selectedCharacter].unlockCondition || "This character is not yet available.";
                } else {
                    modalTitle.textContent = characterData[selectedCharacter].name;
                    modalDescription.textContent = characterData[selectedCharacter].description;
                }
                modal.classList.remove('hidden');
            }
        });
    });

    // Modal controls
    if (selectBtn) {
        selectBtn.addEventListener('click', () => {
            if (selectedCharacter) {
                // Don't allow selecting locked characters
                if (characterData[selectedCharacter] && characterData[selectedCharacter].locked) {
                    console.log('Character is locked:', selectedCharacter);
                    return;
                }

                console.log('Character selected:', selectedCharacter);

                // Store selection in localStorage (use normalized ID)
                localStorage.setItem('selectedCharacter', selectedCharacter);

                // Clear any previous story data for fresh playthrough
                localStorage.removeItem('storyHistory');
                localStorage.removeItem('storyChoices');
                localStorage.setItem('currentPage', '1');

                // Add fade effect
                document.body.style.opacity = '0';

                // Navigate to first page
                setTimeout(() => {
                    window.location.href = 'page1.html';
                }, 1000);
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Close modal by clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Add fade transition to body
    document.body.style.transition = 'opacity 1s ease-in-out';
});