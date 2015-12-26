import tokenizer from '../tokenizer';
import normalizer from '../normalizer';

import { get, set } from 'lodash';

export default class VisualizationModel {
  constructor(sources, opts = {}) {
    this.sources = sources;

    this._tokenizer = opts.tokenizer || tokenizer;
    this._normalizer = opts.normalizer || normalizer;

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

  tokenize(opts = {}) {
    return tokenize(this, opts);
  }

  normalize(token) {
    return this._normalizer.normalize(token);
  }

  getAllTokens(opts = {}) {
    const attr = opts.normalize ? 'normalizedTokens' : 'tokens';
    return computeCached(this, `_.lists.${attr}`, () => {
      return this.tokenize(opts).reduce(
        (result, source) => result.concat(source.content[attr]), []
      );
    });
  }

}

function tokenize(instance, { normalize }) {
  instance.forEach((source) => {
    const { content } = source;
    if (!content.tokens) {
      content.tokens = instance._tokenizer.tokenize(content.text);
    }
    if (normalize && !content.normalizedTokens) {
      content.normalizedTokens = content.tokens.map((token) => instance.normalize(token));
    }
  });

  return instance;
}

function computeCached(instance, path, fn) {
  if (!get(instance, path)) {
    set(instance, path, fn());
  }
  return get(instance, path);
}
