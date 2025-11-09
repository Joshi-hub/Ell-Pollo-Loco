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
  
      this.world.level.enemies.forEach((enemy) => {
        if (this.world.character.isColliding(enemy)) {
          this.handlePlayerDamage();
        }
      });
    }
  
    handlePlayerDamage() {
      this.world.character.hit();
      this.world.statusBar.setPercentage(this.world.character.energy);
  
      if (this.world.character.energy <= 0) {
        console.log("💀 Charakter tot → Game Over");
        this.world.handleGameOver(false);
      }
    }
  
    checkCoinCollisions() {
      const coinsToRemove = [];
      this.world.level.coins.forEach((coin, i) => {
        if (this.world.character.isColliding(coin)) {
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
  
            // Sieg-Check direkt hier möglich:
            if (enemy.health <= 0) {
              console.log("🏆 Boss besiegt → You Won");
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
  