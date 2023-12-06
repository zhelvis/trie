import { LabelledTree } from '../../src/succinct/labelled-tree';
import { TrieNode } from '../../src/trie-node';

describe('LabelledTree', () => {
    const getTestDataView = () => new Uint8Array([
        1, 0, 1, 1, 0,
        0, 0, 97, 98, 1,
        1
    ]);

    const getTestTrieNode = () => {
        const root = new TrieNode();

        const child1 = new TrieNode();
        child1.isEndOfWord = true;

        const child2 = new TrieNode();
        child2.isEndOfWord = true;

        root.children.set('a', child1);
        root.children.set('b', child2);

        return root;
    }

    describe('findChild', () => {
        const cases: [key: string, expected: number][] = [
            ['a', 2],
            ['b', 3],
            ['c', -1],
        ];

        const tree = LabelledTree.create(getTestTrieNode());

        it.each(cases)('should return the position of the child node with the given key', (key, expected) => {
            const childPos = tree.findChild(0, key);

            expect(childPos).toEqual(expected);
        });
    });

    describe('create', () => {
        it('should create a LabelledTree from a TrieNode', () => {
            const root = getTestTrieNode();

            const createdTree = LabelledTree.create(root);

            expect(createdTree.getDataView()).toEqual(getTestDataView());
        });
    });

    describe('getSerializedSize', () => {
        it('should return the serialized size of the LabelledTree', () => {
            const root = getTestTrieNode();

            const serializedSize = LabelledTree.getSerializedSize(root);
    
            expect(serializedSize).toEqual({
                loudsSize: 7,
                labels: 2,
            });
        });
    });
});
