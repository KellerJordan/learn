let MAX_STEPS = 20;

// calculate Mandelbrot escape rate of z
// recursion z_{n+1} = z_n^2 + c
// returns first time that |z_n| >= 2
function escapeTime(c) {
    let steps = 0;
    let z = c;
    while(steps < MAX_STEPS) {
        if (z.abs() >= 2) {
            break;
        }
        steps++;
        z = z.mul(z).add(c);
    }
    return steps;
}

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

let memoDict = {};
function stepsToColor(steps) {
    if (memoDict[steps]) {
        return memoDict[steps];
    }
    let period = (steps % 20) / 20;
    let value = steps == MAX_STEPS ? 0.0 : 1.0;
    let hsv = [period, 1.0, value];
    let rgb = HSVtoRGB(...hsv);
    let rgba = [rgb.r, rgb.g, rgb.b, 255];
    memoDict[steps] = rgba;
    return rgba;
}

// generate a rectangular snapshot of the Mandelbrot set
// parameters: x, y for top-left corner of rectangle, width and height for number pixels, zoom for pixel dimensions
async function genPicture(x, y, width, height, zoom) {
    memoDict = {}; // reset memoization
    let pixelArray = new Uint8ClampedArray(new Array(4*width*height).fill(200));
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let c = math.complex(x + j*zoom, y + i*zoom);
            let steps = escapeTime(c);
            let rgba = stepsToColor(steps);
            let start = 4 * (i * width + j);
            for (let k = 0; k < 4; k++) {
                pixelArray[start+k] = rgba[k];
            }
        }
    }
    let data = new ImageData(pixelArray, width, height);
    let bitmap = await createImageBitmap(data);
    return bitmap
}
