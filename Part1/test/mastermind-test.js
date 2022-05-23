//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const { expect, should } = require("chai");
const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;


const assertError = async (promise) => {
    s
}

describe("Mastermind Test", () => {
    let circuit;

    beforeEach( async () => {
        circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
    })

    it("should have the same public solution hash", async () => {
        const INPUT = {
            "pubGuessA": "1",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubGuessE": "5",
            "pubNumHit": "1",
            "pubNumBlow": "2",
            "privSolnA": "1",
            "privSolnB": "4",
            "privSolnC": "5",
            "privSolnD": "6",
            "privSolnE": "7",
            "privSalt": "12",
            "pubSolnHash": "2878562622908026228633922068012262079748159457515768665872918198459430086615"
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e("2878562622908026228633922068012262079748159457515768665872918198459430086615")));
    });

    it('throws assertion error if private guess does not match public hash provided', async () => {
        const INPUT = {
            "pubGuessA": "1",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubGuessE": "5",
            "pubNumHit": "1",
            "pubNumBlow": "2",
            "privSolnA": "1",
            "privSolnB": "7",
            "privSolnC": "5",
            "privSolnD": "6",
            "privSolnE": "7",
            "privSalt": "12",
            "pubSolnHash": "2878562622908026228633922068012262079748159457515768665872918198459430086615"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
        } catch(err) {
            assert(true);
            return;
        }

        assert(false);
    });

    it('throws assertion error if public solution hash does not match private solution hash', async () => {
        const INPUT = {
            "pubGuessA": "1",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubGuessE": "5",
            "pubNumHit": "1",
            "pubNumBlow": "2",
            "privSolnA": "1",
            "privSolnB": "4",
            "privSolnC": "5",
            "privSolnD": "6",
            "privSolnE": "7",
            "privSalt": "12",
            "pubSolnHash": "2878562622928633922068012262079748159457515768665872918198459430086615"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
        } catch(err) {
            assert(true);
            return;
        }

        assert(false);
    });

    it('throws assertion error if pubGuessA is greater than 10', async () => {
        const INPUT = {
            "pubGuessA": "13",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubGuessE": "5",
            "pubNumHit": "1",
            "pubNumBlow": "2",
            "privSolnA": "1",
            "privSolnB": "4",
            "privSolnC": "5",
            "privSolnD": "6",
            "privSolnE": "7",
            "privSalt": "12",
            "pubSolnHash": "2878562622928633922068012262079748159457515768665872918198459430086615"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
        } catch(err) {
            assert(true);
            return;
        }

        assert(false);
    });

    it('throws if the pubHit/pubBlow does not match the actual hits/blow', async () => {
        const INPUT = {
            "pubGuessA": "1",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubGuessE": "5",
            "pubNumHit": "4",
            "pubNumBlow": "2",
            "privSolnA": "1",
            "privSolnB": "4",
            "privSolnC": "5",
            "privSolnD": "6",
            "privSolnE": "7",
            "privSalt": "12",
            "pubSolnHash": "2878562622908026228633922068012262079748159457515768665872918198459430086615"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
        } catch(err) {
            assert(true);
            return;
        }

        assert(false);
    })

    it('throws assertion error if privSalt is wrong', async () => {
        const INPUT = {
            "pubGuessA": "1",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubGuessE": "5",
            "pubNumHit": "4",
            "pubNumBlow": "2",
            "privSolnA": "1",
            "privSolnB": "4",
            "privSolnC": "5",
            "privSolnD": "6",
            "privSolnE": "7",
            "privSalt": "12",
            "pubSolnHash": "2878562622908026228633922068012262079748159457515768665872918198459430086615"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
        } catch(err) {
            assert(true);
            return;
        }

        assert(false);
    })


})