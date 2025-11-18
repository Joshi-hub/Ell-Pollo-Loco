let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];
let soundEnabled = true;
let menuMusicInitialized = false;

// master volume for all music/sounds (0.0 - 1.0)
let musicVolume = 0.4;

const keyMap = {
  39: "RIGHT",
  37: "LEFT",
  38: "UP",
  40: "DOWN",
  32: "SPACE",
  68: "D",
};

const menuMusic = new Audio("audio/awesomeness.mp3");
menuMusic.loop = true;
menuMusic.volume = musicVolume;

function playMenuMusic() {
  if (!soundEnabled) return;
  menuMusic.currentTime = 0;
  menuMusic.play().catch(() => {});
}

function stopMenuMusic() {
  menuMusic.pause();
}

function initMenuMusicOnce() {
  if (menuMusicInitialized) return;
  menuMusicInitialized = true;
  playMenuMusic();
}

document.addEventListener("click", initMenuMusicOnce, { once: true });

function toggleSound() {
  soundEnabled = !soundEnabled;
  updateSoundButtonIcon();
  menuMusic.muted = !soundEnabled;
  muteCharacterSoundIfAvailable();
}

function updateSoundButtonIcon() {
  const soundButtonElement = document.getElementById("sound-btn");
  if (!soundButtonElement) return;
  soundButtonElement.textContent = soundEnabled ? "🔊" : "🔇";
}

function muteCharacterSoundIfAvailable() {
  if (!world || !world.character || !world.character.sound) return;
  world.character.sound.muted = !soundEnabled;
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGameControls();
  initSoundButtonHandler();
  initOverlayButtons();
  initSettingsControls();
});

function initSoundButtonHandler() {
  addClickHandlerById("sound-btn", toggleSound);
}

