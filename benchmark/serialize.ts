import { createRandomStringArray, getAverageValue } from "../helpers/array";
import { BinaryTrie } from "../src/binary-trie";
import { LabelledTree } from "../src/succinct/labelled-tree";
import { Trie } from "../src/trie";

const ROUNDS = 10;

const MIN_SIZE_EXPONENT = 2;
const MAX_SIZE_EXPONENT = 5;

const res: {
  [size: number]: {
    originalMem: number,
    binaryTrieMem: number;
    binaryTrieSpeed: number;
    labelledTreeMem: number;
    labelledTreeSpeed: number;
  };
} = {};

for (let i = MIN_SIZE_EXPONENT; i <= MAX_SIZE_EXPONENT; i++) {
  const size = 10 ** i;
  const data = createRandomStringArray(size);
  const trie = Trie.create(data);

  const binaryTrieMeasurements: number[] = [];
  const labelledTreeMeasurements: number[] = [];

  for (let j = 0; j < ROUNDS; j++) {
    let start = performance.now();
    BinaryTrie.create(trie.root);
    binaryTrieMeasurements.push(performance.now() - start);

    start = performance.now();
    LabelledTree.create(trie.root);
    labelledTreeMeasurements.push(performance.now() - start);
  }

  const lTrie = LabelledTree.create(trie.root);

  res[size] = {
    originalMem: Number((data.join('').length / 1024).toFixed(2)),
    binaryTrieMem: Number((BinaryTrie.create(trie.root).data.length / 1024).toFixed(2)),
    binaryTrieSpeed: getAverageValue(binaryTrieMeasurements),
    labelledTreeMem: Number(((lTrie.louds.byteLength + lTrie.keys.byteLength +lTrie.eow.byteLength) / 1024).toFixed(2)),  
    labelledTreeSpeed: getAverageValue(labelledTreeMeasurements),
  
  };
}


console.table(res);
