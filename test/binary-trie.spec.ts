import { createRandomStringArray } from "../helpers/array";
import { BinaryTrie } from "../src/binary-trie";
import { Trie } from "../src/trie";

describe("BinaryTrie", () => {
  function createTrie(): Trie {
    return Trie.create(["hello", "hey", "world"]);
  }

  describe("instance methods", () => {
    let binaryTrie: BinaryTrie;

    beforeEach(() => {
      const trie = createTrie();
      binaryTrie = BinaryTrie.create(trie.root);
    });
    describe("startsWith", () => {
      const testWord = "hello";
      it.each<[boolean, string]>([
        // insert h, he, hel, ...
        ...testWord.split("").map<[boolean, string]>((_, i) => [true, testWord.slice(0, i + 1)]),
        // something that definitely isn't in the trie
        [false, "another"],
      ])("should return '%s' for prefix '%s'", (expected, prefix) => {
        expect(binaryTrie.startsWith(prefix)).toEqual(expected);
      });
    });

    describe("search", () => {
      it.each<[boolean, string]>([
        [true, "hello"],
        [true, "hey"],
        [false, "he"],
        [true, "world"],
        [false, "another"],
      ])("should return '%s' for word '%s'", (expected, prefix) => {
        expect(binaryTrie.search(prefix)).toEqual(expected);
      });
    });
  });

  describe("create", () => {
    it("should create a new Trie instance and insert the given data into it", () => {
      const data = createRandomStringArray(1000);

      const trie = Trie.create(data);
      const binaryTrie = BinaryTrie.create(trie.root);

      data.forEach((word) => {
        expect(binaryTrie.search(word)).toBe(true);
      });
    });
  });
});
