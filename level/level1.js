/**
 * Defines and initializes Level 1 for El Pollo Loco.
 * Populates the level with bottles, coins, enemies, clouds, and background objects.
 * 
 * @module level-1
 */

/**
 * The Level 1 instance.
 * @type {Level}
 */
let level1;

/**
 * Initializes and starts Level 1 with pre-defined objects and layout.
 * Called at game start by game.js.
 */
function startGame() {
    level1 = new Level(
        createBottles(),
        createCoins(),
        createEnemies(),
        createClouds(),
        createBackgrounds()
    );
}

/**
 * Creates all bottles for the level.
 * @returns {Bottle[]} Array of bottle objects
 */
function createBottles() {
    return [
        new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
        new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()
    ];
}

/**
 * Creates all coins for the level.
 * @returns {Coin[]} Array of coin objects
 */
function createCoins() {
    return [
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin()
    ];
}

/**
 * Creates all enemies for the level.
 * @returns {MovableObject[]} Array of enemy objects
 */
function createEnemies() {
    return [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new SmallChicken(),
        new SmallChicken(),
        new SmallChicken(),
        new Endboss()
    ];
}

/**
 * Creates all clouds for the level.
 * @returns {Cloud[]} Array of cloud objects
 */
function createClouds() {
    return [
        new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()
    ];
}

/**
 * Creates all background objects for the level.
 * @returns {BackgroundObject[]} Array of background objects
 */
function createBackgrounds() {
    return [
        ...createBackgroundLayer(-720),
        ...createBackgroundLayer(0),
        ...createBackgroundLayer(720),
        ...createBackgroundLayer(720 * 2),
        ...createBackgroundLayer(720 * 3)
    ];
}

/**
 * Creates a single background layer at specified x position.
 * @param {number} x - X position for the background layer
 * @returns {BackgroundObject[]} Array of background objects for one layer
 */
function createBackgroundLayer(x) {
    const layerType = x === -720 || x === 720 || x === 720 * 3 ? '2' : '1';

    return [
        new BackgroundObject('img/5_background/layers/air.png', x),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${layerType}.png`, x),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${layerType}.png`, x),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${layerType}.png`, x)
    ];
}