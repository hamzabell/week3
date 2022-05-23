pragma circom 2.0.0;

// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit
// My variation uses 10 digits 0 - 9  and 5 holes.

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template MastermindVariation() {
    signal input pubGuessA;
    signal input pubGuessB;
    signal input pubGuessC;
    signal input pubGuessD;
    signal input pubGuessE;
    signal input pubNumHit;
    signal input pubNumBlow;
    signal input pubSolnHash;



    signal input privSolnA;
    signal input privSolnB;
    signal input privSolnC;
    signal input privSolnD;
    signal input privSolnE;
    signal input privSalt;


    signal output solnHash;

    var guess[5] = [pubGuessA, pubGuessB, pubGuessC, pubGuessD, pubGuessE];
    var soln[5] = [privSolnA, privSolnB, privSolnC, privSolnD, privSolnE];

    var i = 0;
    var j = 0;
    var equalIdx = 0;

    component lessThan[10];
    component equalSoln[10];
    component equalGuess[10];


    // Constraint that all inputs are less than 10
    for (i = 0; i < 5; i++) {
        lessThan[i] = LessThan(5);
        lessThan[i].in[0] <== guess[i];
        lessThan[i].in[1] <== 10;

        lessThan[i].out === 1;

        lessThan[i+5] = LessThan(5);
        lessThan[i+5].in[0] <== soln[i];
        lessThan[i+5].in[1] <== 10;

        lessThan[i+5].out === 1; 
    }
    
    // Constraint for distinct inputs
    var k = 0;
    var l = 0;
    for (k = 0; k < 5; k++) {
        for (l=k+1; l < 5; l++) {
            equalGuess[equalIdx] = IsEqual();
            equalGuess[equalIdx].in[0] <== guess[k];
            equalGuess[equalIdx].in[1] <== guess[l];

            equalGuess[equalIdx].out === 0;

            equalSoln[equalIdx] = IsEqual();
            equalSoln[equalIdx].in[0] <== soln[k];
            equalSoln[equalIdx].in[1] <== soln[l];

            equalSoln[equalIdx].out === 0;

            equalIdx++;
        }     
    }

    // Constraint numBlow and numHits
    var hit= 0;
    var blow = 0;

    component equalHB[25];
    for (i = 0; i < 5; i++) {
        for (j=0; j < 5; j++) {
            equalHB[5*i+j] = IsEqual();

            equalHB[5*i+j].in[0] <== soln[i];
            equalHB[5*i+j].in[1] <== guess[j];

            blow += equalHB[5*i+j].out;
            if (i==j){
                blow -= equalHB[5*i+j].out;
                hit += equalHB[5*i+j].out;
            }
        }
    }

    pubNumBlow === blow;
    pubNumHit === hit;


    component poseidon = Poseidon(6);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <== privSolnA;
    poseidon.inputs[2] <== privSolnB;
    poseidon.inputs[3] <== privSolnC;
    poseidon.inputs[4] <== privSolnD;
    poseidon.inputs[5] <== privSolnE;



    solnHash <== poseidon.out;
    pubSolnHash === solnHash;
}

component main = MastermindVariation();