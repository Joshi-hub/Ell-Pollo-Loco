/**
 * Represents a game level.
 */
class Level {
    bottles;
    coins;
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200;

    /**
     * Creates a new level with all objects.
     * @param {Bottle[]} bottles
     * @param {Coin[]} coins
     * @param {MovableObject[]} enemies
     * @param {Cloud[]} clouds
     * @param {BackgroundObject[]} backgroundObjects
     */
    constructor(bottles, coins, enemies, clouds, backgroundObjects) {
        this.bottles = bottles;
        this.coins = coins;
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}