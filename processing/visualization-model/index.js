import tokenizer from '../tokenizer';
import { get, set } from 'lodash';

export default class VisualizationModel {
  constructor(sources) {
    this.sources = sources;
    this.tokenizer = tokenizer;

    this._lists = {};
    this._map = {};
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
    return this.computeCached('_.lists.tokens', () => {
      return this.tokenize().reduce(
        (result, source) => result.concat(source.content.tokens), []
      );
    });
  }

  computeCached(path, fn) {
    if (!get(this, path)) {
      set(this, path, fn());
    }
    return get(this, path);
  }
}
