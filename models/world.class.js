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

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.lastThrowTime = 0;
    this.throwCooldown = 300;
    this.collisionHandler = new CollisionHandler(this);
    this.setWorld();
    const boss = this.getEndboss();
    this.endbossStatusBar = boss ? new EndbossStatusBar(boss) : null;
    this.draw();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  run() {
    setInterval(() => {
      this.collisionHandler.checkAllCollisions();
      this.checkThrowObjects();
    }, 1000 / 60);
  }

  checkThrowObjects() {
    const now = Date.now();

    if (this.canThrowBottle(now)) {
      this.throwNewBottle();
      this.updateThrowCooldown(now);
      this.decreaseBottleAmount();
    }
  }

  canThrowBottle(now) {
    const keyPressed = this.keyboard.D;
    const cooldownPassed = now - this.lastThrowTime > this.throwCooldown;
    const hasBottles = this.bottleAmount > 0;
    return keyPressed && cooldownPassed && hasBottles;
  }

  throwNewBottle() {
    let bottle = new ThrowableObjects(this.character.x, this.character.y);
    this.throwableObjects.push(bottle);
  }

  updateThrowCooldown(now) {
    this.lastThrowTime = now;
  }

  decreaseBottleAmount() {
    this.bottleAmount--;
    const percentage = (this.bottleAmount / 5) * 100;
    this.bottleStatusBar.setPercentage(percentage);
  }

  getEndboss() {
    const enemies = this.level?.enemies || [];
    return enemies.find((e) => e instanceof Endboss) || null;
  }

  draw() {
    this.clearCanvas();
    this.drawBackgroundObjects();
    this.drawFixedObjects();
    this.drawGameObjects();
    this.scheduleNextFrame();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width + 100, this.canvas.height + 100);
  }

  drawBackgroundObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObjects);
    this.addObjectToMap(this.level.clouds);
    this.addObjectToMap(this.level.bottles);
    this.addObjectToMap(this.level.coins);
    this.ctx.translate(-this.camera_x, 0);
  }

  drawFixedObjects() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
  }

  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.throwableObjects);
    this.addToMap(this.character);
    if (this.endbossStatusBar) this.addToMap(this.endbossStatusBar);
    this.ctx.translate(-this.camera_x, 0);
  }

  scheduleNextFrame() {
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  playWinSound() {
    if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
    if (!this.winSound) return;
    this.winSound.currentTime = 0;
    this.winSound.play().catch(() => {});
  }

  playGameOverSound() {
    if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
    if (!this.gameOverSound) return;
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play().catch(() => {});
  }

  handleGameOver(isWin = false) {
    this.stopAllAnimations();
    this.setGameResult(isWin);
    this.playEndMusic();
    this.updateEndScreens();
  }
  
  stopAllAnimations() {
    this.character?.stopAnimation?.();
    this.level?.enemies?.forEach((e) => e?.stopAnimation?.());
  }
  
  setGameResult(isWin) {
    this.isGameFinished = true;
    this.isGameWon = !!isWin;
  }
  
  playEndMusic() {
    if (this.isGameWon) {
      this.playWinSound();
    } else {
      this.playGameOverSound();
    }
  }
  
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
