class EndbossStatusBar extends StatusBar {
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',  
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    constructor(endboss) {
        super();
        this.endboss = endboss;
        this.loadImages(this.IMAGES);
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    draw(ctx) {
        this.updatePosition();
        this.updateStatusBar();
        super.draw(ctx);
    }

    updatePosition() {
        if (this.endboss) {
            this.x = this.endboss.x + (this.endboss.width / 2) - (this.width / 2);
            this.y = this.endboss.y - 30;
        }
    }

    updateStatusBar() {
        if (this.endboss) {
            const percentage = (this.endboss.health / this.endboss.maxHealth) * 100;
            this.setPercentage(percentage);
        }
    }

    drawBackground(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    drawHealthBar(ctx) {
        const healthPercent = this.endboss.health / this.endboss.maxHealth;
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width * healthPercent, this.height);
    }
}