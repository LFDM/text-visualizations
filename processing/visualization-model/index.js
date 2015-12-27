import tokenizer from '../tokenizer';
import normalizer from '../normalizer';
import filter from '../filter';
import {
  findIndices,
  extractContext,
  computeCached,
  countFrequencies,
  combineFrequencies,
  sortByFrequency,
  delegate
} from './service';

export default class VisualizationModel {
  constructor(sources, opts = {}) {
    this.sources = sources;

    this._tokenizer = opts.tokenizer || tokenizer;
    this._normalizer = opts.normalizer || normalizer;
    this._filter = opts.filter || filter;
    this._contextSize = opts.contextSize || 4;

    this._lists = {};
    this._map = {};

    delegate(this, 'sources', ['forEach', 'map', 'reduce']);
    delegate(this, '_normalizer', ['normalize']);
    delegate(this, '_filter', ['filterStopwords', 'isStopword']);
  }

  tokenize(opts = {}) {
    return tokenize(this, opts);
  }

  getAllTokens(opts = {}) {
    return computeCached(this, getTokenCacheKey(opts), () => {
      return this.tokenize(opts).reduce(
        (result, source) => result.concat(getTokens(source, opts)), []
      );
    });
  }

  getContexts(token) {
    this.tokenize({ normalize: true });
    const normalizedToken = this.normalize(token);
    return computeCached(this, `_maps.contextualizedTokens.${token}`, () => {
      return this.reduce((mem, source) => {
        const { normalizedTokens } = source.content;
        const tokenStats = getTokenStats(source, normalizedToken);
        var contexts = tokenStats.contexts;
        if (!contexts) {
          const indices = findIndices(normalizedTokens, normalizedToken);
          contexts = indices.map(
            (i) => extractContext(normalizedTokens, i, this._contextSize)
          );
          tokenStats.contexts = contexts;
        }
        return mem.concat(contexts.map((context) => ({ context, source })));
      }, []);
    });
  }

  getFrequencies(opts = { normalize: true, filter: { stopwords: true } }) {
    return computeCached(this, getFrequencyCacheKey(opts), () => {
      this.tokenize(opts);
      const frequencies = this.map((source) => {
        const tokens = getTokens(source, opts);
        const filtered = this.applyFilter(tokens, opts.filter);
        return countFrequencies(filtered);
      });
      const combined = combineFrequencies(frequencies);
      return sortByFrequency(combined);
    });
  }

  applyFilter(tokens, opts) {
    return opts && opts.stopwords ? this.filterStopwords(tokens) : tokens;
  }
}

function getTokens(source, opts = {}) {
  const attr = opts.normalize ? 'normalizedTokens' : 'tokens';
  return source.content[attr];
}

function getTokenMap(source) {
  var { tokenMap } = source.content;
  if (!tokenMap) { tokenMap = source.content.tokenMap = {}; }
  return tokenMap;
}

function getTokenStats(source, normalizedToken) {
  const tokenMap = getTokenMap(source);
  var tokenStats = tokenMap[normalizedToken];
  if (!tokenStats) { tokenStats = tokenMap[normalizedToken] = {}; }
  return tokenStats;
}

function getFrequencyCacheKey(opts) {
  var key = '_lists.frequencies';
  if (opts.normalize) { key = key + 'Normalized'; }
  if (opts.filter && opts.filter.stopWords) { key = key + 'WithoutStopwords'; }
  return key;
}

function getTokenCacheKey(opts) {
  const attr = opts.normalize ? 'normalizedTokens' : 'tokens';
  return `_lists.${attr}`;
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
