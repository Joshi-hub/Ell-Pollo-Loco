class CollisionHandler {
  constructor(world) {
    this.world = world;
  }

  checkAllCollisions() {
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottlePickup();
    this.checkFlaskVsEndboss();
    this.removeCompletedSplashes();
  }

  checkEnemyCollisions() {
    if (!this.world || !this.world.level || !this.world.level.enemies) return;
  
    const char = this.world.character;
    const now = Date.now();
  
    this.world.level.enemies.forEach((enemy, index) => {
      if (!char.isColliding(enemy)) return;
  
      if (enemy instanceof Endboss) {
        if (char._stompGraceUntil && now < char._stompGraceUntil) return;
        this.handlePlayerDamage(enemy);
        return;
      }if (enemy._deadByStomp) return;
      const isFallingDown = char.speedY < 0;           
      const charBottom    = char.y + char.height - 50;
      const isAboveEnemy  = charBottom < enemy.y;
  
      if (isFallingDown && isAboveEnemy) {
        enemy._deadByStomp = true;                     
        enemy.playAnimation?.(enemy.IMAGES_DEAD || []);
        char.speedY = 25;                           
        char._stompGraceUntil = now + 120;               
        setTimeout(() => {
          const i = this.world.level.enemies.indexOf(enemy);
          if (i !== -1) this.world.level.enemies.splice(i, 1);
        }, 100);
        return; 
      }
      if (char._stompGraceUntil && now < char._stompGraceUntil) return;
      this.handlePlayerDamage(enemy);
    });
  }
  
  handlePlayerDamage(enemy) {
    const char = this.world.character;
    if (char.isHurt?.()) return;
    if (enemy instanceof Endboss) {
      char.energy = Math.max(0, char.energy - 20);
      char.lastHit = Date.now();
    } else {
      char.hit();}
    this.world.statusBar.setPercentage(char.energy);
    if (char.energy <= 0) {
      this.world.handleGameOver(false);
    }
  }
  
  checkCoinCollisions() {
    const coinsToRemove = [];
    this.world.level.coins.forEach((coin, i) => {
      if (this.world.character.isColliding(coin)) {
        coin.playSound();
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
    const flasksToRemove = [];

    this.world.throwableObjects.forEach((flask, flaskIndex) => {
      this.world.level.enemies.forEach((enemy) => {
        if (
          enemy instanceof Endboss &&
          flask.isColliding(enemy) &&
          !flask.isImpacting
        ) {
          enemy.takeDamage();
          this.world.endbossStatusBar.updateStatusBar();
          flask.triggerImpact(enemy);

          if (enemy.health <= 0) {
            this.world.handleGameOver(true);
          }

          setTimeout(() => {
            if (flask.splashAnimationComplete) {
              flasksToRemove.push(flaskIndex);
            }
          }, 600);
        }
      });
    });

    this.removeUsedFlasks(flasksToRemove);
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
