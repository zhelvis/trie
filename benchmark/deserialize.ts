import { createRandomStringArray, getAverageValue } from "../helpers/array";
import { BinaryTrie } from "../src/binary-trie";
import { Trie } from "../src/trie";

const ROUNDS = 10000;

const MIN_SIZE_EXPONENT = 2;
const MAX_SIZE_EXPONENT = 5;

const res: { [size: number]: number } = {};

for (let i = MIN_SIZE_EXPONENT; i <= MAX_SIZE_EXPONENT; i++) {
  const size = 10 ** i;
  const data = createRandomStringArray(size);
  const trie = Trie.create(data);
  const binaryTrie = BinaryTrie.create(trie.root);

  const measurements: number[] = [];

  for (let j = 0; j < ROUNDS; j++) {
    const start = performance.now();
    new BinaryTrie(binaryTrie.data);
    measurements.push(performance.now() - start);
  }

  res[size] = getAverageValue(measurements);
}

console.table(res);
