import { Queue } from "../queue";
import { TrieNode } from "../trie-node";
import { Louds } from "./louds";

export class LabelledTree {
  /**
   * A label offset. We use 2 because we ignore the fake root node which has no label and index is 1-based.
   */
  public static readonly labelOffset = 2;

  /**
   *
   * @param louds Level Order Unary Degree Sequence (LOUDS).
   * @param keys Keys for each node, except the fake root node.
   * @param eow "End Of Word" flag for each node, except the fake root node.
   */
  constructor(
    public louds: Louds,
    public keys: Uint8Array,
    public eow: Uint8Array,
  ) {}

  public findChild(position: number, key: string): number {
    let childPos = this.louds.firstChild(position);
    let index: number;

    while (this.louds.isNode(childPos)) {
      index = this.louds.getNodeIndex(childPos);
      const childKey = String.fromCharCode(this.keys[index - LabelledTree.labelOffset]);
      if (childKey === key) {
        return childPos;
      }
      // Shift to right sibling (1 byte)
      childPos += 1;
    }

    return -1;
  }

  public static create(root: TrieNode): LabelledTree {
    const { loudsSize, labels } = LabelledTree.getSerializedSize(root);

    const louds = Louds.create(loudsSize);

    const keys = new Uint8Array(labels);
    const eow = new Uint8Array(labels);

    let loudsCursor = 0;
    let labelsCursor = 0;

    louds.setBit(loudsCursor++);
    loudsCursor++;

    const queue = new Queue<TrieNode>();
    queue.push(root);

    const serializeNode = (node: TrieNode, key: string): void => {
      louds.setBit(loudsCursor++);
      keys[labelsCursor] = key.charCodeAt(0);
      eow[labelsCursor] = Number(node.isEndOfWord);
      labelsCursor += 1;
      queue.push(node);
    };

    while (queue.length > 0) {
      const node = queue.shift()!;
      node.children.forEach(serializeNode);
      loudsCursor++;
    }

    louds.countBucketRanks();
    return new LabelledTree(louds, keys, eow);
  }

  public static getSerializedSize(root: TrieNode): {
    loudsSize: number;
    labels: number;
  } {
    let loudsSize = 3; // 2 for fake node + 1 for root
    let labels = 0; // label counter

    const getSize = (node: TrieNode) => {
      loudsSize += 2; // 2 bit for node
      labels += 1;
      node.children.forEach(getSize);
    };

    root.children.forEach(getSize);

    return {
      loudsSize,
      labels,
    };
  }

  /**
   * Returns true if the labelled tree contains a word that starts with the given prefix.
   * @param prefix - The prefix to search for.
   * @returns True if the labelled tree contains a word that starts with the given prefix, false otherwise.
   */
  public startsWith(prefix: string): boolean {
    let position = 0;
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      const node = this.findChild(position, char);
      if (node === -1) {
        return false;
      }
      position = node;
    }
    return true;
  }

  /**
   * Searches for a word in the labelled trie.
   * @param word - The word to search for.
   * @returns True if the word is found, false otherwise.
   */
  public search(word: string): boolean {
    let position = 0;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const node = this.findChild(position, char);
      if (node === -1) {
        return false;
      }
      position = node;
    }

    const index = this.louds.getNodeIndex(position);

    return Boolean(this.eow[index - LabelledTree.labelOffset]);
  }
}
