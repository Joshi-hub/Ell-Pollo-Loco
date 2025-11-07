class World {
    character = new character();
    enemies = [
        new chicken(),
        new chicken(),
        new chicken()
    ];
    cloud = [
        new Cloud()
    ];
    background = [
        new Backround('img/5_background/layers/air.png', 0),
        new Backround('img/5_background/layers/3_third_layer/1.png', 0),
        new Backround('img/5_background/layers/2_second_layer/1.png', 0),
        new Backround('img/5_background/layers/1_first_layer/1.png', 0),
        new Backround('img/5_background/layers/3_third_layer/1.png', 720),
        new Backround('img/5_background/layers/2_second_layer/1.png', 720),
        new Backround('img/5_background/layers/1_first_layer/1.png', 720)
    ];
    canvas;
    ctx;
    keyboard;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectToMap(this.background);
        this.addObjectToMap(this.enemies);
        this.addToMap(this.character);  
        this.addObjectToMap(this.cloud);
        
        
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });

    }

    addObjectToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.ctx.save();
            this.ctx.translate(movableObject.width, 0);
            this.ctx.scale(-1, 1);
            movableObject.x = movableObject.x * -1;
        }
            this.ctx.drawImage(movableObject.img, movableObject.x, movableObject.y, movableObject.width, movableObject.height);
        if (movableObject.otherDirection) {
            movableObject.x = movableObject.x * -1;
            this.ctx.restore();
        }
    }   
}