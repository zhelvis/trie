import type { TrieNode } from "./trie-node";

/**
 * Binary representation of a trie data structure.
 *
 * |   eow   | children | child key | child position |
 * |  uint8  |   uint8  |   uint8   |     uint32     |
 */
export class BinaryTrie {
  public declare readonly data: Uint8Array;

  constructor(data: Uint8Array) {
    this.data = data;
  }

  public startsWith(prefix: string): boolean {
    let position = 0;
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      position = this.findChild(char, position);
      if (position === -1) {
        return false;
      }
    }
    return true;
  }

  public search(word: string): boolean {
    let position = 0;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      position = this.findChild(char, position);
      if (position === -1) {
        return false;
      }
    }
    return this.data[position] === 1;
  }

  private findChild(key: string, position: number): number {
    const children = this.data[position + 1];
    let cursor = position + 2;

    for (let i = 0; i < children; i++) {
      const childKey = String.fromCharCode(this.data[cursor]);
      if (childKey === key) {
        return (
          (((this.data[cursor + 1] << 24) >>> 0) +
            ((this.data[cursor + 2] << 16) | (this.data[cursor + 3] << 8) | this.data[cursor + 4])) >>>
          0
        );
      }
      cursor += 5;
    }

    return -1;
  }

  public static create(root: TrieNode): BinaryTrie {
    const byteSize = BinaryTrie.getByteSize(root);
    const view = new Uint8Array(byteSize);

    let offset = 0;

    const createNode = (node: TrieNode): void => {
      let cursor = offset + BinaryTrie.getNodeByteSize(node);

      view[offset++] = Number(node.isEndOfWord);
      view[offset++] = node.children.size;

      if (node.children.size === 0) {
        return;
      }

      const createNodeEntry = (node: TrieNode, key: string): void => {
        view[offset++] = key.charCodeAt(0);
        view[offset++] = cursor >>> 24;
        view[offset++] = cursor >>> 16;
        view[offset++] = cursor >>> 8;
        view[offset++] = cursor;
        cursor += BinaryTrie.getByteSize(node);
      };

      node.children.forEach(createNodeEntry);
      node.children.forEach(createNode);
    };

    createNode(root);

    return new BinaryTrie(new Uint8Array(view.buffer));
  }

  private static getByteSize(root: TrieNode): number {
    let estimated = BinaryTrie.getNodeByteSize(root);

    const getNodeSize = (node: TrieNode): void => {
      estimated += BinaryTrie.getByteSize(node);
    };

    root.children.forEach(getNodeSize);

    return estimated;
  }

  private static getNodeByteSize(node: TrieNode): number {
    return 2 + node.children.size * 5;
  }
}
