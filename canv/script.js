let drawArea = {
    start() {
        this.canvas = document.querySelector("#drawArea");
        this.context = this.canvas.getContext("2d");
        this.scale = 2.5;
        this.context.scale(this.scale, this.scale);
        this.context.strokeStyle = "lightblue";
        this.context.lineWidth = "5px";
        this.boxX0 = 0;
        this.boxY0 = 0;
        this.boxX1 = 0;
        this.boxX2 = 0;
        this.selecting = false;
        this.image = undefined;
        this.pictureX = -2;
        this.pictureY = -2;
        this.pictureRes = 0.005 / this.scale;
    },
    adjustSize() {
        this.canvas.style.width = window.innerWidth+"px";
        this.canvas.style.height = window.innerHeight+"px";
        this.canvas.width = window.innerWidth * this.scale;
        this.canvas.height = window.innerHeight * this.scale;
    },
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.context.height);
    },
    // x, y for top-left corner position, r for pixel resolution
    async getPicture() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let image = await genPicture(this.pictureX, this.pictureY, width, height, this.pictureRes);
        this.image = image;
    },
    draw() {
        if (this.image) {
            this.context.drawImage(this.image, 0, 0);
        }
        if (this.selecting) {
            this.context.strokeRect(this.boxX0, this.boxY0, this.boxX1 - this.boxX0, this.boxY1 - this.boxY0);
        }
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
    // Handle selection box
    drawArea.canvas.addEventListener("mousedown", e => {
        drawArea.selecting = true;
        drawArea.boxX0 = drawArea.scale * e.x;
        drawArea.boxY0 = drawArea.scale * e.y;
    });
    drawArea.canvas.addEventListener("mousemove", e => {
        drawArea.boxX1 = drawArea.scale * e.x;
        drawArea.boxY1 = drawArea.scale * e.y;
    });
    drawArea.canvas.addEventListener("mouseup", e => {
        drawArea.selecting = false;
        drawArea.pictureX += drawArea.boxX0 * drawArea.pictureRes;
        drawArea.pictureY += drawArea.boxY0 * drawArea.pictureRes;
        drawArea.pictureRes *= (drawArea.boxX1 - drawArea.boxX0) / drawArea.canvas.width;
        console.log(drawArea.pictureX, drawArea.pictureY, drawArea.pictureRes);
        MAX_STEPS += 30;
        drawArea.getPicture();
    });
}

// ``Main game loop"
// Just for drag-box selection, not for main picture drawing
function playTick() {
    drawArea.adjustSize();
    drawArea.clear();
    drawArea.draw();
}

const FPS = 60;
function main() {
    drawArea.start();
    registerHandlers();
    setInterval(playTick, 1000 / FPS);
    playTick();
    drawArea.getPicture();
}


main();
