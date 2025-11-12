let canvas;
let ctx;
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
  initializeCanvas(); 
  drawStartScreenImage(); 
  initializeGameControls();
});

window.addEventListener("keydown", (e) => updateKeyboardState(e, true));
window.addEventListener("keyup", (e) => updateKeyboardState(e, false));

function initializeCanvas() {
  canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
  ctx = canvas.getContext("2d");
}

function drawStartScreenImage() {
  if (!ctx || !canvas) return;

  const img = new Image();
  img.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  img.onload = () => {
    const w = canvas.width, h = canvas.height;
    const scale = Math.max(w / img.width, h / img.height);
    const newW = img.width * scale, newH = img.height * scale;
    const posX = (w - newW) / 2, posY = (h - newH) / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, posX, posY, newW, newH);
  };
}


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
  startGame(); 
  createGameWorld(); 
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
