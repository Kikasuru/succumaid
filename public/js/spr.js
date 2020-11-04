// spr.js - Handles sprite loading and fonts
let letters = "!\"#$%'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQUSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~"

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
