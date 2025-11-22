let soundEnabled = true;
let menuMusicInitialized = false;
let musicVolume = 0.4;
const menuMusic = new Audio("audio/awesomeness.mp3");
menuMusic.loop = true;
menuMusic.volume = musicVolume;

/** SVG icon string for 'Sound On'. */
const SOUND_ON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
const SOUND_OFF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("click", initMenuMusicOnce, { once: true });

/**
 * Aggregates all initialization steps.
 */
function init() {
  initGameButtons();
  initSoundControls();
  initOverlayButtons();
  initSettingsControls();
  initMenuOutsideClick();
  updateSoundButtonIcon();
}

/**
 * Binds click events for the main menu buttons.
 */
function initGameButtons() {
  addClick("play-btn", handleStartGame);
  // Using a wrapper to pass the event and ID
  addClick("help-btn", (e) => openMenu("menu-help", e));
  addClick("settings-btn", (e) => openMenu("menu-settings", e));
  addClick("back-to-menu-btn", showMainMenu);
  addClick("settings-back-btn", showMainMenu);
}

/**
 * Binds the global sound toggle button.
 */
function initSoundControls() {
  addClick("sound-btn", toggleSound);
}

/**
 * Sets up the settings UI (Slider, Fullscreen).
 */
function initSettingsControls() {
  const musicSlider = document.getElementById("music-volume-slider");
  const fsBtn = document.getElementById("settings-fullscreen-btn");

  if (musicSlider) {
    musicSlider.value = String(Math.round(musicVolume * 100));
    musicSlider.addEventListener("input", (e) => 
      setMusicVolume(Number(e.target.value) / 100)
    );
  }
  if (fsBtn) fsBtn.addEventListener("click", toggleFullscreen);
}

/**
 * Opens a specific menu overlay.
 * @param {string} menuId - The ID of the menu element to show.
 * @param {Event} event - The click event, used to stop propagation.
 */
function openMenu(menuId, event) {
  if (event) event.stopPropagation(); // Prevents document listener from closing it immediately
  hideElement("menu-main");
  showElement(menuId);
}

/**
 * Hides all overlays and returns to the main menu view.
 */
function showMainMenu() {
  hideElement("menu-help");
  hideElement("menu-settings");
  showElement("menu-main");
}

/**
 * Sets up the global click listener to detect clicks outside active overlays.
 */
function initMenuOutsideClick() {
  document.addEventListener("click", (event) => {
    checkOutsideClick("menu-help", event.target);
    checkOutsideClick("menu-settings", event.target);
  });
  
  // Prevents clicks inside the menu from bubbling up to document
  stopPropFor("menu-help");
  stopPropFor("menu-settings");
}

/**
 * Checks if a click occurred outside a specific open menu.
 * @param {string} menuId - The ID of the menu to check.
 * @param {HTMLElement} target - The element that was clicked.
 */
function checkOutsideClick(menuId, target) {
  const menu = document.getElementById(menuId);
  // If menu is open (not d-none) AND click was NOT inside menu -> close it
  if (menu && !menu.classList.contains("d-none") && !menu.contains(target)) {
    showMainMenu();
  }
}

/**
 * Adds stopPropagation to an element to prevent bubbling.
 * @param {string} id - The ID of the element.
 */
function stopPropFor(id) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", (e) => e.stopPropagation());
}

/**
 * Transitions from the menu to the game state.
 */
function handleStartGame() {
  hideElement("main-menu");
  loadGame(); // Function from game.js
}

/**
 * Initializes the game world, canvas, and controls.
 */
function loadGame() {
  showElement("stage");
  initializeCanvas();
  stopMenuMusic();
  startGame();       
  createGameWorld(); 
  initMobileControls();
}

/**
 * Resets the game state and starts a new session.
 */
function restartGame() {
  hideOverlays();
  stopGame();
  clearCanvas();
  loadGame();
}

/**
 * Stops the game and returns to the main menu.
 */
function returnToMainMenu() {
  stopGame();
  hideOverlays();
  hideStageAndCanvas();
  hideElement("mobile-controls");
  resetWorld();
  showElement("main-menu");
  playMenuMusic();
}

/**
 * Initializes buttons for Game Over / You Won screens.
 */
function initOverlayButtons() {
  addClick("restart-btn", restartGame);
  addClick("restart-won-btn", restartGame);
  addClick("menu-btn", returnToMainMenu);
  addClick("menu-won-btn", returnToMainMenu);
}

/**
 * Hides all end-game overlays.
 */
function hideOverlays() {
  hideElement("game-over-screen");
  hideElement("you-won-screen");
}

/**
 * Toggles the global sound state and updates icons/mute state.
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  menuMusic.muted = !soundEnabled;
  updateSoundButtonIcon();
  if (world && world.character) {
    world.character.sound.muted = !soundEnabled;
  }
}

/**
 * Updates the sound button icon based on the state.
 */
function updateSoundButtonIcon() {
  const btn = document.getElementById("sound-btn");
  if (btn) {
    btn.innerHTML = soundEnabled ? SOUND_ON_ICON : SOUND_OFF_ICON;
  }
}

/**
 * Sets the master volume for music and game sounds.
 * @param {number} vol - Volume level between 0.0 and 1.0.
 */
function setMusicVolume(vol) {
  musicVolume = vol;
  menuMusic.volume = musicVolume;
  if (world && world.character) {
    world.character.sound.volume = musicVolume;
  }
}

/**
 * Starts menu music once (workaround for browser autoplay policies).
 */
function initMenuMusicOnce() {
  if (!menuMusicInitialized) {
    menuMusicInitialized = true;
    if(soundEnabled) menuMusic.play().catch(() => {});
  }
}

/**
 * Plays the menu background music if sound is enabled.
 */
function playMenuMusic() {
  if (soundEnabled) {
    menuMusic.currentTime = 0;
    menuMusic.play().catch(() => {});
  }
}

/**
 * Pauses the menu background music.
 */
function stopMenuMusic() {
  menuMusic.pause();
}

/**
 * Utility to add a click listener to an element by ID.
 * @param {string} id - The ID of the HTML element.
 * @param {Function} fn - The callback function.
 */
function addClick(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", fn);
}

/**
 * Utility to add the 'd-none' class to an element.
 * @param {string} id - The ID of the HTML element.
 */
function hideElement(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("d-none");
}

/**
 * Utility to remove the 'd-none' class from an element.
 * @param {string} id - The ID of the HTML element.
 */
function showElement(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("d-none");
}