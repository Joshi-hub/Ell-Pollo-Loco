class MovableObject extends DrawableObjects {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObjects) {
            return true;
        } else {
            return this.y < 160;
        }
    }

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

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.2;
    }
}