import { DataFrame } from "danfojs-node";
import { createRandomStringArray, getRandomElement } from "../helpers/array";
import { getRandomString } from "../helpers/string";
import { BinaryTrie } from "../src/binary-trie";
import { LabelledTree } from "../src/succinct/labelled-tree";
import { Trie } from "../src/trie";

const ROUNDS = 10_000;

const MIN_SIZE_EXPONENT = 2;
const MAX_SIZE_EXPONENT = 5;

for (let i = MIN_SIZE_EXPONENT; i <= MAX_SIZE_EXPONENT; i++) {
  const size = 10 ** i;
  console.log(`Running benchmark for ${size} words...`);
  const data = createRandomStringArray(size);
  const trie = Trie.create(data);
  const binaryTrie = BinaryTrie.create(trie.root);
  const labelledTree = LabelledTree.create(trie.root);

  const trieMeasurements: number[] = [];
  const binaryTrieMeasurements: number[] = [];
  const labelledTreeMeasurements: number[] = [];

  for (let j = 0; j < ROUNDS; j++) {
    const word = j % 2 ? getRandomElement(data) : getRandomString();

    let start = performance.now();
    labelledTree.search(word);
    labelledTreeMeasurements.push(Number((performance.now() - start).toFixed(6)));

    start = performance.now();
    binaryTrie.search(word);
    binaryTrieMeasurements.push(Number((performance.now() - start).toFixed(6)));

    start = performance.now();
    trie.search(word);
    trieMeasurements.push(Number((performance.now() - start).toFixed(6)));
  }

  const df = new DataFrame({
    "trie": trieMeasurements,
    "binary trie": binaryTrieMeasurements, 
    "labelled tree": labelledTreeMeasurements,
  });

  df.describe().print();
}
