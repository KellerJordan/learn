
function printVar() {
    if (typeof myVar === "undefined") {
        console.log("myVar is undefined");
    } else {
        console.log(`myVar = ${myVar}`);
    }
}

printVar();
const tag = document.createElement("script");
tag.src = "loadScript.js";
document.head.append(tag);
tag.addEventListener("load", () => {
    printVar();
    console.log(myVar); // this works too
});
printVar();


