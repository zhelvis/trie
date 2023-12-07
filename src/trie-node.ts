/**
 * Represents a node in a Trie data structure.
 */
export class TrieNode {
  /**
   * A map of child nodes, where the keys are the characters of the words and the values are the corresponding child nodes.
   */
  public children = new Map<string, TrieNode>();

  /**
   * Indicates whether this trie node represents the end of a word.
   */
  public isEndOfWord = false;
}