import {ManufacturerOne, ManufacturerTwo} from './Manufacturer';
import {
    Field,
    Mina,
    PrivateKey,
    PublicKey,
    AccountUpdate,
    Signature,
} from 'o1js';

let proofsEnabled = true;

// The public key of our trusted data provider
const MANUFACTURER_ONE =
    'B62qpZ9ZnvBNFQrbeWGiJygdbXpn8QVsbUdDmJNNQazjGcjz7W2kWwu';

const MANUFACTURER_TWO =
    'B62qk2qsBj7yuHD6Cnws5fzfaxWuc58zxwJ1LmZbYFyTqScALN38rEv';

describe('OracleExample', () => {
    let deployerAccount1: PublicKey,
        deployerKey1: PrivateKey,
        deployerAccount2: PublicKey,
        deployerKey2: PrivateKey,
        zkAppAddress1: PublicKey,
        zkAppAddress2: PublicKey,
        zkAppPrivateKey1: PrivateKey,
        zkAppPrivateKey2: PrivateKey,
        zkApp1: ManufacturerOne,
        zkApp2: ManufacturerTwo;

    beforeAll(async () => {
        if (proofsEnabled) {
            await ManufacturerOne.compile();
            await ManufacturerTwo.compile();
        }
    });

    beforeEach(() => {
        const Local = Mina.LocalBlockchain({proofsEnabled});
        Mina.setActiveInstance(Local);
        ({privateKey: deployerKey1, publicKey: deployerAccount1} =
            Local.testAccounts[0]);
        ({privateKey: deployerKey2, publicKey: deployerAccount2} =
            Local.testAccounts[1]);
        zkAppPrivateKey1 = PrivateKey.random();
        zkAppAddress1 = zkAppPrivateKey1.toPublicKey();
        zkApp1 = new ManufacturerOne(zkAppAddress1);

        zkAppPrivateKey2 = PrivateKey.random();
        zkAppAddress2 = zkAppPrivateKey2.toPublicKey();
        zkApp2 = new ManufacturerTwo(zkAppAddress2);
    });

    async function localDeploy() {
        const txn1 = await Mina.transaction(deployerAccount1, () => {
            AccountUpdate.fundNewAccount(deployerAccount1);
            zkApp1.deploy();
        });
        await txn1.prove();
        // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
        await txn1.sign([deployerKey1, zkAppPrivateKey1]).send();

        const txn2 = await Mina.transaction(deployerAccount2, () => {
            AccountUpdate.fundNewAccount(deployerAccount2);
            zkApp2.deploy();
        });
        await txn2.prove();
        // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
        await txn2.sign([deployerKey2, zkAppPrivateKey2]).send();
    }

    it('generates and deploys the manufacturer-one smart contract', async () => {
        await localDeploy();
        const manufacturerOnePublicKey = zkApp1.manufacturerPublicKey.get();
        expect(manufacturerOnePublicKey).toEqual(PublicKey.fromBase58(MANUFACTURER_ONE));

        const manufacturerTwoPublicKey = zkApp2.manufacturerPublicKey.get();
        expect(manufacturerTwoPublicKey).toEqual(PublicKey.fromBase58(MANUFACTURER_TWO));
    });

    describe('hardcoded values', () => {
        it('check the warranty is send, and verified', async () => {
            await localDeploy();
            // sender should be the deployer
            const txn = await Mina.transaction(deployerAccount1, () => {
                zkApp2.issueProduct(Field("3454356"));
            });
            await txn.prove();
            await txn.sign([deployerKey1]).send();


            //
            const events = await zkApp2.fetchEvents();
            const verifiedEventValue = events[0].event.data.toFields(null)[0];
            expect(verifiedEventValue).toEqual(Field("3454356"));
        });


    });


});