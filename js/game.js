/**
 * Core game state and engine-related helpers.
 * Handles world, canvas, keyboard and intervals.
 */

let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];

/**
 * Maps keyboard key codes to logical in-game actions.
 */
const keyMap = {
  39: "RIGHT",
  37: "LEFT",
  38: "UP",
  40: "DOWN",
  32: "SPACE",
  68: "D",
};

/**
 * Updates keyboard state when a key is pressed or released.
 * 
 * @param {KeyboardEvent} event 
 * @param {boolean} isPressed - True on keydown, false on keyup.
 */
function updateKeyboardState(event, isPressed) {
  const action = keyMap[event.keyCode];
  if (!action) return;
  keyboard[action] = isPressed;
}

/**
 * Registers keyboard listeners for game controls.
 */
window.addEventListener("keydown", (event) => updateKeyboardState(event, true));
window.addEventListener("keyup", (event) => updateKeyboardState(event, false));

/**
 * Finds and shows the canvas element used for rendering.
 */
function initializeCanvas() {
  canvas = document.getElementById("canvas");
  if (!canvas) return;
  canvas.classList.remove("d-none");
}

/**
 * Clears the visible canvas completely.
 */
function clearCanvas() {
  if (!canvas) return;
  const canvasRenderingContext = canvas.getContext("2d");
  if (!canvasRenderingContext) return;
  canvasRenderingContext.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Hides the game stage and clears the canvas drawing area.
 */
function hideStageAndCanvas() {
  const stage = document.getElementById("stage");
  if (stage) stage.classList.add("d-none");
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement) return;
  canvasElement.classList.add("d-none");
  const canvasRenderingContext = canvasElement.getContext("2d");
  if (!canvasRenderingContext) return;
  canvasRenderingContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
}

/**
 * Resets world reference and creates a fresh keyboard instance.
 */
function resetWorld() {
  world = null;
  keyboard = new Keyboard();
}

/**
 * Creates a new game world instance for the current canvas,
 * keyboard and predefined level.
 */
function createGameWorld() {
  world = new World(canvas, keyboard, level1);
}

/**
 * Wrapper around setInterval that stores the ID
 * so all intervals can be cleared later.
 * 
 * @param {Function} fn - Callback for the interval.
 * @param {number} time - Interval delay in ms.
 */
function setStopableIntervall(fn, time) {
  const intervalId = setInterval(fn, time);
  intervalIds.push(intervalId);
}

/**
 * Stops the game loop by clearing all registered intervals.
 */
function stopGame() {
  clearAllIntervals();
  resetIntervalStorage();
}

/**
 * Clears all stored interval IDs.
 */
function clearAllIntervals() {
  intervalIds.forEach((intervalId) => clearInterval(intervalId));
}

/**
 * Empties the interval ID storage array.
 */
function resetIntervalStorage() {
  intervalIds = [];
}

/**
 * Detects if the current device supports touch input.
 * 
 * @returns {boolean}
 */
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Collects references to all mobile control buttons.
 * 
 * @returns {{controls: HTMLElement|null, left: HTMLElement|null, right: HTMLElement|null, jump: HTMLElement|null, throwBtn: HTMLElement|null}}
 */
function getMobileButtons() {
  return {
    controls: document.getElementById("mobile-controls"),
    left:     document.getElementById("btn-left"),
    right:    document.getElementById("btn-right"),
    jump:     document.getElementById("btn-jump"),
    throwBtn: document.getElementById("btn-throw"),
  };
}

/**
 * Binds touchstart/touchend events for a button
 * to simulate key presses via callbacks.
 * 
 * @param {HTMLElement|null} button 
 * @param {Function} onDown 
 * @param {Function} onUp 
 */
function bindTouchButton(button, onDown, onUp) {
  if (!button) return;
  const start = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDown();
  };
  const end = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onUp();
  };
  button.addEventListener("touchstart", start);
  button.addEventListener("touchend", end);
  button.addEventListener("touchcancel", end);
}

/**
 * Maps mobile touch buttons to the internal keyboard state
 * so the game can be controlled on touch devices.
 * 
 * @param {*} btns - Object returned from getMobileButtons().
 */
function bindMobileControlsToKeyboard(btns) {
  bindTouchButton(btns.left,     () => keyboard.LEFT  = true,  () => keyboard.LEFT  = false);
  bindTouchButton(btns.right,    () => keyboard.RIGHT = true,  () => keyboard.RIGHT = false);
  bindTouchButton(btns.jump,     () => keyboard.SPACE = true,  () => keyboard.SPACE = false);
  bindTouchButton(btns.throwBtn, () => keyboard.D     = true,  () => keyboard.D     = false);
}

/**
 * Initializes mobile controls if a touch device is detected.
 * Shows the mobile controls bar and binds touch events.
 */
function initMobileControls() {
  if (!isTouchDevice()) return;
  const btns = getMobileButtons();
  if (!btns.controls) return;
  btns.controls.classList.remove("d-none");
  bindMobileControlsToKeyboard(btns);
}

/**
 * Toggles fullscreen mode for the whole document.
 */
function toggleFullscreen() {
  const documentRootElement = document.documentElement;
  if (!document.fullscreenElement) {
    enterFullscreen(documentRootElement);
  } else {
    exitFullscreen();
  }
}

/**
 * Requests fullscreen mode on the given element
 * using vendor-prefixed methods where necessary.
 * 
 * @param {HTMLElement} element 
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode using the appropriate browser API.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
