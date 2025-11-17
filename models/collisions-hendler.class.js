/**
 * Handles all collision logic in the game such as
 * enemies, coins, bottles, projectiles and game-ending events.
 */
class CollisionHandler {

  /**
   * @param {World} world - Reference to the current game world instance.
   */
  constructor(world) {
    this.world = world;
    this.deathTimeoutSet = false;
    this.winTimeoutSet = false;
  }

  /**
   * Main update loop executed each frame.
   * Calls all collision-related checks.
   */
  checkAllCollisions() {
    if (this.world.isGameFinished) return;
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottlePickup();
    this.checkFlaskVsEndboss();
    this.removeCompletedSplashes();
  }

  /**
   * Checks collisions between the character and all enemies
   * (big chickens, small chickens, endboss).
   */
  checkEnemyCollisions() {
    if (!this.hasValidEnemyState()) return;
    const char = this.world.character;
    if (char.isDead?.()) return;
    const now = Date.now();
    this.world.level.enemies.forEach((enemy) => {
      if (!char.isColliding(enemy)) return;
      if (enemy instanceof Endboss) this.handleEndbossCollision(char, enemy, now);
      else {this.handleRegularEnemyCollision(char, enemy, now);}
    });
  }

  /**
   * Ensures enemy lists exist and contain entries.
   * @returns {boolean}
   */
  hasValidEnemyState() {
    return (
      this.world &&
      this.world.level &&
      Array.isArray(this.world.level.enemies) &&
      this.world.level.enemies.length > 0
    );
  }

  /**
   * Handles collisions between the player and the Endboss.
   * The Endboss does not get stomped and always damages the player.
   * 
   * @param {Character} char 
   * @param {Endboss} enemy 
   * @param {number} now - Current timestamp
   */
  handleEndbossCollision(char, enemy, now) {
    if (this.hasActiveStompGrace(char, now)) return;
    this.handlePlayerDamage(enemy);
  }

  /**
   * Handles collisions between the player and regular enemies
   * (small chicken, big chicken). Includes stomp logic.
   * 
   * @param {Character} char 
   * @param {MovableObject} enemy 
   * @param {number} now 
   */
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

  /**
   * Checks whether the player is currently protected after stomping an enemy.
   * @param {Character} char 
   * @param {number} now
   * @returns {boolean}
   */
  hasActiveStompGrace(char, now) {
    return char._stompGraceUntil && now < char._stompGraceUntil;
  }