function initSettingsControls() {
  const musicSlider = document.getElementById("music-volume-slider");
  const fullscreenButton = document.getElementById("settings-fullscreen-btn");

  if (musicSlider) {
    musicSlider.value = String(Math.round(musicVolume * 100));
    musicSlider.addEventListener("input", (event) => {
      const value = Number(event.target.value);
      setMusicVolumeFromPercent(value);
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", toggleFullscreen);
  }
}

function setMusicVolumeFromPercent(percent) {
  musicVolume = percent / 100;
  menuMusic.volume = musicVolume;

  if (!world || !world.character || !world.character.sound) return;
  world.character.sound.volume = musicVolume;
}

window.addEventListener("keydown", (event) =>
  updateKeyboardState(event, true)
);
window.addEventListener("keyup", (event) =>
  updateKeyboardState(event, false)
);

function updateKeyboardState(event, isPressed) {
  const action = keyMap[event.keyCode];
  if (!action) return;
  keyboard[action] = isPressed;
}

function initializeCanvas() {
  canvas = document.getElementById("canvas");
  if (!canvas) return;
  canvas.classList.remove("d-none");
}

function initializeGameControls() {
  attachMenuEventListeners();
}

function attachMenuEventListeners() {
  addClickHandlerById("play-btn", handleStartButtonClick);
  addClickHandlerById("help-btn", showHelpScreen);
  addClickHandlerById("back-to-menu-btn", hideHelpScreen);
  addClickHandlerById("settings-btn", showSettingsScreen);
  addClickHandlerById("settings-back-btn", hideSettingsScreen);
}

function addClickHandlerById(elementId, handler) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.addEventListener("click", handler);
}

function handleStartButtonClick() {
  hideStartScreen();
  loadGame();
}

function hideStartScreen() {
  const mainMenuElement = document.getElementById("main-menu");
  if (!mainMenuElement) return;
  mainMenuElement.classList.add("d-none");
}

function loadGame() {
  showElementById("stage");
  initializeCanvas();
  stopMenuMusic();
  startGame();
  createGameWorld();
}

function restartGame() {
  hideOverlays();
  stopGame();
  clearCanvas();
  loadGame();
}

function returnToMainMenu() {
  stopGame();
  hideOverlays();
  hideStageAndCanvas();
  resetWorld();
  showElementById("main-menu");
  playMenuMusic();
}

function hideOverlays() {
  hideElementById("game-over-screen");
  hideElementById("you-won-screen");
}

function hideStageAndCanvas() {
  hideElementById("stage");
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement) return;
  canvasElement.classList.add("d-none");
  const canvasRenderingContext = canvasElement.getContext("2d");
  if (!canvasRenderingContext) return;
  canvasRenderingContext.clearRect(
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
}

function clearCanvas() {
  if (!canvas) return;
  const canvasRenderingContext = canvas.getContext("2d");
  if (!canvasRenderingContext) return;
  canvasRenderingContext.clearRect(0, 0, canvas.width, canvas.height);
}

function resetWorld() {
  world = null;
  keyboard = new Keyboard();
}

function createGameWorld() {
  world = new World(canvas, keyboard, level1);
}

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

function toggleScreenContent(hideId, showId) {
  hideElementById(hideId);
  showElementById(showId);
}

function hideElementById(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.classList.add("d-none");
}

function showElementById(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.classList.remove("d-none");
}

function setStopableIntervall(fn, time) {
  const intervalId = setInterval(fn, time);
  intervalIds.push(intervalId);
}

function stopGame() {
  clearAllIntervals();
  resetIntervalStorage();
}

function clearAllIntervals() {
  intervalIds.forEach((intervalId) => clearInterval(intervalId));
}

function resetIntervalStorage() {
  intervalIds = [];
}

const titleElement = document.getElementById("title");

function wrapTitleText() {
  if (!titleElement || titleElement.dataset.wrapped) return;
  titleElement.dataset.wrapped = "1";
  const originalTitleText = titleElement.textContent;
  titleElement.textContent = "";
  Array.from(originalTitleText).forEach((character, index) => {
    titleElement.appendChild(createTitleChar(character, index));
  });
}

function createTitleChar(character, index) {
  const titleCharElement = document.createElement("span");
  titleCharElement.className = "title-char enter";
  titleCharElement.style.setProperty("--i", index);
  titleCharElement.textContent =
    character === " " ? "\u00A0" : character;
  return titleCharElement;
}

function stopAnimationAfterEnd() {
  const lastCharacterElement = titleElement
    ? titleElement.lastElementChild
    : null;
  if (!lastCharacterElement) return;
  lastCharacterElement.addEventListener(
    "animationend",
    onTitleAnimationEnd,
    { once: true }
  );
}

function onTitleAnimationEnd() {
  if (!titleElement) return;
  const characterElements =
    titleElement.querySelectorAll(".title-char");
  characterElements.forEach((characterElement) => {
    characterElement.classList.remove("enter");
    characterElement.style.animation = "";
    characterElement.classList.add("wave");
  });
  startTitleRipples();
}

function startTitleRipples() {
  const characterElements = titleElement
    ? titleElement.querySelectorAll(".title-char")
    : [];
  if (!characterElements.length) return;
  resetTitleRippleInterval();
  startTitleRippleInterval(characterElements);
}

function resetTitleRippleInterval() {
  if (!window.titleRippleIntervalId) return;
  clearInterval(window.titleRippleIntervalId);
}

function startTitleRippleInterval(characterElements) {
  let index = 0;
  window.titleRippleIntervalId = setInterval(() => {
    restartRippleAnimation(
      characterElements[index % characterElements.length]
    );
    index++;
  }, 90);
}

function restartRippleAnimation(characterElement) {
  if (!characterElement) return;
  characterElement.classList.remove("pop");
  void characterElement.offsetWidth;
  characterElement.classList.add("pop");
}

wrapTitleText();
stopAnimationAfterEnd();

function toggleFullscreen() {
  const documentRootElement = document.documentElement;
  if (!document.fullscreenElement) {
    enterFullscreen(documentRootElement);
  } else {
    exitFullscreen();
  }
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function initOverlayButtons() {
  addClickHandlerById("restart-btn", restartGame);
  addClickHandlerById("restart-won-btn", restartGame);
  addClickHandlerById("menu-btn", returnToMainMenu);
  addClickHandlerById("menu-won-btn", returnToMainMenu);
}
