import {getApi} from "@/utils/api-client";
import {
    SmartContract,
    Poseidon,
    Field,
    State,
    state,
    PublicKey,
    Mina,
    method,
    UInt32,
    PrivateKey,
    AccountUpdate,
    MerkleTree,
    MerkleWitness,
    Struct, assert,
} from 'o1js';
import {string} from "prop-types";

// const {MerkleTree} = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')


let dataStore: HashMap<String> = new HashMap();
let tree: MerkleTree;
let root: string;

export async function setAllData() {
    dataStore = await getApi(GET_DATA)
    tree = new MerkleTree(dataStore.size())
    // const hashes = [];
    for (let [key, value] of dataStore.entries()) {
        tree.setLeaf(BigInt(key), new PoseidonHashString({
            position: key.toString(),
            secretHash: value

        }).hash())


    }
}


/**
 * construct the merkle tree and root
 * */
function constructAMerkleTreeRoot(position: String, secretHash: String) {

    // tree.setLeaf(BigInt(i), new PoseidonHashString({
    //     position: , secretHash: arr.length
    // }).hash())
}

/**
 * Get Proof whether the hash exists or not
 * */
export function getProof(data: string) {
    // if (!!tree) {
    //     const leaf = SHA256(data)
    //     const proof = tree.getProof(leaf)
    //     return [proof, leaf, tree.getRoot().toString('hex')]
    // }
    // return null;
}

class PoseidonHashString extends Struct({
    position: String,
    secretHash: String
}) {
    hash(): Field {
        return Poseidon.hash(PoseidonHashString.toFields(this));
    }
}
