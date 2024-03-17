export class Pedersen {
    public generateProveCommitment(message: bigint, r: bigint, p: bigint, g: bigint, h: bigint): bigint {
        return (BigInt(g) ** BigInt(message) * BigInt(h) ** BigInt(r)) % BigInt(p);
    }

    // Verify a Pedersen commitment
    public generateVerifyCommitment(commitment: bigint, message: bigint, r: bigint, p: bigint, g: bigint, h: bigint): boolean {
        const leftSide = BigInt(g) ** BigInt(message) * BigInt(h) ** BigInt(r) % BigInt(p);
        return commitment === leftSide;
    }
}

// const pedersen = new Pedersen();
// const p = 23n;
// const g = 5n;
// const h = 7n;
// const message = 10n;
// const r = 6n;

// const commitment = pedersen.generateProveCommitment(message, r, p, g, h);
// console.log("Commitment:", commitment);

// const isVerified = pedersen.generateVerifyCommitment(commitment, message, r, p, g, h);
// console.log("Commitment is verified:", isVerified);
