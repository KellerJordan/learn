function printVar() {
    if (typeof myVar === "undefined") {
        console.log("myVar is undefined");
    } else {
        console.log(`myVar = ${myVar}`);
    }
}

console.log(`loaded script.js: document.body=${document.body}`);

function runTest() {
    console.log("=======RUNNING VARIABLE DEF TEST=====");
    printVar();
    const tag = document.createElement("script");
    tag.src = "loadScript.js";
    document.head.append(tag);
    tag.addEventListener("load", () => {
        printVar();
        console.log(myVar); // this works too
    });
    printVar();
}

(function() {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("document DOMContentLoaded event");
    });
    window.addEventListener("load", function() {
        console.log("window load event");
        runTest();
    });
})();


