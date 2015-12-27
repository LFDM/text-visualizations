import tokenizer from '../tokenizer';
import normalizer from '../normalizer';
import { findIndices, extractContext, computeCached, delegate } from './service';

export default class VisualizationModel {
  constructor(sources, opts = {}) {
    this.sources = sources;

    this._tokenizer = opts.tokenizer || tokenizer;
    this._normalizer = opts.normalizer || normalizer;
    this._contextSize = opts.contextSize || 5;

    this._lists = {};
    this._map = {};

    delegate(this, 'sources', ['forEach', 'map', 'reduce']);
    delegate(this, '_normalizer', ['normalize']);
  }

  tokenize(opts = {}) {
    return tokenize(this, opts);
  }

  getAllTokens(opts = {}) {
    const attr = opts.normalize ? 'normalizedTokens' : 'tokens';
    return computeCached(this, `_lists.${attr}`, () => {
      return this.tokenize(opts).reduce(
        (result, source) => result.concat(source.content[attr]), []
      );
    });
  }

  getContexts(token) {
    this.tokenize({ normalize: true });
    const normalizedToken = this.normalize(token);
    return computeCached(this, `_maps.contextualizedTokens.${token}`, () => {
      return this.reduce((mem, source) => {
        var { tokenMap, normalizedTokens } = source.content;
        if (!tokenMap) { tokenMap = source.content.tokenMap = {}; }
        var contexts = tokenMap[normalizedToken];
        if (!contexts) {
          const indices = findIndices(normalizedTokens, normalizedToken);
          contexts = indices.map(
            (i) => extractContext(normalizedTokens, i, this._contextSize)
          );
          tokenMap[token] = contexts;
        }
        return mem.concat(contexts.map((context) => ({ context, source })));
      }, []);
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
