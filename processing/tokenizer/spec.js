import service from '.';

describe('tokenize()', () => {
  it('tokenizes a text', () => {
    const text = 'This is a test text.';
    const expected = ['This', 'is', 'a', 'test', 'text', '.'];
    const actual = service.tokenize(text);
    expect(actual).to.deep.equal(expected);
  });

  it('does this in a treebanky style', () => {
    const text = 'This isn\'t a test text.';
    const expected = ['This', 'is', 'n\'t', 'a', 'test', 'text', '.'];
    const actual = service.tokenize(text);
    expect(actual).to.deep.equal(expected);
  });
});
