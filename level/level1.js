/**
 * Global reference to the current level.
 * Gets initialized when starting the game.
 * @type {Level}
 */
let level1;

/**
 * Initializes level 1 by creating all world objects
 * (bottles, coins, enemies, clouds, backgrounds).
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
 * Creates all bottle objects placed in the level.
 * @returns {Bottle[]} Array of Bottle instances.
 */
function createBottles() {
  return [
    new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
    new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
  ];
}

/**
 * Creates all coin objects placed in the level.
 * @returns {Coin[]} Array of Coin instances.
 */
function createCoins() {
  return [
    new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
    new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
  ];
}

/**
 * Creates all enemy objects for the level:
 * multiple chickens, multiple small chickens,
 * and a single Endboss.
 * 
 * @returns {(Chicken|SmallChicken|Endboss)[]} Array of enemy instances.
 */
function createEnemies() {
  return [
    new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(),
    new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(),
    new Endboss(),
  ];
}

/**
 * Creates cloud objects for the background layer.
 * @returns {Cloud[]} Array of cloud instances.
 */
function createClouds() {
  return [
    new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()
  ];
}

/**
 * Creates all background objects for the scrolling world.
 * Each 720px block forms one full background segment.
 * 
 * @returns {BackgroundObject[]} Array of background layers.
 */
function createBackgrounds() {
  const backgrounds = [];
  const positions = [-720, 0, 720, 720 * 2, 720 * 3, 720 * 4, 720 * 5];

  positions.forEach((positionX, index) => {
    backgrounds.push(...createBackgroundLayer(positionX, index));
  });

  return backgrounds;
}

/**
 * @param {number} positionX
 * @param {number} index - 0, 1, 2, 3...
 */
function createBackgroundLayer(positionX, index) {
  const backgroundVariant = index % 2 === 0 ? "1" : "2";

  return [
    new BackgroundObject("img/5_background/layers/air.png", positionX),
    new BackgroundObject("img/5_background/layers/3_third_layer/" + backgroundVariant + ".png", positionX),
    new BackgroundObject("img/5_background/layers/2_second_layer/" + backgroundVariant + ".png", positionX),
    new BackgroundObject("img/5_background/layers/1_first_layer/" + backgroundVariant + ".png", positionX),
  ];
}
