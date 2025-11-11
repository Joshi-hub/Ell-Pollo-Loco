let canvas;
let world;
let keyboard = new Keyboard();
let startBtn;
let startRef;
let intervallIds = [];

const keyMap = {
  39: "RIGHT",
  37: "LEFT",
  38: "UP",
  40: "DOWN",
  32: "SPACE",
  68: "D",
};

document.addEventListener("DOMContentLoaded", () => {
  initializeGameControls();
});

window.addEventListener("keydown", (e) => {
  updateKeyboardState(e, true);
});

window.addEventListener("keyup", (e) => {
  updateKeyboardState(e, false);
});

function initializeGameControls() {
  setupElementReferences();
  attachEventListeners();
}

function setupElementReferences() {
  startBtn = document.getElementById("play-btn");
  startRef = document.getElementById("start-game");
}

function attachEventListeners() {
  const helpBtn = document.getElementById("help-btn");
  const backToMenuBtn = document.getElementById("back-to-menu-btn");

  startBtn.addEventListener("click", handleStartButtonClick);
  helpBtn.addEventListener("click", showHelpScreen);
  backToMenuBtn.addEventListener("click", hideHelpScreen);
}

function updateKeyboardState(e, isPressed) {
  if (keyMap[e.keyCode]) {
    keyboard[keyMap[e.keyCode]] = isPressed;
  }
}

function handleStartButtonClick() {
  hideStartScreen();
  loadGame();
}

function hideStartScreen() {
  startRef.classList.add("d-none");
}

function loadGame() {
  initializeCanvas();
  createGameWorld();
}

function initializeCanvas() {
  canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
  startGame();
}

function createGameWorld() {
  world = new World(canvas, keyboard, level1);
}

function showHelpScreen() {
  hideElementById("start-game");
  showElementById("help-screen");
}

function hideHelpScreen() {
  hideElementById("help-screen");
  showElementById("start-game");
}

function toggleScreenContent(hideId, showId) {
  hideElementById(hideId);
  showElementById(showId);
}

function hideElementById(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add("d-none");
  }
}

function showElementById(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove("d-none");
  }
}

function setStopableIntervall(fn, time) {
  const id = setInterval(fn, time);
  intervallIds.push(id);
}

function stopGame() {
  clearAllIntervals();
  resetIntervalStorage();
}

function clearAllIntervals() {
  intervallIds.forEach((id) => {
    clearInterval(id);
  });
}

function resetIntervalStorage() {
  intervallIds = [];
}

const title = document.getElementById("title");

function wrapTitleText() {
  if (!title || title.dataset.wrapped) return;
  title.dataset.wrapped = "1";
  const text = title.textContent;
  title.textContent = "";
  Array.from(text).forEach((ch, i) => {
    const s = document.createElement("span");
    s.className = "title-char enter";
    s.style.setProperty("--i", i);
    s.textContent = ch === " " ? "\u00A0" : ch;
    title.appendChild(s);
  });
}

function stopAnimationAfterEnd() {
  const last = title ? title.lastElementChild : null;
  if (!last) return;
  last.addEventListener(
    "animationend",
    () => {
      const chars = title.querySelectorAll(".title-char");
      chars.forEach((el) => {
        el.classList.remove("enter");
        el.style.animation = "";
        el.classList.add("wave");
      });
      startTitleRipples();
    },
    { once: true }
  );
}

function startTitleRipples() {
  const chars = Array.from(title.querySelectorAll(".title-char"));
  if (!chars.length) return;
  let i = 0;
  if (window.__titleRippleInterval) {
    clearInterval(window.__titleRippleInterval);
  }
  window.__titleRippleInterval = setInterval(() => {
    const el = chars[i % chars.length];
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
    i++;
  }, 90);
}

wrapTitleText();
stopAnimationAfterEnd();

// function fullscreen() {
//     let fullscreen = document.getElementById('fullscreen');
//     enterFullscreen(fullscreen);
//   }

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

function toggleFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    enterFullscreen(canvas);
  } else {
    exitFullscreen();
  }
}

