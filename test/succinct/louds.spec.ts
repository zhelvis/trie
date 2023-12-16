import { Louds } from "../../src/succinct/louds";

describe("Louds", () => {
  let louds: Louds;

  beforeEach(() => {
    louds = new Louds([2774701, 12]);
  });

  describe("getNodeIndex", () => {
    const cases: [position: number, expected: number][] = [
      [0, 1],
      [1, 1],
      [16, 9],
      [21, 12],
    ];

    it.each(cases)("should return the correct node index at position %i", (position, expected) => {
      expect(louds.getNodeIndex(position)).toBe(expected);
    });
  });

  describe("firstChild", () => {
    const cases: [position: number, expected: number][] = [
      [0, 2],
      [2, 5],
      [5, 9],
    ];

    it.each(cases)("should return the correct child position of node at position %i", (position, expected) => {
      expect(louds.firstChild(position)).toBe(expected);
    });
  });

  describe("isNode", () => {
    const cases: [expected: boolean, position: number][] = [
      [true, 0],
      [false, 1],
    ];

    it.each(cases)("should return %s if position %i is a node", (expected, position) => {
      expect(louds.isNode(position)).toBe(expected);
    });
  });
});
