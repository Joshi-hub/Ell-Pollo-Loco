class Level {
    bottles;
    coins;
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200;

    constructor(bottles, coins, enemies, clouds, backgroundObjects) {
        this.bottles = bottles;
        this.coins = coins;
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}