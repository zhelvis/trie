import { createRandomStringArray, getAverageValue, getRandomElement } from "../helpers/array";
import { getRandomString } from "../helpers/string";
import { Trie } from "../src/trie";
import { LabelledTree } from "../src/succinct/labelled-tree";

const ROUNDS = 10_000;

const MIN_SIZE_EXPONENT = 2;
const MAX_SIZE_EXPONENT = 5;

const res: { [structure: string]: { [size: number]: number } } = {};

for (let i = MIN_SIZE_EXPONENT; i <= MAX_SIZE_EXPONENT; i++) {
  const size = 10 ** i;
  const data = createRandomStringArray(size);
  const trie = Trie.create(data);
  const labelledTree = LabelledTree.create(trie.root);

  const trieMeasurements: number[] = [];
  const labelledTreeMeasurements: number[] = [];

  for (let j = 0; j < ROUNDS; j++) {
    const word = j % 2 ? getRandomElement(data) : getRandomString();

    let start = performance.now();
    trie.search(word);
    trieMeasurements.push(performance.now() - start);


    start = performance.now();
    labelledTree.search(word);
    labelledTreeMeasurements.push(performance.now() - start);
  }

  res.trie = {};
  res["labelled tree"] = {};
  res.trie[size] = getAverageValue(trieMeasurements);
  res["labelled tree"][size] = getAverageValue(labelledTreeMeasurements);
}

console.table(res);
