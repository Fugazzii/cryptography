export type Element = string | number;

export type HashFunction<T> = {
    (left: T, right: T): string;
}

export type MerkleTreeOptions = {
    hashFunction: HashFunction<Element>;
    zeroElement: Element;
}

export type SerializedTreeState = {
    levels: number;
    _zeroes: Element[];
    _layers: Element[][];
}

export type SerializedPartialTreeState = {
    levels: number;
    _layers: Element[][];
    _zeroes: Element[];
    _edgeLeafProof: ProofPath;
    _edgeLeaf: LeafWithIndex;
}

export type ProofPath = {
    pathElements: Element[];
    pathIndices: number[];
    pathPositions: number[];
    pathRoot: Element;
}

export type TreeEdge = {
    edgeElement: Element;
    edgePath: ProofPath;
    edgeIndex: number;
    edgeElementsCount: number;
}

export type TreeSlice = {
    edge: TreeEdge;
    elements: Element[];
}

export type LeafWithIndex = {
    index: number;
    data: Element;
}