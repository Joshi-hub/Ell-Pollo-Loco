/**
 * Represents the status bar that displays the player's collected coins.
 * Extends the generic StatusBar to show a coin-specific progress bar.
 */
class CoinStatusBar extends StatusBar {

    /**
     * Image set representing coin progress at 0%, 20%, 40%, 60%, 80%, and 100%.
     * Each index corresponds to one step of progress.
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    /**
     * Current coin percentage (0–100).
     * The image is selected based on this value.
     * @type {number}
     */
    percentage = 0;

    /**
     * Creates the CoinStatusBar HUD element.
     * Loads all coin bar images and positions the bar on the screen.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 50;
        this.width = 200;
        this.height = 60;
        this.setPercentage(this.percentage);
    }

    /**
     * Updates the coin bar image based on the player's coin percentage.
     * 
     * The bar has 6 states (0–100%). Because each image represents a
     * 20% step, the percentage is divided by 2 → 0–50 mapped to 0–25,
     * then truncated to map correctly to the available image indices.
     *
     * @param {number} percentage - The player's coin collection progress (0–100).
     */
    setPercentage(percentage) {
        let calc = Math.trunc(percentage / 2); // Converts 0–100 → 0–50 → 0–5
        let path = this.IMAGES[calc];
        this.img = this.imageCache[path];
    }
}
