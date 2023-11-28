import { StaticDataView } from "./data-view";
import { Queue } from "./queue";

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

  /**
   * Calculates the serialized size of the TrieNode.
   * @returns The serialized size in number of bytes.
   */
  public static getSerializedSize(root: TrieNode): {
    metadata: number,
    size: number,
    labels: number
  } {
    let size = 3; // 2 bytes for fake node + 1 for root
    let labels = 0;

    const getSize = (node: TrieNode) => {
      size += 2;
      labels += 1;
      node.children.forEach(getSize);
    }

    root.children.forEach(getSize);

    return {
      metadata: Uint32Array.BYTES_PER_ELEMENT * 2,
      size,
      labels,
    };
  }

  /**
   * Serializes the TrieNode object into a StaticDataView.
   * @param view The StaticDataView object to serialize into.
   */
  /**
   * Serializes the {@link TrieNode} object into a {@link StaticDataView}.
   * @param view The StaticDataView object to serialize into.
   */
  public static serialize(
    view: StaticDataView,
    node: TrieNode,
    size: number,
    labels: number,
  ) {
    view.setUint32(size);
    view.setUint32(labels);

    let loudsCursor = view.offset;
    let keysCursor = view.offset + size;
    let eowCursor = view.offset + size + labels;

    view.buffer[loudsCursor++] = 1;
    view.buffer[loudsCursor++] = 0;

    const queue = new Queue<TrieNode>();
    queue.push(node);

    const serializeNode = (node: TrieNode, key: string): void => {
      view.buffer[loudsCursor++] = 1;
      view.buffer[keysCursor++] = key.charCodeAt(0);
      view.buffer[eowCursor++] = Number(node.isEndOfWord);
      queue.push(node);
    }

    while (queue.length > 0) {
      const node = queue.shift()!;
      node.children.forEach(serializeNode);
      view.buffer[loudsCursor++] = 0;
    }
  }

  /**
   * Deserialize a TrieNode from a StaticDataView.
   *
   * @param view - The StaticDataView containing the serialized TrieNode.
   * @returns The deserialized TrieNode.
   */
  public static deserialize(view: StaticDataView): TrieNode {
    const size = view.getUint32();
    const labels = view.getUint32();

    const root = new TrieNode();

    const queue = new Queue<TrieNode>();
    queue.push(root)

    let loudsCursor = view.offset + 2;
    let keysCursor = view.offset + size;
    let eowCursor = view.offset + size + labels;

    while(queue.length > 0) {
      const node = queue.shift()!;

      while(view.buffer[loudsCursor]) {
        const child = new TrieNode();
        child.isEndOfWord = view.buffer[eowCursor] === 1;
        node.children.set(String.fromCharCode(view.buffer[keysCursor]), child);
        queue.push(child);
        loudsCursor += 1;
        keysCursor += 1;
        eowCursor += 1;
      }

      loudsCursor += 1;
    }

    return root;
  }
}