/**
 * Main game world controller.
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

  /**
   * Creates a new World.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Keyboard} keyboard - The keyboard controller.
   * @param {Level} level - The game level.
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level; // muss ein echtes Level sein!
    this.lastThrowTime = 0;
    this.throwCooldown = 300;

    this.collisionHandler = new CollisionHandler(this);

    this.setWorld(); // setzt world-Referenzen auf Character/Endboss

    // Boss erst holen, wenn Level sicher da ist:
    const boss = this.getEndboss();
    this.endbossStatusBar = boss ? new EndbossStatusBar(boss) : null;

    this.draw();
    this.run();
  }

  /**
   * Links the character to the world.
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
   * Main game loop for collision and actions.
   */
  run() {
    setInterval(() => {
      this.collisionHandler.checkAllCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  /**
   * Handles bottle throwing logic.
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
   * Checks if player can throw a bottle right now.
   * @param {number} now - Current time in milliseconds
   * @returns {boolean} True if bottle can be thrown
   */
  canThrowBottle(now) {
    const keyPressed = this.keyboard.D;
    const cooldownPassed = now - this.lastThrowTime > this.throwCooldown;
    const hasBottles = this.bottleAmount > 0;
    return keyPressed && cooldownPassed && hasBottles;
  }

  /**
   * Creates and throws a new bottle.
   */
  throwNewBottle() {
    let bottle = new ThrowableObjects(this.character.x, this.character.y);
    this.throwableObjects.push(bottle);
  }

  /**
   * Updates the last throw time.
   * @param {number} now - Current time in milliseconds
   */
  updateThrowCooldown(now) {
    this.lastThrowTime = now;
  }

  /**
   * Decreases bottle amount and updates status bar.
   */
  decreaseBottleAmount() {
    this.bottleAmount--;
    const percentage = (this.bottleAmount / 5) * 100;
    this.bottleStatusBar.setPercentage(percentage);
  }

  /**
   * Gets the endboss from the level.
   * @returns {Endboss} The endboss enemy
   */
  getEndboss() {
  const enemies = this.level?.enemies || [];
  return enemies.find(e => e instanceof Endboss) || null;
}


  /**
   * Main render loop.
   */
  draw() {
    this.clearCanvas();
    this.drawBackgroundObjects();
    this.drawFixedObjects();
    this.drawGameObjects();
    this.scheduleNextFrame();
  }

  /**
   * Clears the canvas for the next frame.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width + 100, this.canvas.height + 100);
  }

  /**
   * Draws all background objects (background, clouds, items).
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
   * Draws fixed UI elements (status bars).
   */
  drawFixedObjects() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
  }

  /**
   * Draws moving game objects (character, enemies, bottles).
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
   * Schedules the next animation frame.
   */
  scheduleNextFrame() {
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds multiple objects to the map.
   * @param {DrawableObjects[]} objects
   */
  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Renders a single object to the map.
   * @param {DrawableObjects} mo
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
   * Flips the object's image horizontally.
   * @param {DrawableObjects} mo
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the flipped object's image.
   * @param {DrawableObjects} mo
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
