class Cloud extends MovableObject {
    y = 20;
    height = 300;
    width = 720;

    IMAGES_CLOUDS = [
        'img/5_background/layers/4_clouds/1.png',
        'img/5_background/layers/4_clouds/2.png'
    ];

    /**
     * Creates a new Cloud at a random position.
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
     * Animates the cloud's movement.
     */
    animate() {
        setStopableIntervall(() => {
            this.moveLeft();
        }, 75);
    }
}