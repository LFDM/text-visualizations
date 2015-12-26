import { TreebankWordTokenizer } from 'natural';

export default {
  tokenize
};

function tokenize(text) {
  const tokenizer = new TreebankWordTokenizer();
  const tokens = tokenizer.tokenize(text);
  for (var i = 0; i < tokens.length; i++) {
    const m = tokens[i].match('^(.+)(\\.)$');
    if (m) {
      tokens[i] = m[1];
      tokens.splice(i + 1, 0, m[2]);
    }
  }
  return tokens;
}
