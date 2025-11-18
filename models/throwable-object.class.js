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

    throw(x, y) {
        this.startBottleThrow();
        this.applyGravity();
        this.moveBottleForward();
    }

    startBottleThrow() {
        this.speedY = 20;
    }

    moveBottleForward() {
        setInterval(() => {
            this.x += 7.5;
        }, 25);
    }

    animate() {
        setStopableIntervall(() => {
            if (this.isImpacting) {
                this.playSplashAnimation();
            } else {
                this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
            }
        }, 100); 
    }

    triggerImpact() {
        this.isImpacting = true;
        this.speedY = 0;
        this.speedX = 0;
        this.currentImage = 0; 
    }

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