let level1;

function startGame() {
    level1 = new Level(
        createBottles(),
        createCoins(),
        createEnemies(),
        createClouds(),
        createBackgrounds()
    );
}

function createBottles() {
    return [
        new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
        new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()
    ];
}

function createCoins() {
    return [
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin()
    ];
}

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

function createClouds() {
    return [
        new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()
    ];
}

function createBackgrounds() {
    return [
        ...createBackgroundLayer(-720),
        ...createBackgroundLayer(0),
        ...createBackgroundLayer(720),
        ...createBackgroundLayer(720 * 2),
        ...createBackgroundLayer(720 * 3)
    ];
}

function createBackgroundLayer(x) {
    const layerType = x === -720 || x === 720 || x === 720 * 3 ? '2' : '1';

    return [
        new BackgroundObject('img/5_background/layers/air.png', x),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${layerType}.png`, x),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${layerType}.png`, x),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${layerType}.png`, x)
    ];
}