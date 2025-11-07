class character extends MoveableObject {
  walkInterval = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.walkInterval);

    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.walkInterval.length;
      let path = this.walkInterval[i];
      this.img = this.imgCache[path];
      this.currentImage++;
    }, 100);
  }

  jump() {}
}
