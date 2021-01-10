let drawArea = {
    start() {
        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");
    },
    adjustSize() {
        this.canvas.setAttribute("width", window.innerWidth);
        this.canvas.setAttribute("height", window.innerHeight);
    },
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.context.height);
    },
    drawPicture() {
        let ctx = this.context;
        let width = this.canvas.width;
        let height = this.canvas.height;

        ctx.drawStyle = "blue";
        ctx.fillStyle = "orange";
        ctx.fillRect(0, 0, width, height);

        let gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 14;
        ctx.font = "190px Georgia";
        let pad = 35;
        ctx.strokeText("yah baway      !", pad, 250, width-2*pad);
    },
    drawFractal() {
        let image = genPicture(0, 0, this.canvas.width, this.canvas.height, 1);
        this.context.drawImage(image, 1, 1);
    }
}

function registerHandlers() {
    // Toggle menu on Esc keypress
    let menuShown = true;
    document.addEventListener("keydown", function(e) {
        if (e.key == "Escape") {
            menuShown = !menuShown;
            let menu = document.querySelector("#menuContainer");
            menu.style.display = menuShown ? "block" : "none";
        }
    });
    // Disable right-clicking on canvas
    drawArea.canvas.addEventListener("contextmenu", e => {
        e.preventDefault();
    });
}

// Main game loop
function playTick() {
    drawArea.adjustSize();
    drawArea.clear();
    drawArea.drawPicture();
}

function main() {
    drawArea.start();
    registerHandlers();
    //setInterval(playTick, 1000 / gameParameters.fps);
    playTick();
    drawArea.drawFractal();

}


main();
