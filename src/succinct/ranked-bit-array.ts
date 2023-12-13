import { BitArray } from "./bit-array";
import { popCount32 } from "./utils";


/**
 * A {@link BitArray} that supports O(1) rank and select O(logN) operations.
 */
export class RankedBitArray extends BitArray {
    /**
     * The amount of bits in the array.
     */
    public get size(): number {
        return (this.length >> 1) << 5;
    }

    /**
     * Gets the rank of ones at the given index.
     * @param index The index of the bit.
     * @returns Ones rank at the given index.
     */
    public rank1(index: number): number {
        const { bucket, position } = this.getBitPosition(index);

        const value = this[bucket];
        const masked = value & ((1 << position) - 1);
        const localRank = popCount32(masked);
        const bucketRank = bucket ? this[(this.length >> 1) + bucket - 1] : 0;
        return bucketRank + localRank;

    }

    /**
     * Returns the select of zeros at the given index.
     * @param index 
     * @returns Zeros select at the given index.
     */
    public select0(index: number): number {
        let left = this.length >> 1;
        let right = this.length - 1;

        while (left <= right) {
            const midIndex = (right + left) >> 1;
            const mid = this[midIndex];

            if (mid > index) {
                right = midIndex - 1;
            } else if (mid < index) {
                left = midIndex + 1;
            } else if (mid === index) {
                break;
            }
        }

        const bucketRankIndex = left - (this.length >> 1);

        const cursor = bucketRankIndex ? bucketRankIndex << 5 : 0;

        let count = cursor ? Math.abs(cursor - this[left - 1]) : 0;

        for (let i = cursor, n = this.size; i < n; i++) {
            if (this.getBit(i) === 0) {
                count++;
                if (count === index) {
                    return i;
                }
            }
        }

        return -1;
    }

    public countBucketRanks() {
        let acc = 0;
        for (let i = 0, n = this.length >> 1; i < n; i++) {
            acc += popCount32(this[i]);
            this[n + i] = acc;
        }
    }

    /**
     * Returns the length of the underlying TypedArray required to hold the given amount of bits.
     *
     * @param size the amount of bits
     * @return the required length
     */
    static getLength(size: number): number {
        return Math.ceil(size / 32) << 1;
    }
}