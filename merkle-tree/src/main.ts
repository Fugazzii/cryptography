import { MerkleTree } from "./merkle-tree";

const tree = new MerkleTree(3);

tree.add("abc")
    .add("abc")
    .add("abc")
    .add("abc")
    .add("abc")
    .add("abc")
    .add("abc")
    .add("abc")
    .traverse();