function Language(data) {
    this.data = data;
}
Language.prototype = {
    equals(lang) {
        const x = this.data;
        const y = lang.data;
        // return String(x) == String(y);
        if (x.length != y.length) return false;
        for (let i in x) {
            if (x[i] != y[i]) return false;
        }
        return true;
    },
    subtract(lang) {
        const x = this.data;
        const y = lang.data;
        const r = [...x];
        let i = 0;
        let j = 0;
        while (j < y.length) {
            if (i >= r.length) {
                console.log(i, j);
                throw new Error("should not happen");
            }
            if (r[i] == y[j]) {
                r.splice(i, 1);
                j++;
            } else {
                i++;
            }
        }
        return new Language(r);
    },
    product(lang) {
        const x = this.data;
        const y = lang.data;
        const result = [];
        for (let a of x) {
            for (let b of y) {
                result.push(a.concat(b));
            }
        }
        return new Language(result);
    },
    hash() {
        const s = String(this.data).concat(this.data[0] == "" ? "ep" : "");
        // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
        let hash = 0;
        if (s.length == 0) return hash;
        for (i = 0; i < s.length; i++) {
            char = s.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },
}

function getKAryStrings(k, n) {
    const result = [];
    if (n == 0) {
        result.push('');
    } else {
        for (let s of getKAryStrings(k, n-1).data) {
            for (let i = 0; i < k; i++) {
                result.push(s.concat(i));
            }
        }
    }
    return new Language(result);
}

function getFullLanguage(k) {
    let result = [];
    for (let j = 0; j <= k; j++) {
        result = result.concat(getKAryStrings(2, j).data);
    }
    return new Language(result);
}

// expects to receive Language objects
function LanguageSet(len, quotient=false) {
    this.len = len;
    this.data = [];
    this.map = new Map();
    this.fullLang = getFullLanguage(len);
    this.quotient = quotient;
}
LanguageSet.prototype = {
    // adds and returns index of addition (whether or not was new)
    add(x) {
        const key = x.hash();
        if (this.map.has(key)) return this.map.get(key);
        if (this.quotient) {
            const x_c = this.fullLang.subtract(x);
            const key_c = x_c.hash();
            if (this.map.has(key_c)) return this.map.get(key_c);
        }
        const index = Array.prototype.push.apply(this.data, arguments) - 1;
        this.map.set(key, index);
        return index;
    },
}


