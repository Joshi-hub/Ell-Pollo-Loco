/**
 * Status bar that visually displays the Endboss's remaining health.
 * 
 * Follows the Endboss on screen by updating its position every frame
 * and adjusts the displayed percentage automatically based on the
 * boss's current health value.
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
     * Creates a new Endboss status bar tied to the given boss instance.
     *
     * @param {Endboss} endboss - The endboss whose health should be displayed.
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
     * Updates position and health percentage before drawing,
     * then calls the base StatusBar drawing logic.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     */
    draw(ctx) {
        this.updatePosition();
        this.updateStatusBar();
        super.draw(ctx);
    }

    /**
     * Sets the status bar position so that it floats centered
     * above the Endboss.
     */
    updatePosition() {
        if (this.endboss) {
            this.x = this.endboss.x + (this.endboss.width / 2) - (this.width / 2);
            this.y = this.endboss.y - 30;
        }
    }

    /**
     * Calculates the current health percentage and updates the bar image.
     */
    updateStatusBar() {
        if (this.endboss) {
            const percentage = (this.endboss.health / this.endboss.maxHealth) * 100;
            this.setPercentage(percentage);
        }
    }

    /**
     * Draws a red background rectangle for the bar.
     * (Unused unless manually triggered.)
     *
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawBackground(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the green health fill bar inside the container.
     * (Unused unless manually triggered.)
     *
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawHealthBar(ctx) {
        const healthPercent = this.endboss.health / this.endboss.maxHealth;
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width * healthPercent, this.height);
    }
}