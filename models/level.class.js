class Level {
    enemies;
    clouds;
    background;
    levelEndX = 2500;
    
    constructor(enemies, clouds, background) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.background = background;
    }
}
