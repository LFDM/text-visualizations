import service from '.';

describe('filter', () => {
  describe('filterStopwords', () => {
    it('filters arrays', () => {
      const array = ['a', 'teddy', 'is', 'cute', '.'];
      const expected = ['teddy', 'cute'];
      const actual = service.filterStopwords(array);
      expect(actual).to.deep.equal(expected);
    });

    it('filters dictionaries', () => {
      const dict = { a: 1, teddy: 5, is: 3, cute: 2 };
      const expected = { teddy: 5, cute: 2 };
      const actual = service.filterStopwords(dict);
      expect(actual).to.deep.equal(expected);
    });
  });
});
