/**
 * ==========================================
 * 1. KONSTANTEN & STATE
 * ==========================================
 */

// Globaler State
let soundEnabled = true;
let menuMusicInitialized = false;
let musicVolume = 0.4;

// Audio Assets
const menuMusic = new Audio("audio/awesomeness.mp3");
menuMusic.loop = true;
menuMusic.volume = musicVolume;

// Icons (SVG)
const SOUND_ON_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
`;

const SOUND_OFF_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
  </svg>
`;

/**
 * ==========================================
 * 2. INITIALISIERUNG & EVENT LISTENER
 * ==========================================
 */

/**
 * Haupt-Einstiegspunkt: Wird ausgeführt, sobald das DOM geladen ist.
 */
document.addEventListener("DOMContentLoaded", () => {
  initGameControls();
  initSoundControls();
  initOverlayButtons();
  initSettingsControls();
  
  // Setzt das korrekte Icon direkt beim Start
  updateSoundButtonIcon(); 
});

/**
 * Startet Musik beim ersten Klick (Browser-Richtlinie).
 */
document.addEventListener("click", initMenuMusicOnce, { once: true });

function initGameControls() {
  addClickHandlerById("play-btn", handleStartButtonClick);
  addClickHandlerById("help-btn", showHelpScreen);
  addClickHandlerById("back-to-menu-btn", hideHelpScreen);
  addClickHandlerById("settings-btn", showSettingsScreen);
  addClickHandlerById("settings-back-btn", hideSettingsScreen);
}

function initSoundControls() {
  addClickHandlerById("sound-btn", toggleSound);
}

function initOverlayButtons() {
  addClickHandlerById("restart-btn", restartGame);
  addClickHandlerById("restart-won-btn", restartGame);
  addClickHandlerById("menu-btn", returnToMainMenu);
  addClickHandlerById("menu-won-btn", returnToMainMenu);
}

function initSettingsControls() {
  const musicSlider = document.getElementById("music-volume-slider");
  const fullscreenButton = document.getElementById("settings-fullscreen-btn");

  if (musicSlider) {
    musicSlider.value = String(Math.round(musicVolume * 100));
    musicSlider.addEventListener("input", (event) => {
      setMusicVolumeFromPercent(Number(event.target.value));
    });
  }
  
  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", toggleFullscreen);
  }
}

/**
 * ==========================================
 * 3. AUDIO ENGINE
 * ==========================================
 */

function toggleSound() {
  soundEnabled = !soundEnabled;
  menuMusic.muted = !soundEnabled;
  
  updateSoundButtonIcon();
  muteCharacterSoundIfAvailable();
}

function updateSoundButtonIcon() {
  const btn = document.getElementById("sound-btn");
  if (btn) {
    btn.innerHTML = soundEnabled ? SOUND_ON_ICON : SOUND_OFF_ICON;
    // Barrierefreiheit hinzufügen
    btn.setAttribute("aria-label", soundEnabled ? "Mute sound" : "Unmute sound");
  }
}

function setMusicVolumeFromPercent(percent) {
  musicVolume = percent / 100;
  menuMusic.volume = musicVolume;

  if (world && world.character && world.character.sound) {
    world.character.sound.volume = musicVolume;
  }
}

function initMenuMusicOnce() {
  if (!menuMusicInitialized) {
    menuMusicInitialized = true;
    playMenuMusic();
  }
}

function playMenuMusic() {
  playGameSound(menuMusic);
}

function stopMenuMusic() {
  menuMusic.pause();
}

function playGameSound(sound) {
  if (!sound || !soundEnabled) return;
  sound.currentTime = 0;
  sound.play().catch(() => { /* Autoplay blockiert oder Fehler */ });
}

function muteCharacterSoundIfAvailable() {
  if (world && world.character && world.character.sound) {
    world.character.sound.muted = !soundEnabled;
  }
}

/**
 * ==========================================
 * 4. GAME FLOW & NAVIGATION
 * ==========================================
 */

function handleStartButtonClick() {
  hideElementById("main-menu");
  loadGame();
}

function loadGame() {
  showElementById("stage");
  initializeCanvas();
  stopMenuMusic();
  startGame(); // Aus game.js
  createGameWorld(); // Aus game.js
  initMobileControls(); // Aus game.js
}

function restartGame() {
  hideOverlays();
  stopGame(); // Aus game.js
  clearCanvas(); // Aus game.js
  loadGame();
}

function returnToMainMenu() {
  stopGame();
  hideOverlays();
  hideStageAndCanvas(); // Aus game.js
  hideElementById("mobile-controls");
  
  resetWorld(); // Aus game.js
  showElementById("main-menu");
  playMenuMusic();
}

/**
 * ==========================================
 * 5. UI HELPER & OVERLAYS
 * ==========================================
 */

function showHelpScreen() {
  showElementById("menu-help");
}

function hideHelpScreen() {
  hideElementById("menu-help");
}

function showSettingsScreen() {
  showElementById("menu-settings");
}

function hideSettingsScreen() {
  hideElementById("menu-settings");
}

function hideOverlays() {
  hideElementById("game-over-screen");
  hideElementById("you-won-screen");
}

// Generische Helper

function hideElementById(elementId) {
  const element = document.getElementById(elementId);
  if (element) element.classList.add("d-none");
}

function showElementById(elementId) {
  const element = document.getElementById(elementId);
  if (element) element.classList.remove("d-none");
}

function addClickHandlerById(elementId, handler) {
  const element = document.getElementById(elementId);
  if (element) element.addEventListener("click", handler);
}