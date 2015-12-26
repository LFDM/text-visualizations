import tokenizer from '../tokenizer';

export default class VisualizationModel {
  constructor(sources) {
    this.sources = sources;
    this.tokenizer = tokenizer;
  }

  forEach(fn) {
    return this.sources.forEach(fn);
  }

  map(fn) {
    return this.sources.map(fn);
  }

  reduce(fn, mem) {
    return this.sources.reduce(fn, mem);
  }

  tokenize() {
    this.forEach((source) => {
      const { content } = source;
      if (!content.tokens) {
        content.tokens = this.tokenizer.tokenize(content.text);
      }
    });

    return this;
  }

  getAllTokens() {
    if (!this._tokens) {
      this._tokens = this.tokenize().reduce(
        (result, source) => result.concat(source.content.tokens), []
      );
    }
    return this._tokens;
  }
}
