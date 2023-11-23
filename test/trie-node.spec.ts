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
        // size of root
        0, 0, 0, 23,
        // root.isEndOfWord
        0,
        // "a"
        97,
        // size of child1
        0, 0, 0, 11,
        // child1.isEndOfWord
        0,
        // "b"
        98,
        // size of grandChild
        0, 0, 0, 5,
        // grandChild.isEndOfWord
        1,
        // "c"
        99,
        // size of child2
        0, 0, 0, 5,
        // child2.isEndOfWord
        1,
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
        expect(node.getSerializedSize()).toBe(view.byteLength);
      });
    });

    describe("serialize", () => {
      it("should return a Uint8Array with the correct serialized data", () => {
        const buffer = new ArrayBuffer(node.getSerializedSize());
        const uint8View = new Uint8Array(buffer);
        node.serialize(new StaticDataView(uint8View));
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
