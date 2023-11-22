import { Trie } from "../src/trie";
import { TrieNode } from "../src/trie-node";
import { createRandomStringArray } from "../helpers/array";

describe("Trie", () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it("should create an instance of Trie", () => {
    expect(trie).toBeInstanceOf(Trie);
  });

  it("should have an root property that is false by default", () => {
    expect(trie.root).toBeInstanceOf(TrieNode);
  });

  it("should insert a word into the trie", () => {
    trie.insert("hello");
    expect(trie.search("hello")).toBe(true);
  });

  describe("search", () => {
    beforeEach(() => {
      trie.insert("hello");
    });

    it("should return true if the word is in the trie", () => {
      expect(trie.search("hello")).toBe(true);
    });

    it("should return false if the word is not in the trie", () => {
      expect(trie.search("world")).toBe(false);
    });
  });

  describe("startsWith", () => {
    beforeEach(() => {
      trie.insert("hello");
    });

    it("should return true if the prefix is in the trie", () => {
      expect(trie.startsWith("hel")).toBe(true);
    });

    it("should return false if the prefix is not in the trie", () => {
      expect(trie.startsWith("wor")).toBe(false);
    });
  });

  describe("create", () => {
    it("should create a new Trie instance and insert the given data into it", () => {
      const data = createRandomStringArray(100);

      const trie = Trie.create(data);

      data.forEach((word) => {
        expect(trie.search(word)).toBe(true);
      });
    });
  });

  describe("binary serialization and deserealization", () => {
    it("shold restore data from buffer", () => {
      const trie = new Trie();

      createRandomStringArray(100).forEach((word) => {
        trie.insert(word);
      });

      const serialized = trie.serialize();

      const deserialized = Trie.deserialize(serialized);

      expect(deserialized).toEqual(trie);
    });
  });
});
