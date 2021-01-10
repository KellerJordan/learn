let shade = document.querySelector("#embed-shade");
let player = document.querySelector("#embed-container");
shade.addEventListener("click", e => {
    shade.style.display = "none";
    player.style.left = "0px";
    player.style.top = "0px";
    let duration = 2000;
    shakeElem(player, duration);
    setTimeout(() => {
        shade.style.display = "block";
        player.style.left = "0";
        player.style.top = "0";
    }, duration);
});

function shakeElem(elem, duration) {
    let off = Number(elem.style.left.slice(0, -2));
    off = (off != 0) ? 0 : 15;
    elem.style.left = String(off) + "px";
    if (duration >= 100) {
        setTimeout(() => shakeElem(elem, duration-100), 100);
    }
}

window.focus();
window.addEventListener("blur", function listener(e) {
    if (document.activeElement.tagName == "IFRAME") {
        console.log("I can smell you clicking : -- )");
    }
    // need a timeout here -- 0ms delay works on chrome but unsure for other browsers.
    // using microtasks (aka Promises) does not work in Chrome. Interesting.
    setTimeout(() => window.focus(), 1);
});

