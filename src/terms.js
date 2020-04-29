import Trie from "./trie";

export const TERM_NAMES = { 9: "Fall", 1: "Winter", 5: "Spring" };

export const TERMS_TRIE = new Trie();
Object.values(TERM_NAMES).forEach(term => TERMS_TRIE.insert(term));
