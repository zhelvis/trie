/**
 * API to simplify the manipulation of a Uint8Array buffer.
 * The {@link offset} is automatically incremented after each read/write operation.
 * It is passed to the serialize and deserialize methods of the serializable classes.
 * When serializing, the {@link offset} is used to determine the position in the buffer to write to.
 * When deserializing, the {@link offset} is used to determine the position in the buffer to read from.
 * TODO: Use separate classes for reading and writing?
 */
export class StaticDataView {
  public offset = 0;

  constructor(public buffer: Uint8Array) {}

  /**
   * Sets the specified 8-bit unsigned integer at the current offset position.
   * @param uint8 The value to set.
   */
  public setUint8(uint8: number): void {
    this.buffer[this.offset++] = uint8;
  }

  /**
   * Retrieves the 8-bit unsigned integer at the current offset position.
   * @returns The retrieved value.
   */
  public getUint8(): number {
    return this.buffer[this.offset++];
  }

  /**
   * Sets the specified 32-bit unsigned integer at the current offset position.
   * @param uint32 The value to set.
   */
  public setUint32(uint32: number): void {
    this.buffer[this.offset++] = uint32 >>> 24;
    this.buffer[this.offset++] = uint32 >>> 16;
    this.buffer[this.offset++] = uint32 >>> 8;
    this.buffer[this.offset++] = uint32;
  }

  /**
   * Retrieves the 32-bit unsigned integer at the current offset position.
   * @returns The retrieved value.
   */
  public getUint32(): number {
    return (
      (((this.buffer[this.offset++] << 24) >>> 0) +
        ((this.buffer[this.offset++] << 16) | (this.buffer[this.offset++] << 8) | this.buffer[this.offset++])) >>>
      0
    );
  }
}
