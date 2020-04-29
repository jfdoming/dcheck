import Trie from "./trie";

export const COURSES = {
  CO: [487],
  CS: [
    115,
    116,
    135,
    136,
    145,
    146,
    240,
    "240E",
    241,
    "241E",
    245,
    "245E",
    246,
    "246E",
    247,
    251,
    341,
    348,
    349,
    350
  ],
  MATH: [
    135,
    136,
    137,
    138,
    145,
    146,
    147,
    148,
    213,
    235,
    237,
    239,
    245,
    247,
    249
  ],
  PMATH: [351, 352]
};

export const SUBJECTS_TRIE = new Trie();
Object.entries(COURSES).forEach(([subject, numbers]) => {
  numbers.forEach(number => SUBJECTS_TRIE.insert(`${subject} ${number}`));
});
