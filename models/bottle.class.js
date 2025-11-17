/**
 * Represents a collectible salsa bottle in the game world.
 * 
 * Bottles lie on the ground and can be picked up by the player.
 * Some bottles can also be thrown later as projectiles.
 */
class Bottle extends DrawableObjects {
    width = 60;
    height = 70;
    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = 40;
    hitboxHeight = 50;
    bottleTouch = new Audio('audio/click_005.ogg');
    bottleBreakingSound = new Audio('audio/glass-bottle-breaking.mp3');
    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];

    /**
     * Creates a new salsa bottle, chooses a random sprite
     * and places the bottle at a random X-position in the level.
     */
    constructor() {
        super();
        const randomNumber = Math.floor(Math.random() * 2);
        this.loadImage(this.IMAGES_BOTTLE[randomNumber]);
        this.x = Math.floor(250 + (Math.random() * 2000));
        this.y = 380;
    }

    /**
     * Plays a given sound effect if global sound is enabled.
     * Safe-call using try/catch to avoid audio playback errors.
     * 
     * @param {HTMLAudioElement} sound
     */
    playSound(sound) {
        if (!soundEnabled) return;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}