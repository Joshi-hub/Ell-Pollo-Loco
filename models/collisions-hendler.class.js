class CollisionHandler {
  constructor(world) {
    this.world = world;
    this.deathTimeoutSet = false;
  }

  checkAllCollisions() {
    if (this.world.isGameFinished) return;
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottlePickup();
    this.checkFlaskVsEndboss();
    this.removeCompletedSplashes();
  }

  checkEnemyCollisions() {
    if (!this.hasValidEnemyState()) return;
    const char = this.world.character;
    if (char.isDead?.()) return;
    const now = Date.now();
    this.world.level.enemies.forEach((enemy) => {
      if (!char.isColliding(enemy)) return;
      if (enemy instanceof Endboss) {
        this.handleEndbossCollision(char, enemy, now);
      } else {
        this.handleRegularEnemyCollision(char, enemy, now);
      }
    });
  }

  hasValidEnemyState() {
    return (
      this.world &&
      this.world.level &&
      Array.isArray(this.world.level.enemies) &&
      this.world.level.enemies.length > 0
    );
  }

  handleEndbossCollision(char, enemy, now) {
    if (this.hasActiveStompGrace(char, now)) return;
    this.handlePlayerDamage(enemy);
  }

  handleRegularEnemyCollision(char, enemy, now) {
    if (enemy._deadByStomp) return;
    const isFallingDown = char.speedY < 0;
    const charBottom = char.y + char.height - 50;
    const isAboveEnemy = charBottom < enemy.y;
    if (isFallingDown && isAboveEnemy) {
      this.killEnemyByStomp(char, enemy, now);
      return;
    }
    if (this.hasActiveStompGrace(char, now)) return;
    this.handlePlayerDamage(enemy);
  }

  hasActiveStompGrace(char, now) {
    return char._stompGraceUntil && now < char._stompGraceUntil;
  }

  killEnemyByStomp(char, enemy, now) {
    if (enemy.deathSound && typeof enemy.playSound === 'function') {
        enemy.playSound(enemy.deathSound);
    }
    enemy._deadByStomp = true;
    enemy.playAnimation?.(enemy.IMAGES_DEAD || []);
    char.speedY = 25;
    char._stompGraceUntil = now + 120;
    setTimeout(() => {
        const i = this.world.level.enemies.indexOf(enemy);
        if (i !== -1) {
            this.world.level.enemies.splice(i, 1);
        }
    }, 100);
}

  handlePlayerDamage(enemy) {
    const char = this.world.character;
    if (this.shouldSkipDamage(char)) return;
    if (enemy instanceof Endboss) {
      this.applyEndbossDamage(char);
    } else {
      this.applyRegularEnemyDamage(char);
    }
    this.updateStatusAndMaybeEndGame(char);
  }

  shouldSkipDamage(char) {
    return char.isDead?.() || char.isHurt?.();
  }
  
  applyEndbossDamage(char) {
    char.energy = Math.max(0, char.energy - 20);
    char.lastHit = Date.now();
    char.playSound?.(char.hurtSound);
  }
  
  applyRegularEnemyDamage(char) {
    char.hit();
  }
  
  updateStatusAndMaybeEndGame(char) {
    this.world.statusBar.setPercentage(char.energy);
    if (char.energy <= 0 && !this.deathTimeoutSet) {
      this.deathTimeoutSet = true;
  
      setTimeout(() => {
        this.world.handleGameOver(false);
      }, 1500);
    }
  }
  
  checkCoinCollisions() {
    const coinsToRemove = [];
    this.world.level.coins.forEach((coin, i) => {
      if (this.world.character.isColliding(coin)) {
        coin.playSound?.();
        coinsToRemove.push(i);
        this.increaseCoinAmount();
      }
    });
    for (let i = coinsToRemove.length - 1; i >= 0; i--) {
      this.world.level.coins.splice(coinsToRemove[i], 1);
    }
  }

  increaseCoinAmount() {
    this.world.coinAmount++;
    this.world.coinStatusBar.setPercentage(this.world.coinAmount);
  }

  checkBottlePickup() {
    if (this.world.bottleAmount >= 5) return;
    const bottlesToRemove = [];
    this.world.level.bottles.forEach((bottle, i) => {
      if (this.world.character.isColliding(bottle)) {
        bottlesToRemove.push(i);
        this.increaseBottleAmount();
      }
    });
    for (let i = bottlesToRemove.length - 1; i >= 0; i--) {
      this.world.level.bottles.splice(bottlesToRemove[i], 1);
    }
  }

  increaseBottleAmount() {
    this.world.bottleAmount = Math.min(this.world.bottleAmount + 1, 5);
    const percentage = (this.world.bottleAmount / 5) * 100;
    this.world.bottleStatusBar.setPercentage(percentage);
  }

  checkFlaskVsEndboss() {
    if (!this.hasFlasksOrEndboss()) return;

    const flasksToRemove = [];

    this.world.throwableObjects.forEach((flask, flaskIndex) => {
      this.world.level.enemies.forEach((enemy) => {
        if (this.shouldFlaskHitEndboss(flask, enemy)) {
          this.handleFlaskEndbossHit(flask, flaskIndex, enemy, flasksToRemove);
        }
      });
    });

    this.removeUsedFlasks(flasksToRemove);
  }

  hasFlasksOrEndboss() {
    return (
      this.world &&
      Array.isArray(this.world.throwableObjects) &&
      this.world.throwableObjects.length > 0 &&
      this.world.level &&
      Array.isArray(this.world.level.enemies) &&
      this.world.level.enemies.some((e) => e instanceof Endboss)
    );
  }

  shouldFlaskHitEndboss(flask, enemy) {
    return (
      enemy instanceof Endboss && flask.isColliding(enemy) && !flask.isImpacting
    );
  }

  handleFlaskEndbossHit(flask, flaskIndex, enemy, flasksToRemove) {
    enemy.takeDamage();
    this.world.endbossStatusBar.updateStatusBar();
    flask.triggerImpact(enemy);
    if (enemy.health <= 0) {
      this.world.handleGameOver(true);
    }
    this.scheduleFlaskRemoval(flask, flaskIndex, flasksToRemove);
  }

  scheduleFlaskRemoval(flask, flaskIndex, flasksToRemove) {
    setTimeout(() => {
      if (flask.splashAnimationComplete) {
        flasksToRemove.push(flaskIndex);
      }
    }, 600);
  }

  removeUsedFlasks(flasksToRemove) {
    for (let i = flasksToRemove.length - 1; i >= 0; i--) {
      this.world.throwableObjects.splice(flasksToRemove[i], 1);
    }
  }

  removeCompletedSplashes() {
    const flasksToRemove = [];
    this.world.throwableObjects.forEach((flask, index) => {
      if (flask.splashAnimationComplete) flasksToRemove.push(index);
    });
    this.removeUsedFlasks(flasksToRemove);
  }
}
