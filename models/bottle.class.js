class Bottle extends DrawableObjects {
    width = 60;
    height = 70;

    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = 40;
    hitboxHeight = 50;

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];

    constructor() {
        super();
        let randomNumber = Math.floor(Math.random() * 2);
        this.loadImage(this.IMAGES_BOTTLE[randomNumber]);

        this.x = Math.floor(250 + (Math.random() * 2000));
        this.y = 380;
    }
}