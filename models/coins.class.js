class Coin extends MoveableObject {
  y = 250;
  height = 150;
  width = 150;

  COIN_IMAGES = ['img/8_coin/coin_1.png','img/8_coin/coin_2.png'];

  constructor(x) {
    super().loadImage(this.COIN_IMAGES[0]);
    this.loadImages(this.COIN_IMAGES);
    this.x = x;
    this.animate();
  }

  animate() {
    setInterval(() => this.playAnimation(this.COIN_IMAGES), 300);
  }
}
