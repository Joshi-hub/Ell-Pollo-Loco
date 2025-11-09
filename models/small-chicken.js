class SmallChicken extends MovableObject {
    y = 385;
    height = 45;
    width = 45;

    hitboxOffsetX = 8;
    hitboxOffsetY = 8;
    hitboxWidth = this.width - 16;
    hitboxHeight = this.height - 16;

    isDead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.setupImages();
        this.setRandomPosition();
        this.setRandomSpeed();
        this.animate();
    }

    setupImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }

    setRandomPosition() {
        this.x = 300 + (Math.random() * 1860);
    }

    setRandomSpeed() {
        this.speed = 0.2 + Math.random() * 0.4;
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        this.deathTime = Date.now();
        this.loadImage(this.IMAGES_DEAD[0]);
    }

    animate() {
        this.startMovementAnimation();
        this.startWalkingAnimation();
    }

    startMovementAnimation() {
        setStopableIntervall(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);
    }

    startWalkingAnimation() {
        setStopableIntervall(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}
