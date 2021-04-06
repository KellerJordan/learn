const shade = document.querySelector("#embed-shade");
const player = document.querySelector("#embed-container");
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

// raising this above 15 will prevent all interaction with the iframe.
// general rule is that every time you move an iframe more than 15px (Manhattan distance) from its starting position,
// it will be non-interactive for 0.5s and resample a new starting position
const shakePixels = 15;
function shakeElem(elem, duration) {
    let off = Number(elem.style.left.slice(0, -2));
    off = (off != 0) ? 0 : shakePixels;
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
    // replacing the below setTimeout (macrotask) with a Promise (microtask) will fail to refocus the window in Chrome.
    setTimeout(() => window.focus(), 0);
});

console.log(document.currentScript);
console.log(document.currentScript.nonce);

function addYTAPI() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
