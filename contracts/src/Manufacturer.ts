import {
    Field,
    SmartContract,
    state,
    State,
    method,
    PublicKey,
    Signature,
} from 'o1js';

// The public key of our trusted data provider
const MANUFACTURER_ONE_PUBLIC_KEY =
    'B62qpZ9ZnvBNFQrbeWGiJygdbXpn8QVsbUdDmJNNQazjGcjz7W2kWwu';


export class ManufacturerOne extends SmartContract {
    @state(Field) commitment = State<Field>();
    // todo : make a merkle root
    @state(Field) latestWarranty = State<Field>();
    @state(PublicKey) manufacturerPublicKey = State<PublicKey>();
    events = {
        verified: Field,
    };

    init() {
        super.init();
        // Initialize contract state
        this.manufacturerPublicKey.set(PublicKey.fromBase58(MANUFACTURER_ONE_PUBLIC_KEY));
        // Specify that caller should include signature with tx instead of proof
        this.requireSignature();
    }

    @method verify(warranty: Field) {
        const manufacturerPublicKey = this.manufacturerPublicKey.get();
        this.manufacturerPublicKey.requireEquals(manufacturerPublicKey);
        const latestWarranty = this.latestWarranty.get();
        this.latestWarranty.requireEquals(latestWarranty);
        this.latestWarranty.requireEquals(warranty)

    }

    @method issueProduct( warranty: Field): Field {
        const commitment = this.commitment.get();
        this.commitment.requireEquals(commitment);
        this.latestWarranty.set(warranty)
        this.emitEvent('verified', warranty);
        return warranty;

    }
}


const MANUFACTURER_TWO_PUBLIC_KEY =
    'B62qk2qsBj7yuHD6Cnws5fzfaxWuc58zxwJ1LmZbYFyTqScALN38rEv';

export class ManufacturerTwo extends SmartContract {
    @state(Field) commitment = State<Field>();
    // todo : make a merkle root
    @state(Field) latestWarranty = State<Field>();
    @state(PublicKey) manufacturerPublicKey = State<PublicKey>();
    events = {
        verified: Field,
    };

    init() {
        super.init();
        // Initialize contract state
        this.manufacturerPublicKey.set(PublicKey.fromBase58(MANUFACTURER_TWO_PUBLIC_KEY));
        // Specify that caller should include signature with tx instead of proof
        this.requireSignature();
    }

    @method verify(warranty: Field) {
        const manufacturerPublicKey = this.manufacturerPublicKey.get();
        this.manufacturerPublicKey.requireEquals(manufacturerPublicKey);
        const latestWarranty = this.latestWarranty.get();
        this.latestWarranty.requireEquals(latestWarranty);
        this.latestWarranty.requireEquals(warranty)

    }

    @method issueProduct( warranty: Field): Field {
        const commitment = this.commitment.get();
        this.commitment.requireEquals(commitment);
        this.latestWarranty.set(warranty)
        this.emitEvent('verified', warranty);
        return warranty;

    }
}