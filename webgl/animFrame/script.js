const canv = document.querySelector("canvas");
const ctx = canv.getContext("2d");

const inputState = {
    spaceDown: false,
};

window.addEventListener("keydown", e => {
    if (e.key == " ") {
        console.log(`space keydown event received at time=${performance.now().toFixed(0)}`);
        inputState.spaceDown = true;
    }
});
window.addEventListener("keyup", e => {
    if (e.key == " ") {
        inputState.spaceDown = false;
    }
});

function makeFramer(name) {
    return {
        name: name,
        currFrame: undefined,
        spaceDown: false,
        frame() {
            this.currFrame = requestAnimationFrame(() => this.frame());
            if (inputState.spaceDown) {
                if (!this.spaceDown) {
                    this.spaceDown = true;
                    console.log(`${this.name} had a frame after spacedown at time=${performance.now().toFixed(0)}.`)
                }
            } else {
                this.spaceDown = false;
            }
        },
        startFrames() {
            this.currFrame = requestAnimationFrame(() => this.frame());
        },
        cancelFrames() {
            cancelAnimationFrame(this.currFrame);
        },
    };
}

makeFramer("framer1").startFrames();
makeFramer("framer2").startFrames();

async function test1() {
    t0 = performance.now()
    return await new Promise(resolve => {
        requestAnimationFrame(() => {
            t1 = performance.now();
            resolve(t1 - t0);
        });
    });
}

function doWork(ms) {
    ms = Number(ms);
    if (ms > 500 || isNaN(ms)) {
        console.log("bad ms");
        return;
    }
    t0 = performance.now();
    while (true) {
        t1 = performance.now();
        if (t1 - t0 >= ms) {
            return;
        }
    }
}
async function test2(ms) {
    t0 = performance.now()
    return await new Promise(resolve => {
        requestAnimationFrame(() => {
            doWork(ms);
            t1 = performance.now();
            resolve(t1 - t0);
        });
    });
}

function avg(arr) {
    var sum = 0;
    for (let x of arr) {
        sum += x;
    }
    return sum/arr.length;
}

/*
const delays = [];
async function main() {

    const intId = setInterval(async () => {
        var delay = await test1();
        delays.push(delay);
    }, 50);
    setTimeout(() => {
        clearInterval(intId);
        console.log(avg(delays));
    }, 2000);
}
*/
//window.addEventListener("load", main);
