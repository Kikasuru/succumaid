// init.js - Handles initial setup

let zoom = 2

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

        // Create a new font
        let fontimg = new Image();
        fontimg.src = "assets/font.png"
        let font = new BitFont(fontimg, "46987333673737747777777733575787777777757778777777777977747457777777773573977777777797775355", 4);

        palimg.onload = function(){
            createCHexObject(palimg, 0);

            fontimg.onload = function(){
                font.render();

                // Start the loop
                setInterval(main,16);
            }
        }


        // Main Loop
        let currColor = color.WHITE;

        function main() {
            // Clear the screen
            ctx.fillStyle = coltohex(colorhex[color.BLACK][3]);
            ctx.fillRect(0, 0, Math.floor(window.innerWidth/zoom),Math.floor(window.innerHeight/zoom));

            // If the mouse was clicked..
            if (mouse.press.left || mouse.press.right) {
                // ..change the color!
                currColor = (currColor % 14) + 1;
            }

            font.draw(ctx, "The quick brown fox jumps over the lazy dog.", mouse.x, mouse.y, currColor);

            font.draw(ctx, "Kikasuru 2020", Math.floor(window.innerWidth/zoom) - 86, Math.floor(window.innerHeight/zoom) - 7, color.BLACK)

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
