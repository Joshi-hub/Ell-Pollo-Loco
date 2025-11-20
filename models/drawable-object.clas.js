/**
 * Displays a dynamic health bar above the Endboss.
 * 
 * This status bar:
 * - follows the boss as it moves,
 * - updates its health value in real time,
 * - uses percentage-based sprite selection inherited from StatusBar.
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

    /**
     * Creates a status bar bound to a specific Endboss instance.
     * Loads all health bar images and sets an initial size and percentage.
     * 
     * @param {Endboss} endboss - The Endboss whose health this bar represents.
     */
    constructor(endboss) {
        super();
        this.endboss = endboss;
        this.loadImages(this.IMAGES);
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the bar's position and health percentage before drawing it.
     * 
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     */
    draw(ctx) {
        this.updatePosition();
        this.updateStatusBar();
        super.draw(ctx);
    }

    /**
     * Positions the bar above the Endboss, centered horizontally.
     */
    updatePosition() {
        if (this.endboss) {
            this.x = this.endboss.x + (this.endboss.width / 2) - (this.width / 2);
            this.y = this.endboss.y - 30;
        }
    }

    /**
     * Sets the displayed health percentage based on the Endboss's current health.
     */
    updateStatusBar() {
        if (this.endboss) {
            const percentage = (this.endboss.health / this.endboss.maxHealth) * 100;
            this.setPercentage(percentage);
        }
    }

    /**
     * Draws the background of the status bar (not used by default).
     * Can be enabled for debugging or custom styles.
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawBackground(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the current health bar fill.
     * Can be used instead of sprite-based bars for a more classical UI style.
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawHealthBar(ctx) {
        const healthPercent = this.endboss.health / this.endboss.maxHealth;
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width * healthPercent, this.height);
    }
}