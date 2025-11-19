/**
 * Represents a standard chicken enemy in the game.
 * 
 * Chickens walk from right to left and damage the player upon contact.
 * They can be defeated by jumping on them ("stomp kill").
 */
class Chicken extends MovableObject {
    y = 370;
    height = 60;
    width = 60;
    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = this.width - 20;
    hitboxHeight = this.height - 20;
    deathSound = new Audio('audio/chicken-dead.mp3');
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
     * Creates a new chicken enemy with random speed and random X-position.
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
     * Kills the chicken and switches sprite to its dead image.
     * Prevents repeated trigger when called multiple times.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        this.deathTime = Date.now();
        this.loadImage(this.IMAGES_DEAD[0]);
    }

    /**
     * Handles both movement and animation loops.
     * Chickens walk continuously until dead.
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