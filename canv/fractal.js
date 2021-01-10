const MAX_STEPS = 20;

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

// generate a rectangular snapshot of the Mandelbrot set
// parameters: x, y for top-left corner of rectangle, width and height for number pixels, zoom for pixel dimensions
function genPicture(x, y, width, height, zoom) {
    let pixelArray = new Uint8ClampedArray(new Array(4*width*height).fill(143));
    let data = new ImageData(pixelArray, width, height);
    let bitmap = createImageBitmap(data);
    return bitmap
    // for (let i = 0; i < height; i++) {
    //     for (let j = 0; j < width; j++) {
    //         let c = complex(x+j*zoom, y+i*zoom);
    //         let steps = escapeTime(c);



    //     }
    // }
}
