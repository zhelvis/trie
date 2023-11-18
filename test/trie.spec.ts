import { Trie } from "../src/trie";
import { TrieNode } from "../src/trie-node";

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

  describe("binary serialization and deserealization", () => {
    it("shold restore data from buffer", () => {
      const trie = new Trie();

      for (let i = 0; i < 100; i++) {
        trie.insert((Math.random() + 1).toString(36).substring(7));
      }

      const serialized = trie.serialize();

      const deserialized = Trie.deserialize(serialized);

      console.log(trie);

      expect(deserialized).toEqual(trie);
    });
  });
});
