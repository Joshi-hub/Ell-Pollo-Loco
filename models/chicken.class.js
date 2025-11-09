/**
 * Enemy chicken class.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    y = 370;
    height = 60;
    width = 60;

    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = this.width - 20;
    hitboxHeight = this.height - 20;

    isDead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Creates a new Chicken at a random position.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 300 + (Math.random() * 1860);
        this.speed = 0.15 + Math.random() * 0.3;
        this.animate();
    }

    /**
     * Kills the chicken and sets dead image.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        this.deathTime = Date.now();
        // Immediately set the dead image
        this.loadImage(this.IMAGES_DEAD[0]);
    }

    /**
     * Override animate to stop moving if dead.
     */
    animate() {
        setStopableIntervall(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);

        setStopableIntervall(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}