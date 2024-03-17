/**
 * Introduction
    Tornado.Cash implements an Ethereum zero-knowledge privacy solution: 
        a smart contract that accepts transactions in Ether 
        so that the amount can be later withdrawn with
        no reference to the original transaction
 * Protocol Description
    Deposit money to the smart contract.
    Withdraw money from smart contract with 2 ways:
    1. The N ETH is withdrawn through Relayer with f ETH
        sent to t as a fee. The value f and t is chosen by sender.
        If this withdraw is initiated by the Relayer, it pays Gas fee
        that is supposed to be covered by f
    2. The N ETH is withdrawn to the recipient. The tx is inited
        by the recipient. The recipient should have enough ETH to
        pay Gas fee for the tx. In that case f is considered to be
        equal to 0.
 * Setup
    Let B = {0, 1}
    Let e [pairing operation]
    Let q [prime field]

    Let H1 : B* -> Zp [Ped]
    Let H2 : (Zp, Zp) -> Zp [MiMC hash function - ARG+16]
    Let T [
        Merkle Tree of height 20
        Each non-leaf nodes hashes its 2 children with H2
        All leaves are 0 by default
        Later these values are replaced by other values from Zp
    ]
    Let O(T, l) [
        Merkle opening for leaf with index l
    ]
    Let k [nullified]
    Let r [randomness]
    Let A [address of the recipient]
    Let t [Relayer address]
    Let f [fee]
    Let S [
        Statement with public values: R,h,A,f,t
        I KNOW k, r, l, O
        SUCH THAT h = H1(k)
        O is opening of H2(k||r) as position l to R
    ]
    Let D = (dp, dv) [
        ZK-SNARK, Gro16, proving/verifying keypair,
        Generated using some trusted setup procedure
    ]
    Let Prove : (dp, T, k, r, l, A, f, t) -> P
    Let Verify: (dv, P, R, h, A, f, t)
    Let C [
        smart contract
        Stores last n = 100 root values in the history array
        Accepts payments for N ETH with data C
        C is added to Merkle Tree
        Verifies the alleged proof P
            If success -> (N - f) ETH to A and f to t
        Verifies that the coin has not been withdrawn before
            by checking that the nullifier hash from the proof
            has not appeared before and if so, adds it to
            the list of nullifier hashes
    ]
 * Deposit
    To deposit a coin, you need to:
    - Generate 2 random numbers: k, r and compute C = H1(k||r)
    - Send Ethereum to tx with N ETH to Smart Contract with data C.
        If the tree is not full, the contract accepts the tx and adds
        C as a non-zero leaf.
 * Withdrawal
    To withdraw a coin (k, r) on position l, you need to do following:
    - Select a recipient A and f (f <= N)
    - Select a Root R
    - Compute nullifier hash h = H1(k)
    - Compute proof P by calling Prove on dp
    - Perform the withdrawal (2 ways):
        - Send a tx to contract C supplying (R, h, A, f, t, P)
        - Send a request to Relayer supplying (R, h, A, f, t, P)
 * Implementation
    - The cryptographic functions for off-chain operations are implemented
        with circomlib library
    - The Solidity implementation of Merkle tree, deposit/withdraw
        logic are implemented by authors
    - The Solidity implementation of MiMC is by iden3
    - The SNARK keypair and the Solidity verifier code are generated
        by the authors using SNARKJS
 * Security claims
        - Only coins deposited into the contract can be withdrawn
        - No coin be withdrawn twice
        - Any coin can be withdrawn once if its parameters (k,r)
            are known, unless a coin with the same k has been already
            deposited or withdrawn
        - If k or r is unknown, a coin can not be withdrawn.
        - Nobody can use the same proof with a different nullifier hash,
            another recipient address or a new fee amount
*/


const crypto = require("node:crypto");

// Fake implementation
class MerkleTree {
    add() {}
    get() {}
    verify() {}
}

class Mixer {
    constructor() {
        this.merkleTree = new MerkleTree();
    }

    deposit(commitmentHash) {
        this.merkleTree.add(commitmentHash);
    }

    withdraw(zkProof, address) {
        const isValidProof = this.merkleTree.verify(zkProof);

        if(!isValidProof) {
            throw new Error();
        }

        const amount = 0; //...
        const commitmentHash = ""; // ...
        this.transfer(amount, address);
        this.merkleTree.remove(commitmentHash);
    }
}