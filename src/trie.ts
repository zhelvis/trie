import { TrieNode } from "./trie-node";

/**
 * Represents a Trie data structure.
 *
 * A Trie, also known as a prefix tree, is a tree-like data structure that is used to store a collection of strings.
 * Each {@link TrieNode} of the Trie represents a single character of a string andthe string is formed by tracing
 * a path from the root to any leaf node. Tries are particularly useful for searching for words in dictionaries,
 * providing auto-suggestionsin search engines.
 *
 * @see https://en.wikipedia.org/wiki/Trie
 * @see https://www.geeksforgeeks.org/trie-insert-and-search/
 */
export class Trie {
  /**
   * The root node of the trie.
   */
  public root = new TrieNode();

  /**
   * Inserts a word into the trie.
   * @param word - The word to be inserted.
   */
  public insert(word: string): void {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      let node = current.children.get(char);
      if (!node) {
        node = new TrieNode();
        current.children.set(char, node);
      }
      current = node;
    }
    current.isEndOfWord = true;
  }

  /**
   * Searches for a word in the trie.
   * @param word - The word to search for.
   * @returns True if the word is found, false otherwise.
   */
  public search(word: string): boolean {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const node = current.children.get(char);
      if (!node) {
        return false;
      }
      current = node;
    }
    return current.isEndOfWord;
  }

  /**
   * Returns true if the trie contains a word that starts with the given prefix.
   * @param prefix - The prefix to search for.
   * @returns True if the trie contains a word that starts with the given prefix, false otherwise.
   */
  public startsWith(prefix: string): boolean {
    let current = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      const node = current.children.get(char);
      if (!node) {
        return false;
      }
      current = node;
    }
    return true;
  }

  /**
   * Serializes the trie into an ArrayBuffer.
   *
   * @returns The serialized trie as an ArrayBuffer.
   */
  public serialize(): ArrayBuffer {
    const byteLenght = this.root.getSerializedSize();
    const buffer = new ArrayBuffer(byteLenght);
    this.root.serialize(buffer);
    return buffer;
  }

  /**
   * Deserialize a Trie from an ArrayBuffer.
   *
   * @param arrayBuffer - The ArrayBuffer containing the serialized Trie.
   * @returns The deserialized Trie.
   */
  public static deserialize(arrayBuffer: ArrayBuffer): Trie {
    const trie = new Trie();
    trie.root = TrieNode.deserialize(arrayBuffer);
    return trie;
  }
}
