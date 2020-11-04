// input.js - Handles Input

class MouseInput {
    constructor(){
        this.x = 0;
        this.y = 0;

        this.left = false;
        this.right = false;

        this.press = {
            left: false,
            right: false
        }
    }

    applyInputCallbacks() {
        let canvas = document.getElementById("main");
        let mouse = this;

        canvas.onmousemove = function (event){
            mouse.x = Math.floor(event.offsetX/zoom);
            mouse.y = Math.floor(event.offsetY/zoom);
        }

        canvas.onmousedown = function (event){
            switch (event.button) {
                case 0:
                    mouse.left = true;
                    mouse.press.left = true;
                    break;
                case 2:
                    mouse.right = true;
                    mouse.press.right = true;
                    break;
            }
        }

        canvas.onmouseup = function (event){
            switch (event.button) {
                case 0:
                    mouse.left = false;
                    mouse.press.left = false;
                    break;
                case 2:
                    mouse.right = false;
                    mouse.press.right = false;
                    break;
            }
        }
    }

    resetPresses(){
        this.press = {
            left: false,
            right: false
        }
    }
}
