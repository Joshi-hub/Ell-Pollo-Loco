class DrawableObjekt {
    x = 80;
    y = 140;
    height = 300;
    width = 150;
    img;
    imgCache = {};
    currentImage = 0;

 loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imgCache[path] = img;
    });
  }

}
