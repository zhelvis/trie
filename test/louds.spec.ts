import { Louds, type Bit } from "../src/louds";
import { Trie } from "../src/trie";

describe("Louds", () => {
  let louds: Louds;

  beforeEach(() => {
    louds = new Louds();
  });

  const data: string[] = ["hello", "world", "hey"];

  // LOUDS bits
  const bits: Bit[] = [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0];

  describe("getSerializedSize", () => {
    it("should return the correct size of the LOUDS structure", () => {
      const trie = Trie.create(data);

      expect(Louds.getSerializedSize(trie.root)).toBe(bits.length);
    });
  });

  describe("build", () => {
    it("should build the LOUDS structure correctly", () => {
      const trie = Trie.create(data);
      louds.build(trie.root);

      expect(louds.bits).toEqual(bits);
    });
  });

  describe("navigation methods", () => {
    beforeEach(() => {
      louds.bits = bits;
    });

    describe("rank", () => {
      const cases: [symbol: Bit, position: number, expected: number][] = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 25, 13],
      ];

      it.each(cases)(
        "should return the correct rank of a symbol %i up to position %i",
        (symbol, position, expected) => {
          expect(louds.rank(symbol, position)).toBe(expected);
        },
      );
    });

    describe("select", () => {
      const cases: [symbol: Bit, occurrence: number, expected: number][] = [
        [1, 0, -1],
        [0, 1, 1],
        [1, 12, 21],
      ];

      it.each(cases)(
        "should return the correct index of the occurrence-th symbol %i",
        (symbol, occurrence, expected) => {
          expect(louds.select(symbol, occurrence)).toBe(expected);
        },
      );
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

    describe("getNodePosition", () => {
      const cases: [index: number, expected: number][] = [
        [1, 0],
        [5, 7],
        [11, 19],
      ];

      it.each(cases)("should return the correct node position at index %i", (index, expected) => {
        expect(louds.getNodePosition(index)).toBe(expected);
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

    describe("lastChild", () => {
      const cases: [position: number, expected: number][] = [
        [0, 3],
        [2, 5],
        [5, 10],
      ];

      beforeEach(() => {
        louds.bits = bits;
      });

      it.each(cases)("should return the correct child position of node at position %i", (position, expected) => {
        expect(louds.lastChild(position)).toBe(expected);
      });
    });

    describe("parent", () => {
      const cases: [position: number, expected: number][] = [
        [0, -1],
        [1, 0],
        [2, 0],
        [5, 2],
      ];

      it.each(cases)("should return the correct parent position of node at position %i", (position, expected) => {
        expect(louds.parent(position)).toBe(expected);
      });
    });

    describe("children", () => {
      const cases: [position: number, expected: number][] = [
        [2, 1],
        [5, 2],
        [10, 0],
      ];

      it.each(cases)("should return the correct number of children of node at position %i", (position, expected) => {
        expect(louds.children(position)).toBe(expected);
      });
    });

    describe("child", () => {
      const cases: [position: number, n: number, expected: number][] = [
        [5, 0, 9],
        [5, 1, 10],
        [17, 0, 21],
      ];

      it.each(cases)(
        "should return the correct position of the n-th child of node at position %i",
        (position, n, expected) => {
          expect(louds.child(position, n)).toBe(expected);
        },
      );
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
});
