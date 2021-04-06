const area = {
    start() {
        this.canvas = document.querySelector("#drawArea");
        this.context = this.canvas.getContext("2d");
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
        this.scale = 1;
        this.pixelSize = 0.005;
    },

    resize(callback) {
        // set dimensions and pixel scale
        let oldScale = this.scale;
        // this.scale = 0.5;
        this.scale = window.devicePixelRatio;
        // update resolution for picture calculation
        let ratio = this.scale / oldScale; 
        this.pixelSize /= ratio;
        this.width = parseInt(window.innerWidth * this.scale);
        this.height = parseInt(window.innerHeight * this.scale);
        // update canvas scale and dimensions
        this.canvas.style.width = window.innerWidth+"px";
        this.canvas.style.height = window.innerHeight+"px";
        this.context.scale(this.scale, this.scale);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        callback(this.width, this.height);
    },

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    draw() {
        if (this.picture) {
            this.context.drawImage(this.picture, 0, 0);
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
    area.canvas.addEventListener("contextmenu", e => {
        e.preventDefault();
    });
    // Handle selection box
    area.canvas.addEventListener("mousedown", e => {
        area.selecting = true;
        area.boxX0 = area.scale * e.x;
        area.boxY0 = area.scale * e.y;
        area.boxX1 = area.boxX0;
        area.boxY1 = area.boxY0;
        console.log(area.boxX0, area.boxY0);
    });
    area.canvas.addEventListener("mousemove", e => {
        if (area.selecting) {
            area.boxX1 = area.scale * e.x;
            area.boxY1 = area.boxY0 + (area.height / area.width) * (area.boxX1 - area.boxX0);
        }
    });
    // Will break if selection box is not started from top-left corner
    area.canvas.addEventListener("mouseup", e => {
        area.selecting = false;
        area.pictureX += area.pixelSize * area.boxX0;
        area.pictureY += area.pixelSize * area.boxY0;
        area.pixelSize *= (area.boxX1 - area.boxX0) / area.width;
        console.log(area.pictureX, area.pictureY, area.pixelSize);
        updatePicture();
    });
}

// ``Main game loop"
// Just for drag-box selection, not for main picture drawing
function playTick() {
    area.clear();
    area.draw();
}
// x, y for top-left corner position, r for pixel resolution
async function updatePicture() {
    maker.MAX_STEPS += 20;
    area.picture = await maker.make(area.pictureX, area.pictureY, area.pixelSize);
}

const FPS = 60;
function main() {
    area.start();
    area.resize(function(w, h) {
        maker.setDimensions(w, h);
    });
    registerHandlers();
    updatePicture().then(playTick);
    setInterval(playTick, 1000 / FPS);
}

main();
