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

#### Trie.insert

10,000 rounds.

```
Average time (ms): 0.000233
```

#### search

10,000 rounds.

Results: average operation time in milliseconds.

| words (n) | avg. op time (ms) |             |               |
| --------- | ----------------- | ----------- | ------------- |
|           | trie              | binary trie | labelled tree |
| 100       | 0.000582          | 0.000452    | 0.010219      |
| 1000      | 0.003238          | 0.000494    | 0.054442      |
| 10000     | 0.004381          | 0.000616    | 0.406077      |
| 100000    | 0.005342          | 0.001159    | 3.671739      |

#### startsWith

10,000 rounds.

| words (n) | avg. op time (ms) |             |               |
| --------- | ----------------- | ----------- | ------------- |
|           | trie              | binary trie | labelled tree |
| 100       | 0.000421          | 0.000338    | 0.005769      |
| 1000      | 0.001326          | 0.000317    | 0.024084      |
| 10000     | 0.001875          | 0.000418    | 0.188123      |
| 100000    | 0.002768          | 0.000684    | 1.625385      |


#### create

10 rounds.
| words (n) | original size (kb) | binary trie |             | labelled trie |            |
| --------- | ------------------ | ----------- | ----------- | ------------- | ---------- |
|           |                    | size (kb)   | speed (ms)  | size (kb)     | speed (ms) |
| 100       | 1.6                | 10.83       | 1.234282    | 2.52          | 0.467565   |
| 1000      | 15.78              | 103.29      | 8.247886    | 23.99         | 1.922305   |
| 10000     | 160.22             | 1009.55     | 129.964895  | 234.37        | 34.505032  |
| 100000    | 1609.13            | 9808.29     | 2239.271008 | 2276.93       | 819.11557  |


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
