/**
 * Represents a cloud in the background that slowly moves from right to left.
 * Clouds add atmospheric depth to the level and spawn at random positions.
 */
class Cloud extends MovableObject {
    y = 20;
    height = 300;
    width = 720;

    IMAGES_CLOUDS = [
        'img/5_background/layers/4_clouds/1.png',
        'img/5_background/layers/4_clouds/2.png'
    ];

    /**
     * Creates a cloud at a random position with a random cloud sprite.
     */
    constructor() {
        super();
        let randomNumber = Math.floor(Math.random() * 2);
        this.loadImage(this.IMAGES_CLOUDS[randomNumber]);
        this.x = Math.floor(Math.random() * 2000);
        this.y = Math.floor(Math.random() * 30);
        this.animate();
    }

    /**
     * Starts the cloud movement animation.
     * Clouds move slowly to the left at a fixed interval.
     */
    animate() {
        setStopableIntervall(() => {
            this.moveLeft();
        }, 75);
    }
}
