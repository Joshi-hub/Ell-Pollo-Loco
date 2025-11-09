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
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy)) {
                this.handlePlayerDamage(enemy);
            }
        });
    }

    handlePlayerDamage(enemy) {
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
    }

    checkCoinCollisions() {
        const coinsToRemove = [];

        this.findCollidingCoins(coinsToRemove);
        this.removeCollectedCoins(coinsToRemove);
    }

    findCollidingCoins(coinsToRemove) {
        this.world.level.coins.forEach((coin, i) => {
            if (this.world.character.isColliding(coin)) {
                coinsToRemove.push(i);
                this.increaseCoinAmount();
            }
        });
    }

    increaseCoinAmount() {
        this.world.coinAmount++;
        this.world.coinStatusBar.setPercentage(this.world.coinAmount);
    }

    removeCollectedCoins(coinsToRemove) {
        for (let i = coinsToRemove.length - 1; i >= 0; i--) {
            this.world.level.coins.splice(coinsToRemove[i], 1);
        }
    }

    checkBottlePickup() {
        if (this.canPickupMoreBottles()) {
            const bottlesToRemove = [];
            this.findCollidingBottles(bottlesToRemove);
            this.removeCollectedBottles(bottlesToRemove);
        }
    }

    canPickupMoreBottles() {
        return this.world.bottleAmount < 5;
    }

    findCollidingBottles(bottlesToRemove) {
        this.world.level.bottles.forEach((bottle, i) => {
            if (this.world.character.isColliding(bottle) && this.world.bottleAmount < 5) {
                bottlesToRemove.push(i);
                this.increaseBottleAmount();
            }
        });
    }

    increaseBottleAmount() {
        this.world.bottleAmount++;
        if (this.world.bottleAmount > 5) {
            this.world.bottleAmount = 5;
        }
        const percentage = (this.world.bottleAmount / 5) * 100;
        this.world.bottleStatusBar.setPercentage(percentage);
    }

    removeCollectedBottles(bottlesToRemove) {
        for (let i = bottlesToRemove.length - 1; i >= 0; i--) {
            this.world.level.bottles.splice(bottlesToRemove[i], 1);
        }
    }

    checkFlaskVsEndboss() {
        const flasksToRemove = [];

        this.world.throwableObjects.forEach((flask, flaskIndex) => {
            this.world.level.enemies.forEach((enemy) => {
                if (enemy instanceof Endboss && flask.isColliding(enemy) && !flask.isImpacting) {
                    enemy.takeDamage();
                    this.world.endbossStatusBar.updateStatusBar();
                    flask.triggerImpact(enemy);
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
            if (flask.splashAnimationComplete) {
                flasksToRemove.push(index);
            }
        });

        this.removeUsedFlasks(flasksToRemove);
    }
}