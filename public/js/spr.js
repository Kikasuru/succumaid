// spr.js - Handles sprites, fonts, and hitboxes
let letters = "!\"#$%'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQUSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~";

class Sprite {
    constructor(layers, sw, sh){
        this.layers = layers;
        this.sw     = sw;
        this.sh     = sh;
    }

    render(){
        let spr = this;

        return new Promise(function(res, reg) {
            let imgsLoaded = 0

            // Create new images for each layer
            spr.layers.forEach(function(e) {
                e.img = new Image();
                e.img.src = e.src;

                e.img.onload = function() {
                    imgsLoaded++

                    // When all images are loaded, put them together
                    if (imgsLoaded === spr.layers.length) assemble();
                }
            });

            function assemble(){
                // Check if the width and height are the same for each layer.
                if(spr.layers.every(function(e) {
                    return spr.layers[0].img.width === e.img.width && spr.layers[0].img.height === e.img.height
                })) {
                    // Make a new canvas for this sprite
                    spr.canvas = document.createElement("canvas");

                    // Resize this canvas
                    spr.canvas.width   = spr.layers[0].img.width;
                    spr.canvas.height  = spr.layers[0].img.height;

                    // Add this canvas to the sprite cache
                    document.getElementById("spr").appendChild(spr.canvas);

                    // Make a new context for the canvas
                    let ctx = spr.canvas.getContext("2d");

                    // Draw each layer onto the canvas
                    spr.layers.forEach(function(e) {
                        ctx.drawImage(e.img, 0, 0);

                        // Color this layer
                        recolorArea(ctx, e.color, 0, 0, e.img.width, e.img.height);
                    });

                    // Resolve the promise
                    res(true);
                } else {
                    // If not, reject this Promise
                    rej("Layers are varied sizes");
                }
            }
        });
    }

    draw(ctx, sprid, x, y) {
        // Make sure the canvas exists
        if (this.canvas) {
            // Draw the sprite
            ctx.drawImage(this.canvas,
                // Source
                (sprid % (this.canvas.width / this.sw)) * this.sw, Math.floor(sprid / (this.canvas.width / this.sw)) * this.sw, this.sw, this.sh,
                // Destination
                x, y, this.sw, this.sh
            );
        } else {
            // If not, return false
            return false;
        }
    }
}

class BitFont {
    constructor(src, widths, space){
        this.src    = src;
        this.widths = widths;
        this.space  = space;
    }

    render(){
        let font = this;

        return new Promise(function(res, reg) {
            // Create a new image for the font
            font.img = new Image();
            font.img.src = font.src;

            font.img.onload = function(){
                // Make a new canvas for this font
                font.canvas = document.createElement("canvas");

                // Resize this canvas
                font.canvas.width   = font.img.width;
                font.canvas.height  = colorhex.length * font.img.height;

                // Add this canvas to the font cache
                document.getElementById("fonts").appendChild(font.canvas);

                // Make a new context for the canvas
                let ctx = font.canvas.getContext("2d");

                // Go through each color
                for (let c = 0; c < colorhex.length; c++) {
                    // Draw the font onto the canvas
                    ctx.drawImage(font.img, 0, c * font.img.height);

                    // Color the font
                    recolorArea(ctx, c, 0, c * font.img.height, font.img.width, font.img.height);
                }

                // Resolve with true
                res(true);
            }
        });

    }

    draw(ctx, text, x, y, color){
        // Make sure the canvas exists
        if (this.canvas) {
            let xoffset = 0;

            // Go through each letter of text
            for (let i = 0; i < text.length; i++) {
                // If this letter is space, just skip pixels.
                if (text[i] === " ") {
                    xoffset += this.space;
                    i++;
                }
                // Get the index of the letter
                let charIndex = letters.indexOf(text[i]);

                // Get the width of the letter
                let width = parseInt(this.widths[charIndex]);

                // Get the X coordinate of the letter
                let lx = 0;
                for (let xi = 0; xi < charIndex; xi++) {
                    lx += parseInt(this.widths[xi]);
                }

                // Draw the letter
                ctx.drawImage(this.canvas,
                    // Source
                    lx, color * this.img.height, width, this.img.height,
                    // Destination
                    x + xoffset, y, width, this.img.height);

                // Apply the width to the offset
                xoffset += width;
            }

            // Return the width of the whole text.
            return xoffset
        } else {
            // If not, return false
            return false;
        }
    }
}

Number.prototype.between = function(a, b, inclusive) {
    let min = Math.min(a, b),
        max = Math.max(a, b);

    return inclusive ? this >= min && this <= max : this > min && this < max;
}

class Hitbox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    point(x, y){
        return (
            // X Axis
            x.between(this.x, this.x + this.w, false) &&
            // Y Axis
            y.between(this.y, this.y + this.h, false)
        )
    }
}
