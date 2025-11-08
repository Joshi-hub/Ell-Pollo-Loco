class MoveableObject {
  x = 80;
  y = 140;
  img;
  height = 300;
  width = 150;
  imgCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 1;
  energy = 100;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 180;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof character || this instanceof chicken) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  isColliding(movableObject) {
    return this.x + this.width > movableObject.x &&
    this.y + this.height > movableObject.y &&
    this.x < movableObject.x &&
    this.y < movableObject.y + movableObject.height;
  }

  hit() {
    this.energy -= 10;
    if (this.energy < 0) {
        this.energy = 0;
    }
  }

  isDead() {
    return this.energy == 0;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imgCache[path] = img;
    });
  }

  playAnimation(image) {
    let i = this.currentImage % this.walkInterval.length;
    let path = image[i];
    this.img = this.imgCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }
}