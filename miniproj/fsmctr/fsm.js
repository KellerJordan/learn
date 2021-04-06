// transition should be an array where transition[s][x] is state to go from s on obs x
// accept should be an n-length list of 0 or 1 for whether each state is an accept state
// both states and symbols represented as natural numbers
function buildFSM(transition, accept) {
    const fsm = function(input) {
        let state = 0;
        for (let x of input) {
            // Take advantage of javascript's all-object-properties-including-array-indices-are-strings to avoid
            // casting x to a number index
            state = transition[state][x];
        }
        return accept[state];
    }
    fsm.transition = transition;
    fsm.accept = accept;
    return fsm;
}
// E.g. buildFSM([[0, 1], [1, 0]], 0) makes a two-state machine.

// gets all n-state FSMs
function getAllFSM(n) {
    return getKAryStrings(n, 2*n).product(getKAryStrings(2, n)).data.map(s => {
        const transition = [];
        for (let i = 0; i < n; i++) {
            transition.push([s[2*i], s[2*i+1]]);
        }
        const accept = [];
        for (let i = 0; i < n; i++) {
            accept.push(Boolean(Number(s[2*n+i])));
        }
        return buildFSM(transition, accept);
    });
}

// gets the language that given FSM accepts
function getFSMLang(fsm, n) {
    if (!n) {
        throw new Error("need n > 0");
    }
    return new Language(getFullLanguage(n).data.filter(fsm));
}
