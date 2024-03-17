import * as crypto from 'crypto';

interface Keypair {
    pk: crypto.KeyObject;
    sk: crypto.KeyObject;
}

interface Transaction {
    inputs: { txid: string, index: number, keyImage: Buffer }[];
    outputs: { address: Buffer, amount: number }[];
    signatures: Buffer[];
}

interface Block {
    transactions: Transaction[];
}

export class MoneroWallet {

    private readonly spendKeys: Keypair;
    private readonly viewKeys: Keypair;
    private readonly spentKeyImages: Set<string>; // Set to store spent key images

    public constructor(
        private readonly blockchain: Block[]
    ) {
        this.spendKeys = this.genKeyPair();
        this.viewKeys = this.genKeyPair();
        this.spentKeyImages = new Set();
    }

    public transfer(recipientAddress: Buffer, amount: number): Transaction {
        const tx: Transaction = {
            inputs: [],
            outputs: [{ address: recipientAddress, amount }],
            signatures: []
        };

        for (const block of this.blockchain) {
            for (const prevTx of block.transactions) {
                for (let i = 0; i < prevTx.outputs.length; i++) {
                    const keyImage = this.generateKeyImage(prevTx.inputs[0].txid, i);
                    tx.inputs.push({ txid: prevTx.inputs[0].txid, index: i, keyImage });
                }
            }
        }

        tx.signatures = this.signInputs(tx);
        this.markInputsAsSpent(tx.inputs);

        return tx;
    }

    public scan(): Transaction[] {
        const relevantTransactions: Transaction[] = [];

        for (const block of this.blockchain) {
            for (const tx of block.transactions) {
                for (const output of tx.outputs) {
                    if (this.isOutputForWallet(output)) {
                        const keyImage = this.generateKeyImage(tx.inputs[0].txid, tx.inputs[0].index);
                        if (!this.isOutputSpent(keyImage)) {
                            relevantTransactions.push(tx);
                        }
                        break;
                    }
                }
            }
        }

        return relevantTransactions;
    }

    private generateStealthAddress(): Buffer {
        const hash = crypto.createHash('sha256');
        hash.update(this.spendKeys.pk);
        hash.update(this.viewKeys.pk);
        return hash.digest();
    }

    private isOutputForWallet(output: { address: Buffer, amount: number }): boolean {
        const stealthAddress = this.generateStealthAddress();
        return Buffer.compare(output.address, stealthAddress) === 0;
    }

    private isOutputSpent(keyImage: Buffer): boolean {
        return this.spentKeyImages.has(keyImage.toString('hex')); // Check if key image exists in the set
    }

    private markOutputAsSpent(keyImage: Buffer) {
        this.spentKeyImages.add(keyImage.toString('hex')); // Add key image to the set of spent key images
    }

    private markInputsAsSpent(inputs: { txid: string, index: number, keyImage: Buffer }[]) {
        for (const input of inputs) {
            this.markOutputAsSpent(input.keyImage);
        }
    }

    private genKeyPair(): Keypair {
        const keys = crypto.generateKeyPairSync('ec', {
            namedCurve: 'secp256k1'
        });
        return {
            pk: keys.publicKey,
            sk: keys.privateKey
        };
    }

    private signInputs(tx: Transaction): Buffer[] {
        const signatures: Buffer[] = [];

        for (const input of tx.inputs) {
            const hash = crypto.createHash('sha256');
            hash.update(JSON.stringify(tx));
            const signature = crypto.sign(null, hash.digest(), this.spendKeys.sk);
            signatures.push(signature);
        }

        return signatures;
    }

    private generateKeyImage(txid: string, index: number): Buffer {
        const inputStr = txid + index;
        return crypto.createHash('sha256').update(inputStr).digest();
    }
}
