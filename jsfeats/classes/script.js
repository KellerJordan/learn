class User {
    static type = "man";
    constructor(name) {
        this._name = name;
    }
    sayHi() {
        console.log(this._name);
    }
    ['test'+'b']() {
        console.log("yup");
    }
}

class Dave extends User {

}

function Bob() {
}
Bob.prototype = {};
Bob.prototype.constructor = Bob;
Object.setPrototypeOf(Bob.prototype, User.prototype);
Bob.staticProp = "am I here";

class BobJr extends Bob {

}

console.log(Dave.type);
console.log(Bob.type);
console.log(BobJr.staticProp);

