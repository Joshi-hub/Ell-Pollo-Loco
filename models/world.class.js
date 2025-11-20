/**
 * Represents the main game world.
 * 
 * Manages:
 * - the current level and all its objects
 * - the player character and input handling
 * - drawing order and camera movement
 * - throwable objects and bottle logic
 * - win/lose flow and end screens
 */
class World {
  character = new Character();
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinStatusBar = new CoinStatusBar();
  bottleStatusBar = new BottleStatusBar();
  throwableObjects = [];
  bottleAmount = 0;
  coinAmount = 0;
  winSound = new Audio('audio/win.mp3');
  gameOverSound = new Audio('audio/gameover2.ogg');

  /**
   * Creates a new World instance bound to a canvas, a keyboard handler
   * and a level definition. Initializes drawing, collision handling and
   * the main update loop.
   * 
   * @param {HTMLCanvasElement} canvas - The canvas used to render the world.
   * @param {Keyboard} keyboard - Input state used by the character.
   * @param {Level} level - The current level configuration.
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.lastThrowTime = 0;
    this.throwCooldown = 1500;
    this.collisionHandler = new CollisionHandler(this);
    this.setWorld();
    const boss = this.getEndboss();
    this.endbossStatusBar = boss ? new EndbossStatusBar(boss) : null;
    this.draw();
    this.run();
  }

  /**
   * Links the world back into character and enemies,
   * so they can access world state and objects.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  /**
   * Starts the core game loop for collision checks
   * and throw input checks.
   */
  run() {
    setInterval(() => {
      this.collisionHandler.checkAllCollisions();
      this.checkThrowObjects();
    }, 1000 / 60);
  }

  /**
   * Handles bottle throwing logic based on input, cooldown
   * and available bottle count.
   */
  checkThrowObjects() {
    const now = Date.now();

    if (this.canThrowBottle(now)) {
      this.throwNewBottle();
      this.updateThrowCooldown(now);
      this.decreaseBottleAmount();
    }
  }

  /**
   * Evaluates if the player is allowed to throw a bottle
   * at the current time.
   * 
   * @param {number} now - Current timestamp in milliseconds.
   * @returns {boolean} True if the player can throw a bottle.
   */
  canThrowBottle(now) {
    const keyPressed = this.keyboard.D;
    const cooldownPassed = now - this.lastThrowTime > this.throwCooldown;
    const hasBottles = this.bottleAmount > 0;
    return keyPressed && cooldownPassed && hasBottles;
  }

  /**
   * Creates and adds a new throwable bottle at the character's position.
   */
  throwNewBottle() {
    let bottle = new ThrowableObjects(this.character.x, this.character.y);
    this.throwableObjects.push(bottle);
  }

  /**
   * Updates the internal cooldown timestamp for throwing.
   * 
   * @param {number} now - Current timestamp in milliseconds.
   */
  updateThrowCooldown(now) {
    this.lastThrowTime = now;
  }

  /**
   * Decreases the bottle count and updates the bottle status bar.
   */
  decreaseBottleAmount() {
    this.bottleAmount--;
    const percentage = (this.bottleAmount / 5) * 100;
    this.bottleStatusBar.setPercentage(percentage);
  }

  /**
   * Finds and returns the Endboss instance from the level's enemies, if any.
   * 
   * @returns {Endboss|null} The Endboss or null if not present.
   */
  getEndboss() {
    const enemies = this.level?.enemies || [];
    return enemies.find((e) => e instanceof Endboss) || null;
  }

  /**
   * Main render method. Clears the canvas, draws background,
   * fixed HUD elements and all game objects, then schedules
   * the next frame.
   */
  draw() {
    this.clearCanvas();
    this.drawBackgroundObjects();
    this.drawFixedObjects();
    this.drawGameObjects();
    this.scheduleNextFrame();
  }

  /**
   * Clears the visible canvas area.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width + 100, this.canvas.height + 100);
  }

  /**
   * Draws background elements such as tiles, clouds, bottles and coins,
   * translated by the camera offset.
   */
  drawBackgroundObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObjects);
    this.addObjectToMap(this.level.clouds);
    this.addObjectToMap(this.level.bottles);
    this.addObjectToMap(this.level.coins);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws HUD elements that do not move with the camera
   * (status bars, UI overlays).
   */
  drawFixedObjects() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
  }

  /**
   * Draws all dynamic game objects such as enemies, thrown bottles,
   * the player and the Endboss status bar, all translated by camera offset.
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.throwableObjects);
    this.addToMap(this.character);
    if (this.endbossStatusBar) this.addToMap(this.endbossStatusBar);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Requests the next animation frame and continues the draw loop.
   */
  scheduleNextFrame() {
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds an array of drawable objects to the map and renders each of them.
   * 
   * @param {DrawableObjects[]} objects - List of objects to draw.
   */
  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single movable/drawable object, handling mirroring if needed.
   * 
   * @param {DrawableObjects} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawBorder(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the rendering context horizontally for mirrored drawing.
   * 
   * @param {DrawableObjects} mo - The object whose image should be flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the object's X position and restores the context
   * after a horizontal flip.
   * 
   * @param {DrawableObjects} mo - The object whose image was flipped.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Plays the win sound if global sound is enabled.
   */
  playWinSound() {
    if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
    if (!this.winSound) return;
    this.winSound.currentTime = 0;
    this.winSound.play().catch(() => {});
  }

  /**
   * Plays the game over sound if global sound is enabled.
   */
  playGameOverSound() {
    if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
    if (!this.gameOverSound) return;
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play().catch(() => {});
  }

  /**
   * Handles the end of the game: stops animations,
   * sets the result, plays music and updates end screens.
   * 
   * @param {boolean} [isWin=false] - True if the player has won.
   */
  handleGameOver(isWin = false) {
    this.stopAllAnimations();
    this.setGameResult(isWin);
    this.playEndMusic();
    this.updateEndScreens();
  }
  
  /**
   * Stops all running animations for character and enemies.
   */
  stopAllAnimations() {
    this.character?.stopAnimation?.();
    this.level?.enemies?.forEach((e) => e?.stopAnimation?.());
  }
  
  /**
   * Stores the game result flags (finished and won/lost).
   * 
   * @param {boolean} isWin - True if the game has been won.
   */
  setGameResult(isWin) {
    this.isGameFinished = true;
    this.isGameWon = !!isWin;
  }
  
  /**
   * Plays the appropriate end music depending on whether
   * the player has won or lost.
   */
  playEndMusic() {
    if (this.isGameWon) {
      this.playWinSound();
    } else {
      this.playGameOverSound();
    }
  }
  
  /**
   * Updates the visibility of the end screens and hides the canvas.
   * Shows either the win screen or the game over screen.
   */
  updateEndScreens() {
    const lose = document.getElementById("game-over-screen");
    const win = document.getElementById("you-won-screen");
    const canvas = document.getElementById("canvas");
    canvas?.classList.add("d-none");
    if (this.isGameWon) {
      win?.classList.remove("d-none");
      lose?.classList.add("d-none");
    } else {
      lose?.classList.remove("d-none");
      win?.classList.add("d-none");
    }
  }  
}
