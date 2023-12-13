import { LabelledTree } from "../../src/succinct/labelled-tree";
import { Louds } from "../../src/succinct/louds";
import { Trie } from "../../src/trie";
import { TrieNode } from "../../src/trie-node";

describe("LabelledTree", () => {
  const getTestTrieNode = () => {
    const root = new TrieNode();

    const child1 = new TrieNode();
    child1.isEndOfWord = true;

    const child2 = new TrieNode();
    child2.isEndOfWord = true;

    root.children.set("a", child1);
    root.children.set("b", child2);

    return root;
  };

  describe("create", () => {
    it("should create a LabelledTree from a TrieNode", () => {
      const root = getTestTrieNode();

      const tree = LabelledTree.create(root);


      expect(tree.louds.buffer).toEqual(new Louds([13, 3]).buffer)
      expect(tree.keys).toEqual(new Uint8Array([97, 98]))
      expect(tree.eow).toEqual(new Uint8Array([1, 1]))
    });
  });

  describe("getSerializedSize", () => {
    it("should return the serialized size of the LabelledTree", () => {
      const root = getTestTrieNode();

      const serializedSize = LabelledTree.getSerializedSize(root);

      expect(serializedSize).toEqual({
        loudsSize: 7,
        labels: 2,
      });
    });
  });

  describe("findChild", () => {
    const cases: [key: string, expected: number][] = [
      ["a", 2],
      ["b", 3],
      ["c", -1],
    ];

    const tree = LabelledTree.create(getTestTrieNode());

    it.each(cases)("should return the position of the child node with the given key", (key, expected) => {
      const childPos = tree.findChild(0, key);

      expect(childPos).toEqual(expected);
    });
  });

  describe("startsWith", () => {
    const testWord = "hello";

    const testTrie = Trie.create([testWord]);
    const testLabelledTree = LabelledTree.create(testTrie.root);

    it.each<[string, boolean]>([
      // insert h, he, hel, ...
      ...testWord.split("").map<[string, boolean]>((_, i) => [testWord.slice(0, i + 1), true]),

      // something that definitely isn't in the trie
      ["world", false],
    ])("should return '%s' if the trie contains the word '%s'", (prefix, expected) => {
      expect(testLabelledTree.startsWith(prefix)).toEqual(expected);
    });
  });

  describe("search", () => {
    const testWord = "hello";

    const testTrie = Trie.create([testWord]);
    const testLabelledTree = LabelledTree.create(testTrie.root);

    it.each<[string, boolean]>([
      [testWord, true],
      // insert h, he.
      ...testWord.split("", 2).map<[string, boolean]>((_, i) => [testWord.slice(0, i + 1), false]),
      // something that definitely isn't in the trie
      ["world", false],
    ])("should return '%s' if the trie contains the word '%s'", (word, expected) => {
      expect(testLabelledTree.search(word)).toEqual(expected);
    });
  });
});
