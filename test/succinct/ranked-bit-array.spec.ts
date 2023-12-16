import { RankedBitArray } from "../../src/succinct/ranked-bit-array";

describe("RankedBitArray", () => {
  let rankedBitArray: RankedBitArray;

  beforeEach(() => {
    rankedBitArray = new RankedBitArray([2774701, 2774701, 12, 24]);
  });

  describe("rank1", () => {
    const cases: [position: number, expected: number][] = [
      [0, 0],
      [1, 1],
      [2, 1],
      [3, 2],
      [32, 12],
      [33, 13],
    ];

    it.each(cases)("should return the correct rank to position %i", (position, expected) => {
      expect(rankedBitArray.rank1(position)).toBe(expected);
    });
  });

  describe("select0", () => {
    const cases: [occurrence: number, expected: number][] = [
      [0, -1],
      [1, 1],
      [2, 4],
      [3, 6],
      [21, 33],
    ];
    it.each(cases)("should return the correct index of the occurrence-th", (occurrence, expected) => {
      expect(rankedBitArray.select0(occurrence)).toBe(expected);
    });
  });

  // it("should correctly count the bucket ranks", () => {
  //     // Test countBucketRanks method
  //     rankedBitArray.countBucketRanks();
  //     // Add assertions to check the correctness of the bucket ranks
  // });
});
