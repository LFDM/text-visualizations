import * as service from '.';

describe('findIndices()', () => {
  it('finds all indices in a list of strings', () => {
    const list = ['a', 'b', 'a', 'c', 'a'];
    const expected = [0, 2, 4];
    const actual = service.findIndices(list, 'a');
    expect(actual).to.deep.equal(expected);
  });
});

describe('extractContext', () => {
  const tokens = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  it('returns a context object', () => {
    const expected = {
      before: ['a', 'b'],
      after: ['d', 'e'],
      token: 'c',
      i: 2
    };
    const actual = service.extractContext(tokens, 2, 2);
    expect(actual).to.deep.equal(expected);
  });

  it('behaves correctly when reaching the boundary before i', () => {
    const expected = {
      before: ['a'],
      after: ['c', 'd', 'e'],
      token: 'b',
      i: 1
    };
    const actual = service.extractContext(tokens, 1, 3);
    expect(actual).to.deep.equal(expected);
  });

  it('behaves correctly when reaching the boundary after i', () => {
    const expected = {
      before: ['e', 'f'],
      after: [],
      token: 'g',
      i: 6
    };
    const actual = service.extractContext(tokens, 6, 2);
    expect(actual).to.deep.equal(expected);
  });
});

describe('countFrequencies()', () => {
  it('counts occurences of tokens', () => {
    const tokens = ['a', 'b', 'a', 'a', 'b', 'c'];
    const expected = { a: 3, b: 2, c: 1 };
    const actual = service.countFrequencies(tokens);
    expect(actual).to.deep.equal(expected);
  });
});

describe('combineFrequencies()', () => {
  it('combines several frequency maps to one', () => {
    const frequencies = [
      { a: 3, b: 2, c: 1 },
      { a: 3, b: 2, c: 1, d: 1 },
      { a: 3, b: 2, c: 1 }
    ];
    const expected = { a: 9, b: 6, c: 3, d: 1 };
    const actual = service.combineFrequencies(frequencies);
    expect(actual).to.deep.equal(expected);
  });

  it('works when there is no frequency at all', () => {
    const frequencies = [];
    const expected = {};
    const actual = service.combineFrequencies(frequencies);
    expect(actual).to.deep.equal(expected);
  });

  it('works when there is only one frequency', () => {
    const frequencies = [ { a: 3, b: 2, c: 1 } ];
    const expected = { a: 3, b: 2, c: 1 };
    const actual = service.combineFrequencies(frequencies);
    expect(actual).to.deep.equal(expected);
  });
});

describe('sortByFrequency()', () => {
  it('returns a frequency dictionary sorted as array of objects', () => {
    const frequencies = { a: 2, b: 3, c: 1 };
    const expected = [
      { token: 'b', frequency: 3 },
      { token: 'a', frequency: 2 },
      { token: 'c', frequency: 1 }
    ];
    const actual = service.sortByFrequency(frequencies);
    expect(actual).to.deep.equal(expected);
  });
});
