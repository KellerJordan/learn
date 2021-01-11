function runCycles(cycles=200e6, verbose=true) {
    let j = 1;
    let k = 1;
    let mod1 = 2**29;
    let mod2 = 23457;
    for (let i = 0; i < cycles; i++) {
        k = j + k;
        j = k - j;
        j = j % mod1; 
        k = k % mod1;
        if (verbose && ((i % 20e6) == 0)) {
            console.log(j, k);
        }
    }
    console.log(k);
}

function test1() {
    console.log("first script");
    let script = document.createElement("script");
    script.src = "script2.js";
    script.onload = () => console.log("loaded second script");
    document.head.append(script);
    console.log("appended 2nd script");

    runCycles();
    setTimeout(() => console.log("zero-timeout done"), 0);
    setTimeout(() => console.log("timeout done"), 10);
}
// test1();

function test2() {
    let promise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 1000);
    });
    setTimeout(() => promise.then(() => console.log("then0a")).then(() => console.log("then0b")), 0);
    promise.then(() => console.log("then1a")).then(() => console.log("then1b"));
    promise.then(() => setTimeout(() => console.log("then2")), 0);
    promise.then(() => console.log("then3a")).then(() => console.log("then3b"));
}
//setTimeout(test2, 1200);

let x = 5;
async function test3_inner() {
    console.log(x);
    let modX = new Promise(function(resolve, reject) {
        setTimeout(() => {
            x = 6;
            resolve(0);
        }, 0);
    });
    await modX;
    console.log(x);
}
async function test3() {
    console.log("outer", x);
    let p = test3_inner();
    await p;
    console.log("outer", x);
}
// test3();

let y = 3;
async function test4() {
    console.log(y);
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            // y = 8;
            resolve(5);
        }, 1000);
    });
    setTimeout(() => {
        y = 4;
    }, 500);
    console.log(y);
    await p;
    console.log(y);
}
// test4();

function makePromise(funcTemplate) {
    let promise = {
        callback: () => undefined,
        resolve(value) {
            this.value = value;
            this.resolved = true;
            this.callback();
        },
        exec() {
            funcTemplate(value => this.resolve(value));
        },
        value: undefined,
        resolved: false,
        then(callback) {
            if (this.resolved) {
                callback(this.value);
            } else {
                this.callback = callback;
            }
        }
    }
    promise.exec();
    return promise;
}

let z = 3;
function test5() {
    console.log(z);
    let p = makePromise(function(resolve) {
        setTimeout(() => resolve(5), 1000);
    });
    setTimeout(() => {
        p.then(value => {
            console.log(z);
        });
    }, 1500);
    setTimeout(() => {
        z = 4;
    }, 500);
}
// test5();

function test6() {
    function myHi() {
        console.log(this.myName);
    }
    let obj = {
        myName: "Bob",
        hi1() {
            console.log(this.myName);
        },
        hi2() {
            myHi();
        },
        hi3() {
            myHi.call(this);
        }
    }
    obj.hi1();
    obj.hi2();
    obj.hi3();
    let hi = obj.hi1;
    hi();
    (function(hi) {
        hi();
    })(obj.hi1);
    (hi => hi())(obj.hi1);
}
// test6();

function test7() {
    let t1 = Date.now();
    runCycles(880e6, false);
    let t2 = Date.now();
    console.log(`Took ${t2 - t1} ms.`);
}
test7();


