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
            console.warn('No image to draw for', this);
            return;
        }
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (err) {
            console.warn('Error loading image', err);
            console.log('Could not load image', this.img?.src);
        }
    }

    drawBorder(ctx) {
        const { x, y, width, height } = this.getHitbox ? this.getHitbox() : this;
        if (!(this instanceof Character)) {
            ctx.beginPath();
            ctx.strokeStyle = 'magenta';
            ctx.lineWidth = 2;
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }
}