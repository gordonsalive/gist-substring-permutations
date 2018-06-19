//Find all the permutations of a smaller string within a larger string.

//How do we do permutation?...well permutations of "a" are "a"
//permutations of ab are ab and ba, I just added the second on after and in front of the first one
//permutations of abc, I take permutations ab (ab and ba) and I add c into each position, i.e. cab, acb, abc, cba, bca, bac,
// so I take the next letter and put it start, all inbetween locations and end of all permutations so far.
let shortString = "abc";
let longString = "abcdcdcbacbacbdbcbacbdbcabcabcdbcdbabcabca";

function perm(aString, perms) {
    if (aString === "") {
        return perms;
    } else if (perms.length === 0) {
        //take a letter
        let head = aString[0];
        let tail = aString.slice(1);
        //initialise first permutation
        let newPerms = [head];
        return perm(tail, newPerms);
    } else {
        //take a letter
        let head = aString[0];
        let tail = aString.slice(1);
        //for each perm add head into all positions and then recurse
        let newPerms = [];
        for (let x = 0; x < perms.length; x++) {
            let perm = perms[x];
            for (let y = 0; y <= perm.length; y++) {
                newPerms.push(perm.substring(0, y) + head + perm.slice(y));
            }
        }
        return perm(tail, newPerms);
    }

}

let permsOfShortString = perm(shortString, []);
console.log(permsOfShortString);

//now walk through long string looking for permutations
let output = [];
let l = shortString.length;
let map = new Map(permsOfShortString.map((item) => [item, item]));
for (let i = 0; i < longString.length; i++) {
    let stringToCompare = longString.slice(i, i + l);
    if (map.get(stringToCompare)) {
        output.push([i, stringToCompare]);
    }
}
console.log(JSON.stringify(output));

//so this works, but wait a sec.  Do I need to create all those permutations?  The number is O(N!), that's a lot! much worse than O(N²).
//what if I did this the other way around? walk through string, if I find a letter that's in my short string, are all the following letters up to 
//short string length, both in the short string and unique?  Let give this a go, this will be a lot shorter.
function longStringWalker(longString, shortString) {
    //asumes all the letters in shortstring are unique.
    function isPerm(stringA, stringB) {
        //take head and find it in stringB, if found recurse with remaining strings, if strings are empty it's a match.
        if (stringA.length !== stringB.length) {
            throw "Error: lengths must match to check if string A is a permutation of string B";
        } else if (stringA.length === 0) {
            return true;
        } else {
            let head = stringA[0];
            let tail = stringA.slice(1);
            if (stringB.includes(head)) {
                let remainder = stringB.replace(head, "");
                return isPerm(tail, remainder);
            } else {
                return false;
            }
        }
    }
    let output2 = [];
    let sl = shortString.length;
    //no need to walk to the very end of the string, and last (sl-1) chars can't provide a full permutation so can stop there 
    for (let x = 0; x <= longString.length - sl; x++) {
        let longStringPart = longString.slice(x, x + sl);
        let match = isPerm(longStringPart, shortString);
        if (match) {
            output2.push([x, longStringPart]);
        }
    }
    console.log(`output2=${JSON.stringify(output2)}`);
    return output2;
}
longStringWalker(longString, shortString);
//This is a much prettier and faster solution.  (Note, I am doing a fair bit of string work here, which I could avoid, but then this is just a gist).
//This version would scale at loop through long string (L), loop through short string (S) occasionally, so between O(L) and O(L * S), much 
//better than O(N!) above.