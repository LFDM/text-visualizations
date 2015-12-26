export default {
  findIndices,
  extractContext
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

