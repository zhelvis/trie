import { StaticDataView } from "../src/data-view";
import { TrieNode } from "../src/trie-node";

describe("TrieNode", () => {
  let trieNode: TrieNode;

  beforeEach(() => {
    trieNode = new TrieNode();
  });

  it("should create an instance of TrieNode", () => {
    expect(trieNode).toBeInstanceOf(TrieNode);
  });

  it("should have a children property that is a Map", () => {
    expect(trieNode.children).toBeInstanceOf(Map);
  });

  it("should have an isEndOfWord property that is false by default", () => {
    expect(trieNode.isEndOfWord).toBe(false);
  });

  describe("binary serialization and deserealization", () => {
    function createTrieNode(): TrieNode {
      const root = new TrieNode();

      const child1 = new TrieNode();
      child1.isEndOfWord = false;
      root.children.set("a", child1);

      const grandChild = new TrieNode();
      grandChild.isEndOfWord = true;
      child1.children.set("b", grandChild);

      const child2 = new TrieNode();
      child2.isEndOfWord = true;
      root.children.set("c", child2);

      return root;
    }

    function createTrieDataView(): Uint8Array {
      return new Uint8Array([
        // size
        0, 0, 0, 9,
        // labels
        0, 0, 0, 3,
        // louds
        1, 0, 1, 1, 
        0, 1, 0, 0,
        0,
        // keys
        97, 99, 98,
        // eow
        0, 1, 1
      ]);
    }

    let view: Uint8Array;
    let node: TrieNode;

    beforeEach(() => {
      view = createTrieDataView();
      node = createTrieNode();
    });

    describe("getSerializedSize", () => {
      it("should return the correct serialized size", () => {
        expect(TrieNode.getSerializedSize(node)).toEqual({
          labels: 3, 
          metadata: 8, 
          size: 9
        });
      });
    });

    describe("serialize", () => {
      it("should return a Uint8Array with the correct serialized data", () => {
        const { size, labels, metadata } = TrieNode.getSerializedSize(node);
        const buffer = new ArrayBuffer(size + metadata + labels * 2);
        const uint8View = new Uint8Array(buffer);
        TrieNode.serialize(new StaticDataView(uint8View), node, size, labels);
        expect(uint8View).toEqual(view);
      });
    });

    describe("deserialize", () => {
      it("should return a TrieNode instance with the correct deserialized data", () => {
        const uint8View = new Uint8Array(view.buffer);
        const deserializedNode = TrieNode.deserialize(new StaticDataView(uint8View));
        expect(deserializedNode).toBeInstanceOf(TrieNode);
        expect(deserializedNode).toEqual(node);
      });
    });
  });
});
