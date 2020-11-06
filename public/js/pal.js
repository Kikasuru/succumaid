// pal.js - Handles palettes and colors

const color = {
    NULL: 0,
    WHITE: 1,
    BLACK: 2,
    VANILLA: 3,
    CHOCOLATE: 4,
    RED: 5,
    GOLD: 6,
    YELLOW 7,
    LIME_GREEN: 8,
    AQUAMARINE: 9,
    BABY_BLUE: 10,
    CYAN: 11,
    BLUE: 12,
    PURPLE: 13,
    PINK: 14,
    MASTER: 63
}

let colorhex = [];

const MASTER_COLOR = color.MASTER;

function createCHexObject(img, pal) {
    // Make a new canvas for the palette image
    let canvas = document.createElement("canvas");

    // Resize this canvas
    canvas.height  = img.height;
    canvas.width   = img.width;

    // Add this canvas to the sprite cache
    document.getElementById("spr").appendChild(canvas);

    // Make a new context for the canvas
    let ctx = canvas.getContext("2d");

    // Draw the font onto the canvas
    ctx.drawImage(img, 0, 0);

    // Get the image data for this palette
    const data = ctx.getImageData((pal % 2) * 16, Math.floor(pal / 2) * 16, 16, 16).data;

    // Go through the palette
    for (let i = 0; i < 64; i++) {
        // Create a new array for this color
        let colorgrad = [];

        // Loop 4 times for each shade in this color
        for (c = 0; c < 16; c += 4) {
            colorgrad.push([data[(i * 16) + c], data[(i * 16) + c + 1], data[(i * 16) + c + 2]]);
        }

        // Add the array to the master array
        colorhex.push(colorgrad);
    }
}

function recolorArea(ctx, color, x, y, w, h) {
    // Get the image data
    let imgData = ctx.getImageData(x, y, w, h);
    let data    = imgData.data;

    // Loop through the data
    for (let i = 0; i < data.length; i += 4) {
        // Check if this value is transparent
        if (data[i + 3] === 0) continue;
        // Check if these values match any of the colors in the palette
        for (let c = 0; c < 4; c++){
            if (colorhex[MASTER_COLOR][c][0] === data[i] &&
                colorhex[MASTER_COLOR][c][1] === data[i + 1] &&
                colorhex[MASTER_COLOR][c][2] === data[i + 2]) {
                // If so, replace the color
                data[i]     = colorhex[color][c][0];
                data[i + 1] = colorhex[color][c][1];
                data[i + 2] = colorhex[color][c][2];
            }
        }
    }

    // Reapply the newly colored area
    ctx.putImageData(imgData, x, y);
}

function coltohex(color) {
    function convert(integer) {
        var str = Number(integer).toString(16);
        return str.length == 1 ? "0" + str : str;
    };

    return "#"+convert(color[0])+convert(color[1])+convert(color[2])
}
