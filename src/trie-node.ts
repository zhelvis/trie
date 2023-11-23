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
   * @param view - The StaticDataView containing the serialized TrieNode.
   * @returns The deserialized TrieNode.
   */
  public static deserialize(view: StaticDataView): TrieNode {
    // start of the node in buffer
    const position = view.offset;
    const byteLenght = view.getUint32();

    const node = new TrieNode();
    node.isEndOfWord = Boolean(view.getUint8());

    while (view.offset < position + byteLenght) {
      const key = String.fromCharCode(view.getUint8());
      // TODO: Loop instead of recursion?
      const child = TrieNode.deserialize(view);
      node.children.set(key, child);
    }

    return node;
  }
}
