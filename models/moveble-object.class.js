/**
 * Base class for all objects that can move in the game world.
 * 
 * Handles:
 * - movement (left/right)
 * - jumping and gravity physics
 * - hitbox collision checks
 * - animation frame cycling
 * - damage and hurt states
 */
class MovableObject extends DrawableObjects {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity over time.
     * Objects fall down while above ground or moving upward,
     * reducing `speedY` each tick.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is above ground level.
     * Throwable objects always return true to allow trajectory physics.
     * 
     * @returns {boolean} True if object should be affected by gravity.
     */
    isAboveGround() {
        if (this instanceof ThrowableObjects) {
            return true;
        } else {
            return this.y < 160;
        }
    }

    /**
     * Checks a rectangular hitbox collision between this object
     * and another movable object.
     * 
     * @param {MovableObject} movableObject - The object to test collision with.
     * @returns {boolean} True if hitboxes overlap.
     */
    isColliding(movableObject) {
        const myHitbox = this.getHitbox();
        const otherHitbox = movableObject.getHitbox();

        const horizontallyOverlaps =
            myHitbox.x < otherHitbox.x + otherHitbox.width &&
            myHitbox.x + myHitbox.width > otherHitbox.x;

        const verticallyOverlaps =
            myHitbox.y < otherHitbox.y + otherHitbox.height &&
            myHitbox.y + myHitbox.height > otherHitbox.y;

        return horizontallyOverlaps && verticallyOverlaps;
    }

    /**
     * Cycles through the given animation images.
     * Updates the displayed image based on current frame index.
     * 
     * @param {string[]} images - Array of image paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right based on its speed value.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left based on its speed value.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Triggers a vertical jump by setting upward velocity.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Reduces the object's energy when hit.
     * Updates last hit timestamp unless energy reached zero.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * @returns {boolean} True if energy has dropped to zero.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks if the object is in a temporary hurt state.
     * 
     * @returns {boolean} True if less than 0.5 seconds passed since last hit.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }
}