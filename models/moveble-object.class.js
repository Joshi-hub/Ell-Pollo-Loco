/**
 * Base class for movable game objects.
 * @extends DrawableObjects
 */
class MovableObject extends DrawableObjects {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity to the object.
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
     * Checks if the object is above ground.
     * @returns {boolean}
     */
    isAboveGround() {
        if (this instanceof ThrowableObjects) {
            return true;
        } else {
            return this.y < 160;
        }
    }

    /**
     * Checks collision with another movable object.
     * @param {MovableObject} movableObject
     * @returns {boolean}
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
     * Plays an animation sequence.
     * @param {string[]} images
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Reduces energy on hit.
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
     * Checks if the object is dead.
     * @returns {boolean}
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks if the object is hurt.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }
}