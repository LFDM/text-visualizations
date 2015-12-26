import { TreebankWordTokenizer } from 'natural';

export default {
  tokenize
};

function tokenize(text) {
  const tokenizer = new TreebankWordTokenizer();
  return tokenizer.tokenize(text);
}
