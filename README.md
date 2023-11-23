# Trie

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/zhelvis/trie/node.js.yml)

This project is a TypeScript implementation of the Trie data structure.

A Trie is a tree-like data structure that is used to store a collection of strings. Each node of the Trie represents a single character of a string and the string is formed by tracing a path from the root to any leaf node. Tries are particularly useful for searching for words in dictionaries, providing auto-suggestions in search engines.

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

| Size   | Average time (ms) |
| ------ | ----------------- |
| 100    | 0.000378          |
| 1000   | 0.000598          |
| 10000  | 0.002320          |
| 100000 | 0.004419          |

#### startsWith

10,000 rounds.

| Size   | Average time (ms) |
| ------ | ----------------- |
| 100    | 0.000388          |
| 1000   | 0.000348          |
| 10000  | 0.001058          |
| 100000 | 0.002420          |

#### serialize

10 rounds.

| Size   | Average time (ms) |
| ------ | ----------------- |
| 100    | 0.929320          |
| 1000   | 6.420090          |
| 10000  | 121.772240        |
| 100000 | 2158.035440       |

#### deserialize

10 rounds.

| Size   | Average time (ms) |
| ------ | ----------------- |
| 100    | 0.408080          |
| 1000   | 0.958400          |
| 10000  | 25.248170         |
| 100000 | 561.066640        |

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
