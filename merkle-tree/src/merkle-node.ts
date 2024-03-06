import { CryptoHasher } from "bun";

export class MerkleNode {
    private _hash: string;

    private _parent: MerkleNode | null;
    private _left: MerkleNode | null;
    private _right: MerkleNode | null;
    private _isLeaf: boolean;
    private _isRoot: boolean;

    public constructor() {
        this._isLeaf = true;
        this._isRoot = true;
        this._parent = null;
        this._left = null;
        this._right = null;
        this._hash = "";
    }

    public updateHash() {
        this.setHash = this.calculateHash();
    }

    private calculateHash(): string {
        return CryptoHasher
            .hash("sha256", this.left!.hash + this.right!.hash)
            .toString();
    }

    public get isLeaf(): boolean {
        return this._isLeaf;
    }

    public get isRoot(): boolean {
        return this._isRoot;
    }

    public get hash(): string {
        return this._hash;
    }

    public set setHash(h: string) {
        this._hash = h;
    }

    public get parent(): MerkleNode | null {
        return this._parent;
    }

    public set setParent(node: MerkleNode | null) {
        if(!!node) {
            this._isRoot = false;
        }
        
        this._parent = node;
    }

    public get left(): MerkleNode | null {
        return this._left;
    }

    public set setLeft(node: MerkleNode | null) {
        if (!!node) {
            this._isLeaf = false;
        }

        this._left = node;
    }

    public get right(): MerkleNode | null {
        return this._right;
    }

    public set setRight(node: MerkleNode | null) {
        if (!!node) {
            this._isLeaf = false;
        }

        this._right = node;
    }
}