  /**
   * Kills an enemy when the player jumps on top of it.
   * Plays death animation and removes enemy shortly after.
   * 
   * @param {Character} char 
   * @param {MovableObject} enemy 
   * @param {number} now 
   */
  killEnemyByStomp(char, enemy, now) {
    if (enemy.deathSound && typeof enemy.playSound === "function") {
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

  /**
   * Applies damage to the player depending on the enemy type.
   * 
   * @param {MovableObject} enemy 
   */
  handlePlayerDamage(enemy) {
    const char = this.world.character;
    if (this.shouldSkipDamage(char)) return;
    if (enemy instanceof Endboss) {
      this.applyEndbossDamage(char);
    } else {this.applyRegularEnemyDamage(char);}
    this.updateStatusAndMaybeEndGame(char);
  }

  /**
   * Determines whether player damage should be ignored
   * (e.g., player is already dead or currently in hurt state).
   * 
   * @param {Character} char 
   * @returns {boolean}
   */
  shouldSkipDamage(char) {
    return char.isDead?.() || char.isHurt?.();
  }

  /**
   * Applies damage taken from the Endboss.
   * @param {Character} char 
   */
  applyEndbossDamage(char) {
    char.energy = Math.max(0, char.energy - 20);
    char.lastHit = Date.now();
    char.playSound?.(char.hurtSound);
  }

  /**
   * Applies regular damage from smaller enemies.
   * @param {Character} char 
   */
  applyRegularEnemyDamage(char) {
    char.hit();
  }

  /**
   * Updates the health bar and handles game-over logic when HP <= 0.
   * @param {Character} char 
   */
  updateStatusAndMaybeEndGame(char) {
    this.world.statusBar.setPercentage(char.energy);

    if (char.energy <= 0 && !this.deathTimeoutSet) {
      this.deathTimeoutSet = true;

      setTimeout(() => {
        this.world.handleGameOver(false);
      }, 1500);
    }
  }

  /**
   * Checks collisions between player and coins.
   * Removes collected coins and updates UI.
   */
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

  /**
   * Increases the coin counter and updates the status bar.
   */
  increaseCoinAmount() {
    this.world.coinAmount++;
    this.world.coinStatusBar.setPercentage(this.world.coinAmount);
  }

  /**
   * Checks whether the player collects bottles.
   */
  checkBottlePickup() {
    if (this.world.bottleAmount >= 5) return;
    const bottlesToRemove = [];
    this.world.level.bottles.forEach((bottle, i) => {
      if (this.world.character.isColliding(bottle)) {
        bottle.playSound?.(bottle.bottleTouch);
        bottlesToRemove.push(i);
        this.increaseBottleAmount();
      }
    });
    for (let i = bottlesToRemove.length - 1; i >= 0; i--) {
      this.world.level.bottles.splice(bottlesToRemove[i], 1);
    }
  }

  /**
   * Increases bottle count and updates bottle status bar.
   */
  increaseBottleAmount() {
    this.world.bottleAmount = Math.min(this.world.bottleAmount + 1, 5);
    const percentage = (this.world.bottleAmount / 5) * 100;
    this.world.bottleStatusBar.setPercentage(percentage);
  }

  /**
   * Checks collisions between thrown flasks and the Endboss.
   */
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

  /**
   * Returns whether flasks and endboss exist.
   * @returns {boolean}
   */
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

  /**
   * Determines whether a flask hits the Endboss.
   * @param {ThrowableObject} flask 
   * @param {MovableObject} enemy 
   */
  shouldFlaskHitEndboss(flask, enemy) {
    return (
      enemy instanceof Endboss && flask.isColliding(enemy) && !flask.isImpacting
    );
  }

  /**
   * Handles impact when a flask hits the Endboss.
   */
  handleFlaskEndbossHit(flask, flaskIndex, enemy, flasksToRemove) {
    if (typeof flask.playSound === "function" && flask.bottleBreakingSound) {
      flask.playSound(flask.bottleBreakingSound);
    }
    enemy.takeDamage();
    this.world.endbossStatusBar.updateStatusBar();
    flask.triggerImpact(enemy);
    if (enemy.health <= 0) {
      this.handleEndbossDefeat();
    }
    this.scheduleFlaskRemoval(flask, flaskIndex, flasksToRemove);
  }

  /**
   * Triggers win event after defeating the Endboss.
   */
  handleEndbossDefeat() {
    if (this.winTimeoutSet) return;
    this.winTimeoutSet = true;
    setTimeout(() => {
      this.world.handleGameOver(true);
    }, 1500);
  }

  /**
   * Schedules the flask to be removed once its splash animation completes.
   */
  scheduleFlaskRemoval(flask, flaskIndex, flasksToRemove) {
    setTimeout(() => {
      if (flask.splashAnimationComplete) {
        flasksToRemove.push(flaskIndex);
      }
    }, 600);
  }

  /**
   * Removes flasks based on array of indexes.
   */
  removeUsedFlasks(flasksToRemove) {
    for (let i = flasksToRemove.length - 1; i >= 0; i--) {
      this.world.throwableObjects.splice(flasksToRemove[i], 1);
    }
  }

  /**
   * Removes all flasks whose splash animation has finished completely.
   */
  removeCompletedSplashes() {
    const flasksToRemove = [];

    this.world.throwableObjects.forEach((flask, index) => {
      if (flask.splashAnimationComplete) flasksToRemove.push(index);
    });

    this.removeUsedFlasks(flasksToRemove);
  }
}
