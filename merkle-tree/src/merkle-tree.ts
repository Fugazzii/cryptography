import { MerkleNode } from "./merkle-node";

export class MerkleTree {
    
    private readonly root: MerkleNode;
    private readonly leaves: MerkleNode[];

    public constructor(height: number) {
        this.leaves = [];
        this.root = this.build(height) as MerkleNode;
    }

    public add(hash: string) {
        for(let leave of this.leaves) {
            if(!leave.hash) {
                leave.setHash = hash;
                this.updateHashes(leave.parent!);
                break;
            }
        }
        return this;
    }

    private build(h: number, parent: MerkleNode | null = null): MerkleNode | null {
        if(h < 0) {
            return null;
        }
        
        const node = new MerkleNode();

        node.setParent = parent;
        node.setLeft = this.build(h - 1, node);
        node.setRight = this.build(h - 1, node);
        
        if(node.isLeaf) {
            this.leaves.push(node);
        }
        
        return node;
    }

    private updateHashes(node: MerkleNode) {
        if(node.isRoot) {
            return;
        }

        node.updateHash();
        this.updateHashes(node.parent!);
    }

    public traverse(node: MerkleNode = this.root) {
        console.log(node.hash);
        
        if(!node.left || !node.right) {
            return;            
        }

        this.traverse(node.left);
        this.traverse(node.right);
    }
}