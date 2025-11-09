/**
 * Handles all collision detection and item collection in the game.
 * Manages enemy damage, coin collection, and bottle pickup mechanics.
 */
class CollisionHandler {
    /**
    * Creates a new CollisionHandler.
    * @param {World} world - Reference to the main game world
    */
    constructor(world) {
        this.world = world;
    }

    /**
    * Main collision check method that runs all collision systems.
    * Called every frame from the world's game loop.
    */
    checkAllCollisions() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottlePickup();
        this.checkFlaskVsEndboss();
        this.removeCompletedSplashes();
    }

    /**
    * Checks collisions between character and all enemies.
    * Triggers damage when character touches any enemy.
    */
    checkEnemyCollisions() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy)) {
                this.handlePlayerDamage(enemy);
            }
        });
    }

    /**
     * Handles the logic when the player takes damage.
     * @param {MovableObject} enemy
     */
    handlePlayerDamage(enemy) {
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
    }

    /**
     * Handles coin collection.
     */
    checkCoinCollisions() {
        const coinsToRemove = [];

        this.findCollidingCoins(coinsToRemove);
        this.removeCollectedCoins(coinsToRemove);
    }

    /**
     * Finds coins that collide with character and adds them to removal list.
     * @param {number[]} coinsToRemove - Array to store coin indices
     */
    findCollidingCoins(coinsToRemove) {
        this.world.level.coins.forEach((coin, i) => {
            if (this.world.character.isColliding(coin)) {
                coinsToRemove.push(i);
                this.increaseCoinAmount();
            }
        });
    }

    /**
     * Increases coin amount and updates status bar.
     */
    increaseCoinAmount() {
        this.world.coinAmount++;
        this.world.coinStatusBar.setPercentage(this.world.coinAmount);
    }

    /**
     * Removes collected coins from the level.
     * @param {number[]} coinsToRemove - Array of coin indices to remove
     */
    removeCollectedCoins(coinsToRemove) {
        for (let i = coinsToRemove.length - 1; i >= 0; i--) {
            this.world.level.coins.splice(coinsToRemove[i], 1);
        }
    }

    /**
     * Handles bottle pickup.
     */
    checkBottlePickup() {
        if (this.canPickupMoreBottles()) {
            const bottlesToRemove = [];
            this.findCollidingBottles(bottlesToRemove);
            this.removeCollectedBottles(bottlesToRemove);
        }
    }

    /**
     * Checks if player can pick up more bottles.
     * @returns {boolean} True if bottle amount is less than maximum
     */
    canPickupMoreBottles() {
        return this.world.bottleAmount < 5;
    }

    /**
     * Finds bottles that collide with character and adds them to removal list.
     * @param {number[]} bottlesToRemove - Array to store bottle indices
     */
    findCollidingBottles(bottlesToRemove) {
        this.world.level.bottles.forEach((bottle, i) => {
            if (this.world.character.isColliding(bottle) && this.world.bottleAmount < 5) {
                bottlesToRemove.push(i);
                this.increaseBottleAmount();
            }
        });
    }

    /**
     * Increases bottle amount and updates status bar.
     */
    increaseBottleAmount() {
        this.world.bottleAmount++;
        if (this.world.bottleAmount > 5) {
            this.world.bottleAmount = 5;
        }
        const percentage = (this.world.bottleAmount / 5) * 100;
        this.world.bottleStatusBar.setPercentage(percentage);
    }

    /**
     * Removes collected bottles from the level.
     * @param {number[]} bottlesToRemove - Array of bottle indices to remove
     */
    removeCollectedBottles(bottlesToRemove) {
        for (let i = bottlesToRemove.length - 1; i >= 0; i--) {
            this.world.level.bottles.splice(bottlesToRemove[i], 1);
        }
    }

    /**
     * Checks collisions between player flasks and endboss.
     */
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

    /**
     * Removes flasks that have hit targets.
     * @param {number[]} flasksToRemove - Array of flask indices to remove
     */
    removeUsedFlasks(flasksToRemove) {
        for (let i = flasksToRemove.length - 1; i >= 0; i--) {
            this.world.throwableObjects.splice(flasksToRemove[i], 1);
        }
    }

    /**
     * Removes flasks that have completed their splash animation.
     */
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