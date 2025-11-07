class chicken extends MoveableObject {
    y = 330;
    height = 100;
    width = 100;
    walkInterval = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
      ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.walkInterval);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
            let i = this.currentImage % this.walkInterval.length;
            let path = this.walkInterval[i];
            this.img = this.imgCache[path];
            this.currentImage++;
        }, 500);

        this.x = 200 + Math.random() * 500; 
    }
}
