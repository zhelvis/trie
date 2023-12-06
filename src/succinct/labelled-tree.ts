import { Queue } from "../queue";
import { TrieNode } from "../trie-node";
import { Louds } from "./louds";

export class LabelledTree {
  /**
   * A label offset. We use 2 because we ignore the fake root node which has no label and index is 1-based.
   */
  public static readonly labelOffset = 2;

  /**
   * Level Order Unary Degree Sequence (LOUDS).
   *
   * @see https://memoria-framework.dev/docs/data-zoo/louds-tree/
   */
  private louds: Louds;

  /**
   * Keys for each node, except the fake root node.
   */
  private keys: Uint8Array;

  /**
   * "End Of Word" flag for each node, except the fake root node.
   */
  private eow: Uint8Array;

  constructor(loudsView: Uint8Array, keysView: Uint8Array, eowView: Uint8Array) {
    this.keys = keysView;
    this.eow = eowView;
    this.louds = new Louds(loudsView);
  }

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

  public getDataView(): Uint8Array {
    const view = new Uint8Array(this.louds.bits.length + this.keys.length + this.eow.length);
    view.set(this.louds.bits);
    view.set(this.keys, this.louds.bits.length);
    view.set(this.eow, this.louds.bits.length + this.keys.length);
    return view;
  }

  public static create(root: TrieNode): LabelledTree {
    const { loudsSize, labels } = LabelledTree.getSerializedSize(root);

    const louds = new Uint8Array(loudsSize);
    const keys = new Uint8Array(labels);
    const eow = new Uint8Array(labels);

    let loudsCursor = 0;
    let labelsCursor = 0;

    louds[loudsCursor++] = 1;
    louds[loudsCursor++] = 0;

    const queue = new Queue<TrieNode>();
    queue.push(root);

    const serializeNode = (node: TrieNode, key: string): void => {
      louds[loudsCursor++] = 1;
      keys[labelsCursor] = key.charCodeAt(0);
      eow[labelsCursor] = Number(node.isEndOfWord);
      labelsCursor += 1;
      queue.push(node);
    };

    while (queue.length > 0) {
      const node = queue.shift()!;
      node.children.forEach(serializeNode);
      louds[loudsCursor++] = 0;
    }

    return new LabelledTree(louds, keys, eow);
  }

  public static getSerializedSize(root: TrieNode): {
    loudsSize: number;
    labels: number;
  } {
    let loudsSize = 3; // 2 for fake node + 1 for root
    let labels = 0; // label counter

    const getSize = (node: TrieNode) => {
      loudsSize += 2; // 2 bytes for node
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
}
