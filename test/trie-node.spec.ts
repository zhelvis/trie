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
});
