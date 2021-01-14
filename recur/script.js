// execute given number of timeouts recursively
// this will result in a large number of macrotasks being in the queue at peak depth
async function test1(depth) {
    // Executes fn after depth number of 0-ms timeouts
    function afterTimeout(fn, depth) {
        if (depth == 0)
            fn();
        else
            setTimeout(function() {
                afterTimeout(fn, depth-1)
            }, 0);
    }
    let start = Date.now();
    let p = new Promise(function(resolve, reject) {
        afterTimeout(resolve, depth);
    });
    await p;
    let result = Date.now() - start;
    return result;
}

// using promise chaining to do the same
async function test2(depth) {
    let start = Date.now();
    let p = Promise.resolve();
    for (let i = 0; i < depth; i++) {
        p = p.then(() => new Promise(resolve => setTimeout(resolve, 0)));
    }
    await p;
    let result = Date.now() - start;
    return result;
}

function makeLogger(testName) {
    return result => console.log(`Result of ${testName}: ${result}`);
}

let tests = [
    async () => await test1(60).then(makeLogger("test1"), alert),
    async () => await test2(60).then(makeLogger("test2"), alert),
]

async function runTests() {
    console.log("executing in sequence");
    await tests[0]();
    await tests[1]();

    console.log("executing in parallelish");
    await Promise.all([tests[1](), tests[0]()]);
}
runTests();

// Right.
async function innerSmallTest() {
    console.log(1);
    let p = new Promise(resolve => {
        console.log(2);
        setTimeout(resolve, 100);
    });
    await p;
    console.log(3);
    return;
}
async function smallTest() {
    innerSmallTest();
    console.log(4);
}
// smallTest();
