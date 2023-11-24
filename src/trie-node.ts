import { StaticDataView } from "./data-view";

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
  public getSerializedSize(): number {
    // Size in bytes
    let estimated = Uint32Array.BYTES_PER_ELEMENT;
    // isEndOfWord property
    estimated += Uint8Array.BYTES_PER_ELEMENT;

    this.children.forEach((node) => {
      // entry key
      estimated += Uint8Array.BYTES_PER_ELEMENT;
      // entry value
      estimated += node.getSerializedSize();
    });

    return estimated;
  }

  /**
   * Serializes the TrieNode object into a StaticDataView.
   * @param view The StaticDataView object to serialize into.
   */
  public serialize(view: StaticDataView): void {
    view.setUint32(this.getSerializedSize());
    view.setUint8(Number(this.isEndOfWord));

    this.children.forEach((node, key) => {
      view.setUint8(key.charCodeAt(0));
      node.serialize(view);
    });
  }

  /**
   * Deserialize a TrieNode from a StaticDataView.
   * 
   * the serialized structure:
   *   node size (4 bytes)  isEndOfWord (1 byte)   child ASCII key (1byte)  child node (n bytes)
   * |--------------------|----------------------|-------------------------|---------------------|...|
   * 
   * The algorithm implements a direct traversal of the tree.
   * 
   * We determine how to go to the child node and return to
   * the parent node based on node size and current position in the {@link StaticDataView}.
   * 
   * TODO (v.zhelvis):
   * We are currently experiencing performance issues with large volumes of this due to active GC work.
   * 
   * Tried these optimizations:
   * - use loop with stack instead recursion
   * - store node sized with dynamic size of bytes (1 byte for number size + n bytes for number)
   * 
   * What else can be tried:
   * - uint24 for sizes
   * - store node sized in separate typed array
   * - use radix tree structure for serialized data (compress leaves 'a -> b -> c' to 'abc' node)
   * - use custom decoder for node keys
   *
   * @param view - The StaticDataView containing the serialized TrieNode.
   * @returns The deserialized TrieNode.
   */
  public static deserialize(view: StaticDataView): TrieNode {
    const end = view.offset + view.getUint32();

    const node = new TrieNode();
    node.isEndOfWord = Boolean(view.getUint8());

    while (view.offset < end) {
      const key = String.fromCharCode(view.getUint8());
      const child = TrieNode.deserialize(view);
      node.children.set(key, child);
    }

    return node;
  }
}
