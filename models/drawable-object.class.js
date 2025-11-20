/**
 * Base class for all drawable objects in the game.
 * 
 * Responsibilities:
 * - Loading single or multiple images
 * - Providing an image cache
 * - Drawing objects on the canvas
 * - Optional hitbox calculation for collisions
 */
class DrawableObjects {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads a single image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into the cache.
     * @param {string[]} arr - Array of image paths.
     */
    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     */
    draw(ctx) {
        if (!this.img) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Returns the hitbox of the object.
     * Uses offsets when defined.
     * @returns {{x:number, y:number, width:number, height:number}}
     */
    getHitbox() {
        const offsetX = this.hitboxOffsetX || 0;
        const offsetY = this.hitboxOffsetY || 0;
        const w = this.hitboxWidth || this.width;
        const h = this.hitboxHeight || this.height;

        return {
            x: this.x + offsetX,
            y: this.y + offsetY,
            width: w,
            height: h
        };
    }

    /**
     * Draws a visual hitbox around the object.
     * Use only for debugging.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBorder(ctx) {
        // Debug-only:
        // const hb = this.getHitbox();
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(hb.x, hb.y, hb.width, hb.height);
    }

    /**
     * Plays a sound, respecting the global sound setting.
     * @param {HTMLAudioElement} audio
     */
    playSound(audio) {
        if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}
