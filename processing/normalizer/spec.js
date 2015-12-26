import service from '.';

describe('normalizer', () => {
  it('produces a trimmed and lowercased token I', () => {
    const expected = 'this';
    const actual = service.normalize('This');
    expect(actual).to.equal(expected);
  });

  it('produces a trimmed and lowercased token II', () => {
    const expected = 'this';
    const actual = service.normalize(' This  ');
    expect(actual).to.equal(expected);
  });

  it('produces a trimmed and lowercased token II', () => {
    const expected = 'this';
    const actual = service.normalize('this');
    expect(actual).to.equal(expected);
  });
});
