import { getAverageValue } from "../helpers/array";
import { getRandomString } from "../helpers/string";
import { Trie } from "../src/trie";

const ROUNDS = 10_000;

const trie = new Trie();

const result: number[] = [];

for (let i = 0; i < ROUNDS; i++) {
  const word = getRandomString();

  const start = performance.now();
  trie.search(word);
  result.push(performance.now() - start);
}

console.log(getAverageValue(result), "ms");
