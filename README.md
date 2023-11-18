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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
