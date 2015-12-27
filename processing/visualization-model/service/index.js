import { get, set } from 'lodash';

export {
  findIndices,
  extractContext,
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
