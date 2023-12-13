
describe('BitArray', () => {
    let bitArray: BitArray;

    beforeEach(() => {
        bitArray = BitArray.create(33);
    });

    it('should create a BitArray of the specified size', () => {    
        expect(bitArray.size).toBe(64);
        expect(bitArray.length).toBe(BitArray.getLength(64));
    });

    it('should set and get bits correctly', () => {
        bitArray.setBit(0, 1);
        bitArray.setBit(1, 0);
        bitArray.setBit(2, 1);

        expect(bitArray.getBit(0)).toBe(1);
        expect(bitArray.getBit(1)).toBe(0);
        expect(bitArray.getBit(2)).toBe(1);
    });

    it('should return the correct bit position', () => {
        let position = bitArray.getBitPosition(5);
        expect(position.bucket).toBe(0);
        expect(position.position).toBe(5);

        position = bitArray.getBitPosition(32);
        expect(position.bucket).toBe(1);
        expect(position.position).toBe(0);
    });
});
import { BitArray } from '/Volumes/work/trie/src/succinct/bit-array';
