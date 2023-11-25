import type { TrieNode } from "./trie-node";

export type Bit = 0 | 1;

/**
 * Level Order Unary Degree Sequence (LOUDS).
 * @see https://memoria-framework.dev/docs/data-zoo/louds-tree/
 */
export class Louds {
  public bits: Bit[] = [];

  /**
   * Builds the LOUDS (Level-Order Unary Degree Sequence) representation of a trie.
   *
   * @param root The root node of the trie.
   */
  public build(root: TrieNode): void {
    this.bits.push(1, 0);
    const queue: TrieNode[] = [root];

    while (queue.length > 0) {
      const node = queue.shift()!;

      node.children.forEach((child) => {
        this.bits.push(1);
        queue.push(child);
      });

      this.bits.push(0);
    }
  }

  /**
   * Returns the number of occurrences of the {@link symbol} in the {@link bits} array up to the given {@link position}.
   *
   * @param symbol The symbol to count.
   * @param position The position up to which to count.
   * @returns The number of occurrences of the symbol.
   */
  public rank(symbol: Bit, position: number): number {
    let count = 0;

    for (let i = 0; i < position; i++) {
      if (this.bits[i] === symbol) {
        count++;
      }
    }

    return count;
  }

  /**
   * Finds the position of the occurrence-th {@link symbol} in the {@link bits} array that matches the given {@link symbol}.
   *
   * @param symbol The symbol to search for.
   * @param occurrence The occurrence number of the symbol to find.
   * @returns The position of the occurrence-th symbol, or -1 if not found.
   */
  public select(symbol: Bit, occurrence: number): number {
    let count = 0;

    for (let i = 0; i < this.bits.length; i++) {
      if (this.bits[i] === symbol) {
        count++;
        if (count === occurrence) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Gets tree node number at {@link position} in the {@link bits} array.
   *
   * @param position The position in the {@link bits} array.
   * @returns The index of the node.
   */
  public getNodeIndex(position: number): number {
    return this.rank(1, position + 1);
  }

  /**
   * Gets position of the tree node at {@link index} in the {@link bits} array.
   *
   * @param index The index of the node.
   * @returns The position of the node in the {@link bits} array.
   */
  public getNodePosition(index: number): number {
    return this.select(1, index);
  }

  /**
   * Finds position of the first child for node at the {@link position}
   *
   * @param position The position in the {@link bits} array.
   * @returns The position of the first child.
   */
  public firstChild(position: number): number {
    return this.select(0, this.rank(1, position + 1)) + 1;
  }

  /**
   * Finds position of the last child for node at the {@link position}
   *
   * @param position The position in the {@link bits} array.
   * @returns The position of the last child.
   */
  public lastChild(position: number): number {
    return this.select(0, this.rank(1, position + 1) + 1) - 1;
  }

  /**
   * Finds position of the parent for the node at the {@link position}
   *
   * @param position The position in the {@link bits} array.
   * @returns The position of the parent.
   */
  public parent(position: number): number {
    return this.select(1, this.rank(0, position + 1));
  }

  /**
   * Number of children for node at the {@link position}.
   *
   * @param position The position in the {@link bits} array.
   * @returns Count of children for the node.
   */
  public children(position: number): number {
    return this.lastChild(position) - this.firstChild(position) + 1;
  }

  /**
   * Finds position of {@link n}-th child for the node at the position i.
   *
   * {@link n} >= 0;
   *
   * @param position The position in the {@link bits} array.
   * @param n The number of the child.
   * @returns Position of the {@link n}-th child.
   */
  public child(position: number, n: number): number {
    return this.firstChild(position) + n;
  }

  /**
   * checks if {@link position} in  tree node.
   *
   * @param position The position in the {@link bits} array.
   * @returns True if position in tree node.
   */
  public isNode(position: number): boolean {
    return this.bits[position] === 1;
  }

  /**
   * Calculates the serialized size of a trie starting from the given root node.
   * The serialized size includes the size of the fake node and all the nodes and children in the trie.
   *
   * @param root The root node of the trie.
   * @returns The estimated serialized size of the trie in bytes.
   */
  public static getSerializedSize(root: TrieNode): number {
    let estimated = 2; // 2 bytes for fake node

    const stack: TrieNode[] = [root];

    while (stack.length > 0) {
      const node = stack.pop()!;

      estimated += 1; // 1 byte for the node

      node.children.forEach((child) => {
        estimated += 1; // 1 byte for the child
        stack.push(child);
      });
    }

    return estimated;
  }
}
