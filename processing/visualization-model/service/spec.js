import service from '.';

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
