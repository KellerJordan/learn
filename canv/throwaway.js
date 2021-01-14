
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