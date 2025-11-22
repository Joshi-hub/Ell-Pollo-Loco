/**
 * Represents a full game level containing all world elements.
 * A level holds its objects (bottles, coins, enemies, clouds, backgrounds)
 * and defines the horizontal end point of the playable area.
 */
class Level {
    bottles;
    coins;
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 3600;

    /**
     * Creates a new Level instance with all included world objects.
     * @param {Bottle[]} bottles 
     * @param {Coin[]} coins 
     * @param {Enemy[]} enemies 
     * @param {Cloud[]} clouds 
     * @param {DrawableObjects[]} backgroundObjects 
     */
    constructor(bottles, coins, enemies, clouds, backgroundObjects) {
        this.bottles = bottles;
        this.coins = coins;
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}
