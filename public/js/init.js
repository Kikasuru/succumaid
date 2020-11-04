// init.js - Handles initial setup
let zoom = 2;

// Starts the main loop
function init(){
    // Get Canvas
    let canvas = document.getElementById("main");
    // Check if Canvas is compatible
    if (canvas.getContext) {
        // Resize the Canvas
        resize();

        // Disable Rightclicks
        canvas.oncontextmenu = function(e) {
            return false;
        };

        // Get Context
        let ctx = canvas.getContext("2d");

        // Create mouse input
        let mouse = new MouseInput();
        mouse.applyInputCallbacks();

        // Load the palette
        let palimg = new Image();
        palimg.src = "assets/pal.png";

        let font = new BitFont("assets/font.png", "46987333673737747777777733575787777777757778777777777977747457777777773573977777777797775355", 4);

        let swatchSpr = [];
        let swatchHit = [];

        palimg.onload = function(){
            createCHexObject(palimg, 0);

            font.render().then(function(){
                // Start the loop
                setInterval(main,16);
            });

            // Load sprites here
            for (let i = 0; i < 14; i++) {
                // Make a sprite for this swatch
                let spr = new Sprite([{src:"assets/swatch.png", color:i + 1}], 8, 8);
                swatchSpr.push(spr);
                spr.render();

                // Make a hitbox for this swatch
                let hit = new Hitbox((8 * i) + 1, canvas.height - 9, 8, 8);
                swatchHit.push(hit);
            }
        }


        // Main Loop
        let currColor = color.WHITE;

        function main() {
            // Clear the screen
            ctx.fillStyle = coltohex(colorhex[currColor][3]);
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // If the mouse was clicked, check if it clicked a swatch
            if (mouse.press.left) {
                swatchHit.forEach(function(e, i){
                    if (e.point(mouse.x, mouse.y)) {
                        currColor = i + 1;
                    }
                });
            }

            // Render swatches
            swatchSpr.forEach(function(e, i){
                e.draw(ctx, 0, (8 * i) + 1, canvas.height - 9);
            });

            font.draw(ctx, "The quick brown fox jumps over the lazy dog.", 16, 16, currColor);

            font.draw(ctx, "Kikasuru 2020", canvas.width - 86, canvas.height - 7, currColor)

            // Reset presses
            mouse.resetPresses();
        }
    } else {
        // Tell the user that their browser is not Canvas compatible.
        document.body.innerHTML = "Sorry, your browser does not support Canvas."; // get beaned dummy
    }
}

// Resizes the canvas
function resize(){
    // Get Canvas
    let canvas = document.getElementById("main");

    // Set Canvas Size
    canvas.width = Math.floor(window.innerWidth/zoom);
    canvas.height = Math.floor(window.innerHeight/zoom);
}
