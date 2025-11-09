class Level {
  enemies;
  clouds;
  background;
  coins;
  levelEndX = 2500;

  constructor(enemies, clouds, background, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.background = background;
    this.coins = coins;
  }
}
