import {DeployArgs, Field, MerkleMapWitness, method, SelfProof, SmartContract, state, State, ZkProgram} from "o1js";
import {RollupState} from "./RollupState";

const Owner =
    'B62qk2qsBj7yuHD6Cnws5fzfaxWuc58zxwJ1LmZbYFyTqScALN38rEv';

export const Rollup = ZkProgram({
    name: 'rollup',
    publicInput: RollupState,

    methods: {
        oneStep: {
            privateInputs: [ Field, Field, Field, Field, Field, MerkleMapWitness ],

            method(
                state: RollupState,
                initialRoot: Field,
                latestRoot: Field,
                key: Field,
                currentValue: Field,
                incrementAmount: Field,
                merkleMapWitness: MerkleMapWitness
            ) {
                const computedState = RollupState.createOneStep(
                    initialRoot,
                    latestRoot,
                    key,
                    currentValue,
                    incrementAmount,
                    merkleMapWitness
                );
                RollupState.assertEquals(computedState, state);
            }
        },

        merge: {
            privateInputs: [ SelfProof, SelfProof ],

            method(
                newState: RollupState,
                rollup1proof: SelfProof<RollupState, void>,
                rollup2proof: SelfProof<RollupState, void>,
            ) {
                rollup1proof.verify();
                rollup2proof.verify();

                rollup2proof.publicInput.initialRoot.assertEquals(rollup1proof.publicInput.latestRoot);
                rollup1proof.publicInput.initialRoot.assertEquals(newState.initialRoot);
                rollup2proof.publicInput.latestRoot.assertEquals(newState.latestRoot);
            }
        }

    },
});

export let RollupProof_ = ZkProgram.Proof(Rollup);
export class RollupProof extends RollupProof_ {}
class RollupContract extends SmartContract {
    @state(Field) state = State<Field>();

    deploy(args: DeployArgs) {
        super.deploy(args);
        // this.account.permissions.set({
        //     ...Permissions.default(),
        //     editState: Permissions.proofOrSignature(),
        // });
    }

    @method initStateRoot(stateRoot: Field) {
        this.state.set(stateRoot);
    }

    @method update(rollupStateProof: RollupProof) {
        const currentState = this.state.get();
        this.state.requireEquals(currentState);

        rollupStateProof.publicInput.initialRoot.assertEquals(currentState);

        rollupStateProof.verify();

        this.state.set(rollupStateProof.publicInput.latestRoot);
    }
}