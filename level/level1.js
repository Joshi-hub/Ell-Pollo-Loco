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
    new Chicken(), new Chicken(), new Chicken(),
    new SmallChicken(), new SmallChicken(), new SmallChicken(),
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
  return [
    ...createBackgroundLayer(-720),
    ...createBackgroundLayer(0),
    ...createBackgroundLayer(720),
    ...createBackgroundLayer(720 * 2),
    ...createBackgroundLayer(720 * 3),
  ];
}

/**
 * Creates one complete background layer segment:
 * air → third layer → second layer → first layer.
 * 
 * @param {number} x - The X-position of the layer block.
 * @returns {BackgroundObject[]} Layer objects positioned at X.
 */
function createBackgroundLayer(positionX) {
  let backgroundVariant = "1";
  if (positionX === -720 || positionX === 720 || positionX === 720 * 3) {
    backgroundVariant = "2";
  }
  return [
    new BackgroundObject("img/5_background/layers/air.png", positionX),
    new BackgroundObject("img/5_background/layers/3_third_layer/" + backgroundVariant + ".png", positionX),
    new BackgroundObject("img/5_background/layers/2_second_layer/" + backgroundVariant + ".png", positionX),
    new BackgroundObject("img/5_background/layers/1_first_layer/" + backgroundVariant + ".png", positionX),
  ];
}