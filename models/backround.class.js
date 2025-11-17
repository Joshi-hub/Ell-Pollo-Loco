/**
 * Represents a static background element in the game world.
 * 
 * BackgroundObjects are placed behind all gameplay objects
 * and scroll with the camera, creating a parallax effect.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a new background object and positions it in the world.
     * 
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position where the background should be placed.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}