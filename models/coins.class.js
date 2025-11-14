class Coin extends DrawableObjects {
    height = 120;
    width = 120;
    coinSound = new Audio('audio/coin5.ogg');
    hitboxOffsetX = 40;
    hitboxOffsetY = 40;
    hitboxWidth = 40;
    hitboxHeight = 40;

    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor() {
        super();
        let randomNumber = Math.floor(Math.random() * 2);
        this.loadImage(this.IMAGES_COINS[randomNumber]);
        this.x = Math.floor(200 + (Math.random() * 2000));
        this.y = Math.floor(80 + (Math.random() * 260));
    }

    playSound() {
        if (!soundEnabled) return;      // Respektiert Sound-Button
        this.coinSound.currentTime = 0; 
        this.coinSound.play().catch(()=>{});
    }    
}