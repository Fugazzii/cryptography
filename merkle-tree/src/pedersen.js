const crypto = require("crypto");

class Pedersen {
    constructor(g, p) {
        this.G = BigInt(g); // Generator
        this.P = BigInt(p); // Modulus
    }

    // Compute Pedersen commitment
    commit(value, blindingFactor) {
        const note = BigInt(value).toString();
        const hasher = crypto.createHash("sha256");
        hasher.update(note);
        const hashedNote = BigInt("0x" + hasher.digest("hex"));

        const commitment = (this.G ** BigInt(blindingFactor) * hashedNote) % this.P;
        return commitment;
    }

    // Verify Pedersen commitment
    verify(commitment, value, blindingFactor) {
        const note = BigInt(value).toString();
        const hasher = crypto.createHash("sha256");
        hasher.update(note);
        const hashedNote = BigInt("0x" + hasher.digest("hex"));

        const revealed = (commitment * (hashedNote ** (this.P - 2n))) % this.P;
        return revealed === (this.G ** BigInt(blindingFactor) % this.P);
    }
}

// // Initialize Pedersen commitment with generator and modulus
// const pedersen = new Pedersen(5, 23);

// // Simulate a deposit transaction
// const depositAmount = 10;
// const depositBlindingFactor = 15;
// const depositCommitment = pedersen.commit(depositAmount, depositBlindingFactor);
// console.log("Deposit commitment:", depositCommitment);

// // Simulate a withdrawal transaction
// const withdrawAmount = 5;
// const withdrawBlindingFactor = 20;
// const withdrawCommitment = pedersen.commit(withdrawAmount, withdrawBlindingFactor);
// console.log("Withdrawal commitment:", withdrawCommitment);

// // Verify deposit and withdrawal commitments
// const isDepositValid = pedersen.verify(depositCommitment, depositAmount, depositBlindingFactor);
// const isWithdrawValid = pedersen.verify(withdrawCommitment, withdrawAmount, withdrawBlindingFactor);

// console.log("Is deposit commitment valid?", isDepositValid);
// console.log("Is withdrawal commitment valid?", isWithdrawValid);

// // Attempt to verify withdrawal commitment with an incorrect blinding factor
// const incorrectBlindingFactor = 25;
// const isWithdrawValidWithIncorrectBF = pedersen.verify(withdrawCommitment, withdrawAmount, incorrectBlindingFactor);
// console.log("Is withdrawal commitment valid with incorrect blinding factor?", isWithdrawValidWithIncorrectBF);





class TornadoCash {
    constructor() {
        this.deposits = new Map(); // Map to store deposited amounts
        this.pedersen = new Pedersen(5, 23); // Initialize Pedersen commitment scheme
    }

    // Deposit funds into Tornado Cash
    deposit(amount, blindingFactor) {
        const depositCommitment = this.pedersen.commit(amount, blindingFactor);
        this.deposits.set(depositCommitment, amount);
        return depositCommitment;
    }

    // Withdraw funds from Tornado Cash
    withdraw(amount, blindingFactor) {
        // Find a suitable deposit commitment to withdraw from
        let foundDeposit = false;
        let withdrawalCommitment;
        for (const [commitment, depositAmount] of this.deposits) {
            if (depositAmount >= amount) {
                foundDeposit = true;
                withdrawalCommitment = commitment;
                break;
            }
        }

        if (!foundDeposit) {
            throw new Error("No suitable deposit found for withdrawal.");
        }

        this.deposits.delete(withdrawalCommitment); // Remove deposit after withdrawal
        return withdrawalCommitment;
    }
}

// Initialize Tornado Cash instance
const tornadoCash = new TornadoCash();

// Simulate deposit and withdrawal process
const depositAmount = 10;
const depositBlindingFactor = 15;
const depositCommitment = tornadoCash.deposit(depositAmount, depositBlindingFactor);
console.log("Deposit commitment:", depositCommitment);

const withdrawalAmount = 5; // Withdrawal amount cannot exceed deposited amount
const withdrawalBlindingFactor = 20;
const withdrawalCommitment = tornadoCash.withdraw(withdrawalAmount, withdrawalBlindingFactor);
console.log("Withdrawal commitment:", withdrawalCommitment);