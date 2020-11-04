// spr.js - Handles sprite loading and fonts
let letters = "!\"#$%'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQUSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~"
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
    constructor(img, widths, space){
        this.img = img;
        this.widths = widths;
        this.space = space;
    }

    render(){
        // Make a new canvas for this font
        this.canvas = document.createElement("canvas");

        // Resize this canvas
        this.canvas.width   = this.img.width;
        this.canvas.height  = colorhex.length * this.img.height;

        // Add this canvas to the font cache
        document.getElementById("fonts").appendChild(this.canvas);

        // Make a new context for the canvas
        let ctx = this.canvas.getContext("2d");

        // Go through each color
        for (let c = 0; c < colorhex.length; c++) {
            // Draw the font onto the canvas
            ctx.drawImage(this.img, 0, c * this.img.height);

            // Color the font
            recolorArea(ctx, c, 0, c * this.img.height, this.img.width, this.img.height);
        }
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
