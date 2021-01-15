const maker = {
    gpu: new GPU(),
    width: null,
    height: null,
    kernel: null,
    colorDict: makeStepsToColorDict(),
    setDimensions(w, h) {
        this.width = w;
        this.height = h;
        this.render = this.gpu.createKernel(function(x, y, s, MAX_STEPS, COLORDICT) {
            let cr = x + s * this.thread.x;
            let ci = y + s * this.thread.y;
            let zr = cr;
            let zi = ci;
            let tr = zr;
            let ti = zi;
            let steps = 0;
            while (steps < MAX_STEPS) {
                if (zr * zr + zi * zi > 4) break;
                steps++;
                tr = zr * zr - zi * zi + cr;
                ti = 2 * zr * zi + ci;
                zr = tr;
                zi = ti;
            }
            return steps;
        }).setOutput([w, h]);
    },

    // generate a rectangular snapshot of the Mandelbrot set
    // parameters: x, y for top-left corner of rectangle, s for size of pixel
    async make(x, y, s, gpu=true) {
        if (gpu) {
            const stepArray = this.render(x, y, s, this.MAX_STEPS, [1,2,3,4]);
            console.log(stepArray);
            const w = this.width;
            const h = this.height;
            const pixelArray = new Uint8ClampedArray(new Array(4*w*h).fill(200));
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    let c = math.complex(x + j*s, y + i*s);
                    let steps = stepArray[i][j];
                    let rgba = steps == this.MAX_STEPS ? [0, 0, 0, 255] : [...this.colorDict[steps], 255];
                    let start = 4 * (i * w + j);
                    for (let k = 0; k < 4; k++) {
                        pixelArray[start+k] = rgba[k];
                    }
                }
            }
            let data = new ImageData(pixelArray, w, h);
            let bitmap = await createImageBitmap(data);
            return bitmap
        }

        if (!gpu) {
            const w = this.width;
            const h = this.height;
            const pixelArray = new Uint8ClampedArray(new Array(4*w*h).fill(200));
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    let c = math.complex(x + j*s, y + i*s);
                    let steps = this.escapeTime(c);
                    let rgba = steps == this.MAX_STEPS ? [0, 0, 0, 255] : [...this.colorDict[steps], 255];
                    let start = 4 * (i * w + j);
                    for (let k = 0; k < 4; k++) {
                        pixelArray[start+k] = rgba[k];
                    }
                }
            }
            let data = new ImageData(pixelArray, w, h);
            let bitmap = await createImageBitmap(data);
            return bitmap
        }
    },

    MAX_STEPS: 20,
    // calculate Mandelbrot escape rate of z
    // recursion z_{n+1} = z_n^2 + c
    // returns first time that |z_n| >= 2
    escapeTime(c) {
        let steps = 0;
        let z = c;
        while(steps < this.MAX_STEPS) {
            if (z.abs() >= 2) {
                break;
            }
            steps++;
            z = z.mul(z).add(c);
        }
        return steps;
    },
}

