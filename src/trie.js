class TrieNode {
  constructor(key) {
    this.key = key;
    this.parent = null;
    this.children = {};
    this.end = false;
  }
  getWord() {
    let node = this;
    let output = [];

    while (node.key !== null) {
      output.unshift(node.key);
      node = node.parent;
    }
    return output.join("");
  }
}

const findAllWords = (node, output) => {
  if (node.end) {
    output.unshift(node.getWord());
  }

  for (let child of Object.values(node.children)) {
    findAllWords(child, output);
  }
};

// Thanks to https://gist.github.com/tpae/72e1c54471e88b689f85ad2b3940a8f0 for the reference.
export default class Trie {
  constructor() {
    this.root = new TrieNode(null);
  }
  insert(key) {
    let node = this.root;
    for (let i = 0; i < key.length; ++i) {
      let c = key[i];
      if (!node.children[c]) {
        node.children[c] = new TrieNode(c);
        node.children[c].parent = node;
      }
      node = node.children[c];
      if (i === key.length - 1) node.end = true;
    }
  }
  find(key) {
    let node = this.root;
    let output = [];

    for (let c of key) {
      if (node.children[c]) {
        node = node.children[c];
      } else {
        return output;
      }
    }

    findAllWords(node, output);
    return output;
  }
}
