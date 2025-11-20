/**
 * Represents a throwable bottle object.
 * Handles rotation animation, forward movement, gravity,
 * and splash animation once the bottle impacts an enemy or the ground.
 */
class ThrowableObjects extends MovableObject {

    bottleBreakingSound = new Audio('audio/glass-bottle-breaking.mp3');

    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    /**
     * Creates a new throwable bottle at the given position.
     * Loads rotation and splash animation frames, initializes physics,
     * and starts the throw animation.
     *
     * @param {number} x - Initial X-position of the bottle.
     * @param {number} y - Initial Y-position of the bottle.
     */
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.isImpacting = false;
        this.splashAnimationComplete = false;
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
        this.animate();
    }

    /**
     * Starts the throw movement:
     * - upward movement via speedY
     * - gravity application
     * - horizontal movement forward
     */
    throw() {
        this.startBottleThrow();
        this.applyGravity();
        this.moveBottleForward();
    }

    /**
     * Sets the bottle's initial upward velocity.
     */
    startBottleThrow() {
        this.speedY = 20;
    }

    /**
     * Moves the bottle horizontally to the right at a fixed speed.
     */
    moveBottleForward() {
        setInterval(() => {
            this.x += 7.5;
        }, 25);
    }

    /**
     * Plays rotation animation until impact,
     * then switches to splash animation sequence.
     */
    animate() {
        setStopableIntervall(() => {
            if (this.isImpacting) {
                this.playSplashAnimation();
            } else {
                this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
            }
        }, 100);
    }

    /**
     * Marks the bottle as having impacted something:
     * - stops movement
     * - resets animation index
     * - triggers splash animation
     */
    triggerImpact() {
        this.isImpacting = true;
        this.speedY = 0;
        this.speedX = 0;
        this.currentImage = 0;
    }

    /**
     * Plays the splash animation frame by frame.
     * Once all frames are shown, marks the animation as complete.
     */
    playSplashAnimation() {
        if (this.currentImage < this.IMAGES_BOTTLE_SPLASH.length - 1) {
            this.currentImage++;
            let path = this.IMAGES_BOTTLE_SPLASH[this.currentImage];
            this.img = this.imageCache[path];
        } else {
            this.splashAnimationComplete = true;
        }
    }
}
