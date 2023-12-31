import { createRandomStringArray, getAverageValue, getRandomElement } from "../helpers/array";
import { getRandomNumber } from "../helpers/number";
import { BinaryTrie } from "../src/binary-trie";
import { LabelledTree } from "../src/succinct/labelled-tree";
import { Trie } from "../src/trie";

const ROUNDS = 10_000;

const MIN_SIZE_EXPONENT = 2;
const MAX_SIZE_EXPONENT = 5;

function getKnownPrefix(data: string[]) {
  const word = getRandomElement(data);
  return word.substring(0, getRandomNumber(word.length));
}

const res: { [size: number]: { [structure: string]: number } } = {};

for (let i = MIN_SIZE_EXPONENT; i <= MAX_SIZE_EXPONENT; i++) {
  const size = 10 ** i;
  const data = createRandomStringArray(size);
  const trie = Trie.create(data);
  const binaryTrie = BinaryTrie.create(trie.root);
  const labelledTree = LabelledTree.create(trie.root);

  const trieMeasurements: number[] = [];
  const binaryTrieMeasurements: number[] = [];
  const labelledTreeMeasurements: number[] = [];

  for (let j = 0; j < ROUNDS; j++) {
    const prefix = getKnownPrefix(data);

    let start = performance.now();
    labelledTree.startsWith(prefix);
    labelledTreeMeasurements.push(performance.now() - start);

    start = performance.now();
    trie.startsWith(prefix);
    trieMeasurements.push(performance.now() - start);

    start = performance.now();
    binaryTrie.startsWith(prefix);
    binaryTrieMeasurements.push(performance.now() - start);
  }

  res[size] = {
    trie: getAverageValue(trieMeasurements),
    "binary trie": getAverageValue(binaryTrieMeasurements),
    "labelled tree": getAverageValue(labelledTreeMeasurements),
  };
}

console.table(res);
