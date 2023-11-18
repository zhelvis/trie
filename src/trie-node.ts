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
    // isEndOfWord property
    let estimated = Uint8Array.BYTES_PER_ELEMENT;

    this.children.forEach((node) => {
      // entry key
      estimated += Uint8Array.BYTES_PER_ELEMENT;
      // Size in bytes
      estimated += Uint32Array.BYTES_PER_ELEMENT;
      // entry value
      estimated += node.getSerializedSize();
    });

    return estimated;
  }

  /**
   * Serializes the TrieNode into an ArrayBuffer.
   *
   * @param buffer - The buffer to serialize the TrieNode into.
   * @param byteOffset - The byte offset in the buffer to start serializing from. Defaults to 0.
   * @param byteLength - The maximum number of bytes to serialize. If not specified, the entire buffer will be used.
   */
  public serialize(buffer: ArrayBuffer, byteOffset = 0, byteLength?: number): void {
    // local offset in range from byteOffset to byteOffset + byteLenght
    let offset = 0;
    const view = new DataView(buffer, byteOffset, byteLength);
    view.setUint8(offset, Number(this.isEndOfWord));
    offset += Uint8Array.BYTES_PER_ELEMENT;

    this.children.forEach((node, key) => {
      view.setUint8(offset, key.charCodeAt(0));
      offset += Uint8Array.BYTES_PER_ELEMENT;
      const byteLength = node.getSerializedSize();
      view.setUint32(offset, byteLength);
      offset += Uint32Array.BYTES_PER_ELEMENT;
      node.serialize(buffer, byteOffset + offset, byteLength);
      offset += byteLength;
    });
  }

  /**
   * Deserialize a TrieNode from a binary buffer.
   *
   * @param buffer - The binary buffer containing the serialized TrieNode.
   * @param byteOffset - The offset in bytes where the TrieNode starts in the buffer.
   * @param byteLength - The length in bytes of the TrieNode in the buffer.
   * @returns The deserialized TrieNode.
   */
  public static deserialize(buffer: ArrayBuffer, byteOffset = 0, byteLength?: number): TrieNode {
    // local offset in range from byteOffset to byteOffset + byteLenght
    let offset = 0;
    const view = new DataView(buffer, byteOffset, byteLength);
    const node = new TrieNode();
    node.isEndOfWord = Boolean(view.getUint8(offset));
    offset += Uint8Array.BYTES_PER_ELEMENT;

    while (offset < view.byteLength) {
      const key = String.fromCharCode(view.getUint8(offset));
      offset += Uint8Array.BYTES_PER_ELEMENT;
      const childByteLenght = view.getUint32(offset);
      offset += Uint32Array.BYTES_PER_ELEMENT;
      const child = TrieNode.deserialize(buffer, byteOffset + offset, childByteLenght);
      node.children.set(key, child);
      offset += childByteLenght;
    }

    return node;
  }
}
