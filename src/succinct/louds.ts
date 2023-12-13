import { RankedBitArray } from "./ranked-bit-array";

/**
 * Level Order Unary Degree Sequence (LOUDS).
 * @see https://memoria-framework.dev/docs/data-zoo/louds-tree/
 */
export class Louds extends RankedBitArray {
  /**
   * Gets tree node number at {@link position} in the {@link bits} array.
   *
   * @param position The position in the {@link bits} array.
   * @returns The index of the node.
   */
  public getNodeIndex(position: number): number {
    return this.rank1(position + 1);
  }

  /**
   * Finds position of the first child for node at the {@link position}
   *
   * @param position The position in the {@link bits} array.
   * @returns The position of the first child.
   */
  public firstChild(position: number): number {
    return this.select0(this.rank1(position + 1)) + 1;
  }

  /**
   * checks if {@link position} in  tree node.
   *
   * @param position The position in the {@link bits} array.
   * @returns True if position in tree node.
   */
  public isNode(position: number): boolean {
    return this.getBit(position) === 1;
  }
}
