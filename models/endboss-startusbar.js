/**
 * Health bar display for the endboss.
 * @extends StatusBar
 */
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

    /**
     * Updates bar position and draws using parent method.
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        this.updatePosition();
        super.draw(ctx);
    }

    /**
     * Updates bar position relative to endboss.
     */
    updatePosition() {
        if (this.endboss) {
            this.x = this.endboss.x + (this.endboss.width / 2) - (this.width / 2);
            this.y = this.endboss.y - 30;
        }
    }

    /**
     * Updates the status bar based on endboss health.
     */
    updateStatusBar() {
        if (this.endboss) {
            const percentage = (this.endboss.health / this.endboss.maxHealth) * 100;
            this.setPercentage(percentage);
        }
    }

    /**
     * Draws the background of the HP bar.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBackground(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the current health level.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawHealthBar(ctx) {
        const healthPercent = this.endboss.health / this.endboss.maxHealth;
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width * healthPercent, this.height);
    }
}