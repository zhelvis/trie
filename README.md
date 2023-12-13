# Trie

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/zhelvis/trie/node.js.yml)

This project is a TypeScript implementation of the Trie data structure.

A Trie is a tree-like data structure that is used to store a collection of strings. Each node of the Trie represents a single character of a string and the string is formed by tracing a path from the root to any leaf node. Tries are particularly useful for searching for words in dictionaries, providing auto-suggestions in search engines.

This project also includes a binary implementation of Trie. The BinaryTrie is immutable and can be created from a regular Trie. Once created, it can be restored from buffer saved in a persistent storage. It uses in event-driven workers to restore data without deserialization.

## Installation

1. Clone the repository
1. Navigate into the project directory
1. Install the dependencies:

```bash
npm install
```

## Running Tests

After installing the dependencies, you can run the unit tests by executing the following command in the project directory:

```bash
npm test
```

## Build

To build the project, run the following command in the project directory:

```bash
npm run build
```

The code will be compiled in `dist` folder.

## Usage

After building, you can use the Trie data structure in your TypeScript code as follows:

```typescript
import { Trie } from "./dist/trie";

let trie = new Trie();
trie.insert("word");
console.log(trie.search("word")); // returns true
console.log(trie.startsWith("wo")); // returns true
const serialized = trie.serialize(); // serializes the trie into an ArrayBuffer
console.log(Trie.deserialize(serialized)); // returns restored Trie instance
```

## Benchmarks

This project includes benchmarks to measure the performance of the Trie data structure.

All methods except `insert` are tested on random data sets of different sizes.

To run the benchmarks, execute the following command in the project directory:

```
npx ts-node benchmark/<method name>
```

### Results

System:

```
OS: Win 10
ENV: NodeJS v20.3.0
CPU: Intel Core i5-11400H 2.70GHz
RAM: 8GB
```

#### insert

10,000 rounds.

```
Average time (ms): 0.000233
```

#### search

10,000 rounds.

| Size   | trie     | binary trie |
| ------ | -------- | ----------- |
| 100    | 0.000565 | 0.000498    |
| 1000   | 0.001185 | 0.000321    |
| 10000  | 0.002446 | 0.000481    |
| 100000 | 0.002749 | 0.000601    |

#### startsWith

10,000 rounds.

| Size   | trie     | binary trie |
| ------ | -------- | ----------- |
| 100    | 0.000339 | 0.000342    |
| 1000   | 0.000386 | 0.00021     |
| 10000  | 0.000934 | 0.000359    |
| 100000 | 0.00136  | 0.000484    |

#### BinaryTrie.create

10 rounds.

| Size   | time (ms)   | size (B) | original size (B) |
| ------ | ----------- | -------- | ----------------- |
| 100    | 1.519195    | 10887    | 1611              |
| 1000   | 8.897976    | 106577   | 16286             |
| 10000  | 123.208486  | 1039908  | 164957            |
| 100000 | 2197.557878 | 10045233 | 1648162           |

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