document.getElementById("restart-btn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("menu-btn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("restart-won-btn").addEventListener("click", () => {
  location.reload();
});

function clampValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setCssVariable(element, variableName, value) {
  element.style.setProperty(variableName, value);
}

function clearTiltVariables(element) {
  element.style.removeProperty('--tx');
  element.style.removeProperty('--ty');
}

function applyTiltFromMouse(element, event, maxTiltDegrees) {
  const rect = element.getBoundingClientRect();
  const relativeX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
  const relativeY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
  const tiltY = clampValue(relativeX, -1, 1) * maxTiltDegrees;
  const tiltX = clampValue(-relativeY, -1, 1) * maxTiltDegrees;
  setCssVariable(element, '--tx', `${tiltX.toFixed(2)}deg`);
  setCssVariable(element, '--ty', `${tiltY.toFixed(2)}deg`);
}

function enableStageTiltEffect() {
  const stageElement = document.querySelector('.stage');
  const canvasElement = document.getElementById('canvas');
  if (!stageElement || !canvasElement) return;

  stageElement.addEventListener('mousemove', (event) =>
    applyTiltFromMouse(stageElement, event, 6)
  );
  stageElement.addEventListener('mouseleave', () =>
    clearTiltVariables(stageElement)
  );
}

function createSparkEffects(buttonElement) {
  if (buttonElement.querySelector('.sparks')) return;
  const sparkContainer = document.createElement('div');
  sparkContainer.className = 'sparks';

  for (let i = 0; i < 10; i++) {
    const sparkDot = document.createElement('i');
    sparkDot.style.left = `${10 + Math.random() * 80}%`;
    sparkDot.style.top = `${40 + Math.random() * 40}%`;
    sparkContainer.appendChild(sparkDot);
  }
  buttonElement.appendChild(sparkContainer);
}

function enableButtonTiltEffect(buttonElement) {
  buttonElement.addEventListener('mousemove', (event) =>
    applyTiltFromMouse(buttonElement, event, 10)
  );
  buttonElement.addEventListener('mouseleave', () =>
    clearTiltVariables(buttonElement)
  );
}

function initializeGameButtons() {
  const gameButtons = document.querySelectorAll('.game-btn');
  gameButtons.forEach((buttonElement) => {
    createSparkEffects(buttonElement);
    enableButtonTiltEffect(buttonElement);
  });
}

function createConfettiBurst(targetElement) {
  const confettiLayer = document.createElement('div');
  confettiLayer.style.cssText =
    'position:absolute;inset:0;pointer-events:none;overflow:visible';
  if (getComputedStyle(targetElement).position === 'static')
    targetElement.style.position = 'relative';
  targetElement.appendChild(confettiLayer);

  for (let i = 0; i < 20; i++) {
    const confettiPiece = document.createElement('span');
    const size = 4 + Math.random() * 6;
    confettiPiece.style.cssText = `
      position:absolute;left:50%;top:50%;width:${size}px;height:${size}px;
      background:hsl(${Math.random() * 360},90%,60%);
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      opacity:0.9;transform:translate(-50%,-50%);
      transition:transform 600ms cubic-bezier(.2,.8,.2,1),opacity 700ms;
    `;
    confettiLayer.appendChild(confettiPiece);

    requestAnimationFrame(() => {
      const moveX = (Math.random() * 2 - 1) * 80;
      const moveY = -80 - Math.random() * 80;
      confettiPiece.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${Math.random() * 720}deg)`;
      confettiPiece.style.opacity = '0';
    });
  }
  setTimeout(() => confettiLayer.remove(), 750);
}

function shakeCanvas() {
  const canvasElement = document.getElementById('canvas');
  if (!canvasElement) return;
  canvasElement.classList.add('shake');
  setTimeout(() => canvasElement.classList.remove('shake'), 420);
}

function addClickEffectsToButtons() {
  const gameButtons = document.querySelectorAll('.game-btn');
  gameButtons.forEach((buttonElement) => {
    buttonElement.addEventListener('click', () => {
      createConfettiBurst(buttonElement);
      shakeCanvas();
    });
  });
}

function createSingleDustParticle(dustContainer) {
  const dustParticle = document.createElement('i');
  dustParticle.className = 'd';
  dustParticle.style.left = `${Math.random() * 100}vw`;
  dustParticle.style.setProperty('--x', `${Math.random() * 60 - 30}px`);
  dustParticle.style.animationDelay = `${Math.random() * 8}s`;
  dustParticle.style.animationDuration = `${6 + Math.random() * 6}s`;
  dustContainer.appendChild(dustParticle);
}

function initializeDustParticles() {
  const dustContainer = document.getElementById('dust');
  if (!dustContainer) return;
  for (let i = 0; i < 60; i++) createSingleDustParticle(dustContainer);
}

function wrapTitleLettersInSpans(titleElement) {
  if (!titleElement || titleElement.querySelector('.title-char')) return;
  const originalText = titleElement.textContent;
  titleElement.textContent = '';
  for (const letter of originalText) {
    const spanElement = document.createElement('span');
    spanElement.className = 'title-char';
    spanElement.textContent = letter;
    titleElement.appendChild(spanElement);
  }
}

function startTitleLetterPing() {
  const titleElement = document.getElementById('title');
  if (!titleElement) return;
  wrapTitleLettersInSpans(titleElement);
  const letters = Array.from(titleElement.querySelectorAll('.title-char'));
  if (!letters.length) return;

  if (window.__titlePing) clearInterval(window.__titlePing);
  let currentIndex = 0;
  let direction = 1;

  window.__titlePing = setInterval(() => {
    const currentLetter = letters[currentIndex];
    if (currentLetter) {
      currentLetter.classList.remove('pop');
      void currentLetter.offsetWidth;
      currentLetter.classList.add('pop');
    }
    currentIndex += direction;
    if (currentIndex >= letters.length - 1 || currentIndex <= 0) direction *= -1;
  }, 95);
}

function initializeUiEffects() {
  enableStageTiltEffect();
  initializeGameButtons();
  addClickEffectsToButtons();
  initializeDustParticles();
  startTitleLetterPing();
}

document.addEventListener('DOMContentLoaded', initializeUiEffects);

