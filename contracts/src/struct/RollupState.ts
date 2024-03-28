import {DeployArgs, Field, MerkleMapWitness, method, SmartContract, State, Struct} from "o1js";

export class RollupState extends Struct({
    initialRoot: Field,
    latestRoot: Field,
}) {

    static createOneStep(
        initialRoot: Field,
        latestRoot: Field,
        key: Field,
        currentValue: Field,
        incrementAmount: Field,
        merkleMapWitness: MerkleMapWitness,
    ) {
        const [ witnessRootBefore, witnessKey ] = merkleMapWitness.computeRootAndKey(currentValue);
        initialRoot.assertEquals(witnessRootBefore);
        witnessKey.assertEquals(key);
        const [ witnessRootAfter, _ ] = merkleMapWitness.computeRootAndKey(currentValue.add(incrementAmount));
        latestRoot.assertEquals(witnessRootAfter);

        return new RollupState({
            initialRoot,
            latestRoot
        });
    }

    static createMerged(state1: RollupState, state2: RollupState) {
        return new RollupState({
            initialRoot: state1.initialRoot,
            latestRoot: state2.latestRoot
        });
    }

    static assertEquals(state1: RollupState, state2: RollupState) {
        state1.initialRoot.assertEquals(state2.initialRoot);
        state1.latestRoot.assertEquals(state2.latestRoot);
    }
}
