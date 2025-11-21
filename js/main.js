/**
 * Main UI and menu logic:
 * - sound + music control
 * - main menu and overlays
 * - settings, help, title animation
 */

let soundEnabled = true;
let menuMusicInitialized = false;
let musicVolume = 0.4;

/**
 * Plays a given sound if global sound is enabled.
 * Resets playback position before playing.
 * 
 * @param {HTMLAudioElement} sound - Audio object to play.
 */
function playGameSound(sound) {
  if (!sound) return;
  if (typeof soundEnabled !== "undefined" && !soundEnabled) return;
  sound.currentTime = 0;
  if (typeof sound.play === "function") {
    sound.play().catch(() => {});
  }
}

/**
 * Background menu music used on the main menu.
 */
const menuMusic = new Audio("audio/awesomeness.mp3");
menuMusic.loop = true;
menuMusic.volume = musicVolume;

/**
 * Starts playing the menu music (if allowed).
 */
function playMenuMusic() {
  playGameSound(menuMusic);
}

/**
 * Pauses the menu music without resetting position.
 */
function stopMenuMusic() {
  menuMusic.pause();
}

/**
 * Ensures menu music is initialized only once,
 * typically on first user interaction (click).
 */
function initMenuMusicOnce() {
  if (menuMusicInitialized) return;
  menuMusicInitialized = true;
  playMenuMusic();
}

/**
 * Start menu music once on the first click anywhere on the document.
 */
document.addEventListener("click", initMenuMusicOnce, { once: true });

/**
 * Toggles global sound on/off and updates related UI + audio states.
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  updateSoundButtonIcon();
  menuMusic.muted = !soundEnabled;
  muteCharacterSoundIfAvailable();
}

/**
 * Updates the sound button icon based on current soundEnabled flag.
 */
function updateSoundButtonIcon() {
  const soundButtonElement = document.getElementById("sound-btn");
  if (!soundButtonElement) return;
  soundButtonElement.textContent = soundEnabled ? "🔊" : "🔇";
}

/**
 * Mutes/unmutes the character sound if available in the current world.
 */
function muteCharacterSoundIfAvailable() {
  if (!world || !world.character || !world.character.sound) return;
  world.character.sound.muted = !soundEnabled;
}

/**
 * Initializes core UI handlers once the DOM is fully loaded:
 * - game controls (menu buttons)
 * - sound button
 * - overlay buttons (restart, menu)
 * - settings controls (volume, fullscreen)
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeGameControls();
  initSoundButtonHandler();
  initOverlayButtons();
  initSettingsControls();
});

/**
 * Binds the sound toggle handler to the sound button.
 */
function initSoundButtonHandler() {
  addClickHandlerById("sound-btn", toggleSound);
}

/**
 * Initializes settings section controls such as:
 * - music volume slider
 * - fullscreen toggle button
 */
function initSettingsControls() {
  const musicSlider = document.getElementById("music-volume-slider");
  const fullscreenButton = document.getElementById("settings-fullscreen-btn");
  if (musicSlider) {
    musicSlider.value = String(Math.round(musicVolume * 100));
    musicSlider.addEventListener("input", (event) => {
      const value = Number(event.target.value);
      setMusicVolumeFromPercent(value);
    });
  } if (fullscreenButton) fullscreenButton.addEventListener("click", toggleFullscreen);
}

/**
 * Sets global music volume from a percentage value (0–100).
 * Updates menu music and character sound volume.
 * 
 * @param {number} percent - Volume in percent.
 */
function setMusicVolumeFromPercent(percent) {
  musicVolume = percent / 100;
  menuMusic.volume = musicVolume;

  if (!world || !world.character || !world.character.sound) return;
  world.character.sound.volume = musicVolume;
}

/**
 * Initializes menu-related game controls (play, help, settings).
 */
function initializeGameControls() {
  attachMenuEventListeners();
}

/**
 * Attaches click handlers to main menu buttons.
 */
function attachMenuEventListeners() {
  addClickHandlerById("play-btn", handleStartButtonClick);
  addClickHandlerById("help-btn", showHelpScreen);
  addClickHandlerById("back-to-menu-btn", hideHelpScreen);
  addClickHandlerById("settings-btn", showSettingsScreen);
  addClickHandlerById("settings-back-btn", hideSettingsScreen);
}

/**
 * Safely adds a click event listener to an element by its ID.
 * 
 * @param {string} elementId 
 * @param {Function} handler 
 */
function addClickHandlerById(elementId, handler) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.addEventListener("click", handler);
}

/**
 * Called when the "Play" button is clicked.
 * Hides the start screen and loads the game.
 */
function handleStartButtonClick() {
  hideStartScreen();
  loadGame();
}

/**
 * Hides the main menu/start screen container.
 */
function hideStartScreen() {
  const mainMenuElement = document.getElementById("main-menu");
  if (!mainMenuElement) return;
  mainMenuElement.classList.add("d-none");
}

/**
 * Sets up and starts the actual game:
 * - shows the stage
 * - initializes canvas
 * - stops menu music
 * - creates level + world
 * - sets up mobile controls if needed
 */
function loadGame() {
  showElementById("stage");
  initializeCanvas();
  stopMenuMusic();
  startGame();
  createGameWorld();
  initMobileControls();
}

/**
 * Restarts the game from scratch:
 * - hides all overlays
 * - stops intervals
 * - clears canvas
 * - reloads the game.
 */
function restartGame() {
  hideOverlays();
  stopGame();
  clearCanvas();
  loadGame();
}

/**
 * Returns to the main menu from the game:
 * - stops game
 * - hides overlays and stage
 * - resets world and canvas
 * - shows main menu
 * - restarts menu music.
 */
function returnToMainMenu() {
  stopGame();
  hideOverlays();
  hideStageAndCanvas();
  hideElementById("mobile-controls");
  resetWorld();
  showElementById("main-menu");
  playMenuMusic();
}

/**
 * Hides all end-of-game overlays (win/lose screens).
 */
function hideOverlays() {
  hideElementById("game-over-screen");
  hideElementById("you-won-screen");
}

/**
 * Shows the help screen overlay.
 */
function showHelpScreen() {
  showElementById("menu-help");
}

/**
 * Hides the help screen overlay.
 */
function hideHelpScreen() {
  hideElementById("menu-help");
}

/**
 * Shows the settings screen overlay.
 */
function showSettingsScreen() {
  showElementById("menu-settings");
}

/**
 * Hides the settings screen overlay.
 */
function hideSettingsScreen() {
  hideElementById("menu-settings");
}

/**
 * Utility to hide one element and show another.
 * 
 * @param {string} hideId 
 * @param {string} showId 
 */
function toggleScreenContent(hideId, showId) {
  hideElementById(hideId);
  showElementById(showId);
}

/**
 * Adds the 'd-none' class to hide an element by ID.
 * 
 * @param {string} elementId 
 */
function hideElementById(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.classList.add("d-none");
}

/**
 * Removes the 'd-none' class to show an element by ID.
 * 
 * @param {string} elementId 
 */
function showElementById(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.classList.remove("d-none");
}

/**
 * Initializes overlay buttons:
 * - restart (lose)
 * - restart (win)
 * - back to menu (lose)
 * - back to menu (win)
 */
function initOverlayButtons() {
  addClickHandlerById("restart-btn", restartGame);
  addClickHandlerById("restart-won-btn", restartGame);
  addClickHandlerById("menu-btn", returnToMainMenu);
  addClickHandlerById("menu-won-btn", returnToMainMenu);
}
