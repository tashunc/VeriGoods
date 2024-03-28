const {MerkleTree} = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

let tree: any;

/**
 * construct the merkle tree and root
 * */
function constructAMerkleTreeRoot(arr: string[]) {
    const leaves = arr.map(x => SHA256(x))
    tree = new MerkleTree(leaves, SHA256)
    return tree.getRoot().toString('hex')
}

/**
 * Get Proof whether the hash exists or not
 * */
function getProof(data: string) {
    if (!!tree) {
        const leaf = SHA256(data)
        const proof = tree.getProof(leaf)
        return tree.verify(proof, leaf, tree.getRoot().toString('hex'))
    }
    return null;
}

