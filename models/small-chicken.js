/**
 * Represents a small chicken enemy.
 * Moves horizontally at a random speed, plays a walking animation,
 * and switches to a dead sprite when killed.
 */
class SmallChicken extends MovableObject {

    y = 385;
    height = 45;
    width = 45;

    hitboxOffsetX = 8;
    hitboxOffsetY = 8;
    hitboxWidth = this.width - 16;
    hitboxHeight = this.height - 16;
    deathSound = new Audio('audio/chicken-dead.mp3');
    isDead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a new small chicken instance:
     * - sets initial sprite
     * - loads animation frames
     * - places the chicken at a random world position
     * - assigns a random movement speed
     * - starts movement and animation loops
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.setupImages();
        this.setRandomPosition();
        this.setRandomSpeed();
        this.animate();
    }

    /**
     * Loads all walking and dead animation frames into the cache.
     */
    setupImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Assigns a random X-position within the level range.
     */
    setRandomPosition() {
        this.x = 300 + (Math.random() * 1860);
    }

    /**
     * Assigns a random movement speed so chickens don't all behave identically.
     */
    setRandomSpeed() {
        this.speed = 0.2 + Math.random() * 0.4;
    }

    /**
     * Marks the chicken as dead, stops movement,
     * records the timestamp and switches the sprite.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        this.deathTime = Date.now();
        this.loadImage(this.IMAGES_DEAD[0]);
    }

    /**
     * Starts both the movement loop (physics) and animation loop (visuals).
     */
    animate() {
        this.startMovementAnimation();
        this.startWalkingAnimation();
    }

    /**
     * Moves the chicken left continuously unless it is dead.
     */
    startMovementAnimation() {
        setStopableIntervall(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Plays the walking animation at regular intervals unless dead.
     */
    startWalkingAnimation() {
        setStopableIntervall(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}
