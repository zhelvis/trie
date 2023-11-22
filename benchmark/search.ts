import { createRandomStringArray, getAverageValue, getRandomElement } from "../helpers/array";
import { getRandomString } from "../helpers/string";
import { Trie } from "../src/trie";

const ROUNDS = 10_000;

const MIN_SIZE_EXPONENT = 2;
const MAX_SIZE_EXPONENT = 5;

const res: { [size: number]: number } = {};

for (let i = MIN_SIZE_EXPONENT; i <= MAX_SIZE_EXPONENT; i++) {
  const size = 10 ** i;
  const data = createRandomStringArray(size);
  const trie = Trie.create(data);

  const mesurements: number[] = [];

  for (let j = 0; j < ROUNDS; j++) {
    const word = j % 2 ? getRandomElement(data) : getRandomString();

    const start = performance.now();
    trie.search(word);
    mesurements.push(performance.now() - start);
  }

  res[size] = getAverageValue(mesurements);
}

console.table(res);
