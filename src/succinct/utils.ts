/**
 * Counts set bits in a given number.
 *
 * @param value The given number.
 * @return The amount of set bits.
 */
export function popCount32(value: number): number {
  const a = value - ((value >> 1) & 0x55555555);
  const b = (a & 0x33333333) + ((a >> 2) & 0x33333333);
  return (((b + (b >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}
