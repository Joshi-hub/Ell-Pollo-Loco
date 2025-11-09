class ThowableObject extends MoveableObject {

    constructor(x, y) {
        super().loadImage("img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 70;
        this.trow();
    }

    trow() {
        this.speedY = 20;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}