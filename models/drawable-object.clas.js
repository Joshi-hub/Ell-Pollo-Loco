class DrawableObjects {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    getHitbox() {
        return {
            x: this.x + (this.hitboxOffsetX || 0),
            y: this.y + (this.hitboxOffsetY || 0),
            width: this.hitboxWidth || this.width,
            height: this.hitboxHeight || this.height
        };
    }

    draw(ctx) {
        if (!this.img) {
            return;
        }
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (err) {
        }
    }

    drawBorder(ctx) {
        const { x, y, width, height } = this.getHitbox ? this.getHitbox() : this;        
    }
}