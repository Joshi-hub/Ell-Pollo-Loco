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

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
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
        setInterval(() => {
            this.x += this.speed;
        }, 1000 / 60);
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}