import { get, set, forEach } from 'lodash';

export {
  findIndices,
  extractContext,
  countFrequencies,
  combineFrequencies,
  computeCached,
  delegate
};

function findIndices(tokens, token) {
  const result = [];
  for (var i = 0; i < tokens.length; i++) {
    if (token === tokens[i]) { result.push(i); }
  }
  return result;
}

function extractContext(tokens, i, contextSize) {
  const maxEnd = tokens.length - 1;
  const lowerEnd = i;
  const upperStart = i + 1;
  const lowerStart = lowerEnd - contextSize;
  const upperEnd = upperStart + contextSize;
  const lowerBoundary = lowerStart < 0 ? 0 : lowerStart;
  const upperBoundary = upperEnd > maxEnd ? maxEnd : upperEnd;

  const before = tokens.slice(lowerBoundary, lowerEnd);
  const after = tokens.slice(upperStart, upperBoundary);
  const token = tokens[i];
  return { before, after, token, i };
}

function countFrequencies(tokens) {
  return tokens.reduce((mem, token) => {
    const count = mem[token] || 0;
    mem[token] = count + 1;
    return mem;
  }, {});
}

function combineFrequencies(frequencies) {
  const total = frequencies.length;
  if (!total) { return {}; }
  if (total === 1) { return frequencies[0]; }

  const start = frequencies.pop();
  return frequencies.reduce((mem, frequency) => {
    forEach(frequency, (count, token) => {
      const originalCount = mem[token] || 0;
      mem[token] = originalCount + count;
    });
    return mem;
  }, start);
}

function computeCached(instance, path, fn) {
  if (!get(instance, path)) {
    set(instance, path, fn());
  }
  return get(instance, path);
}

// this will be a decorator once babel 6 supports them again
function delegate(instance, target, delegators) {
  delegators.forEach((delegator) => {
    instance[delegator] = function(...args) {
      return instance[target][delegator](...args);
    };
  });
}
