let langs, fsms, categories, counts;
function main() {
    const n_states = 3;
    const s_len = 4;
    const quotient = false;
    fsms = getAllFSM(n_states);
    langs = new LanguageSet(s_len, quotient);
    categories = [];
    for (let i in fsms) {
        let l = getFSMLang(fsms[i], s_len);
        let c = langs.add(l);
        categories.push(c);
    }
    const n_langs = langs.data.length;
    console.log(`There are ${fsms.length} ${n_states}-state FSMs, \
which can recognize ${n_langs} distinct regular languages\
${quotient ? " up to complement" : ""}.`)

    counts = function() {
        let result = new Array(n_langs).fill(0);
        for (let i = 0; i < result.length; i++) {
            result[i] = [i, 0];
        }
        for (let c of categories) {
            result[c][1]++;
        }
        result.sort((x, y) => y[1] - x[1]);
        for (let row of result) {
            let cat = row[0];
            let i = categories.indexOf(cat);
            row.push(langs.data[cat]);
            row.push([i, fsms[i].transition, fsms[i].accept]);
        }
        return result;
    }();
    console.log(counts);
}

let t0 = performance.now();
main();
let t1 = performance.now();
console.log(`Execution of main() took ${t1 - t0}ms.`);
