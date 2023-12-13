export type Bit = 0 | 1;

type BitPosition = {
    bucket: number;
    position: number;
};

/**
 * TypedArray that stores bits.
 */
export class BitArray extends Uint32Array {
    lastPosition: BitPosition = { bucket: 0, position: 0 };

    static get [Symbol.species](): Uint32ArrayConstructor {
        return Uint32Array;
    }

    /**
     * The amount of bits in the array.
     */
    get size(): number {
        return this.length << 5;
    }

    /**
     * Returns the bit at a given index.
     *
     * @param index the index
     * @return the bit
     */
    public getBit(index: number): Bit {
        const { bucket, position } = this.getBitPosition(index);
        return ((this[bucket] >> position) & 1) as Bit;
    }

    public getBitPosition(index: number): BitPosition {
        const bucket = index >> 5;
        this.lastPosition.bucket = bucket;
        this.lastPosition.position = index - (bucket << 5);
        return this.lastPosition;
    }

    /**
     * Sets the bit at a given index.
     *
     * @param index the index
     * @param value the value
     * @return this
     */
    public setBit(index: number, value: Bit = 1): this {
        const { bucket, position } = this.getBitPosition(index);
        this[bucket] = (this[bucket] & ~(1 << position)) | (value << position);
        return this;
    }

    /**
     * Returns the length of the underlying TypedArray required to hold the given amount of bits.
     *
     * @param size the amount of bits
     * @return the required length
     */
    public static getLength(size: number): number {
        return Math.ceil(size / 32);
    }

    /**
     * Creates a BitArray of the specified size.
     *
     * @param size the maximum amount of bits in the array
     * @return a new BitArray
     */
    public static create<T extends typeof BitArray>(
        this: T,
        size: number,
    ): InstanceType<T> {
        return new this(this.getLength(size)) as InstanceType<T>;
    }
}