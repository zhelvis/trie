import { createRandomStringArray, getAverageValue } from "../helpers/array";
import { BinaryTrie } from "../src/binary-trie";
import { Trie } from "../src/trie";

const ROUNDS = 10;

const MIN_SIZE_EXPONENT = 2;
const MAX_SIZE_EXPONENT = 5;

const res: { [size: number]: {
  speed: number;
  mem: number;
  originalMem: number;
} } = {};

for (let i = MIN_SIZE_EXPONENT; i <= MAX_SIZE_EXPONENT; i++) {
  const size = 10 ** i;
  const data = createRandomStringArray(size);
  const trie = Trie.create(data);

  const measurements: number[] = [];

  for (let j = 0; j < ROUNDS; j++) {
    const start = performance.now();
    BinaryTrie.create(trie.root);
    measurements.push(performance.now() - start);
  }


  res[size] = {
    speed: getAverageValue(measurements),
    mem: BinaryTrie.create(trie.root).data.length,
    originalMem: data.join("").length
  };
}

console.table(res);
