/* eslint-disable no-unused-expressions */

const { sinon } = HELPERS;

import VisualizationModel from '.';

var model, sources;

describe('VisualizationModel', () => {
  beforeEach(function() {
    sources = [
      {
        meta: {
          by: {
            name: 'GH'
          }
        },
        content: {
          text: 'This is the first test Text. A second sentence is present here, but no third.'
        }
      },
      {
        meta: {
          by: {
            name: 'RW'
          }
        },
        content: {
          text: 'This is the second of the test texts. A second sentence is present here, but not a third.'

        }
      },
      {
        meta: {
          by: {
            name: 'SF'
          }
        },
        content: {
          text: 'This is the third test text. A second sentence is present is this text. Also a third.'
        }
      }
    ];
    model = new VisualizationModel(sources);
  });

  describe('constructor', () => {
    it('provides a model object with sources', () => {
      expect(model.sources).to.equal(sources);
    });
  });

  describe('tokenize()', () => {
    beforeEach(function() {
      model = new VisualizationModel(sources, {
        tokenizer: {
          tokenize: sinon.stub().returns(['', '', ''])
        },
        normalizer: {
          normalize: sinon.stub().returns('')
        }
      });
    });

    it('tokenizes all source objects', () => {
      model.tokenize();

      sources.forEach(expectTokenization);

      function expectTokenization(source) {
        expect(source.content.tokens).to.be;
      }
    });

    it('uses the tokenizer service', () => {
      model.tokenize();
      expect(model._tokenizer.tokenize).to.have.callCount(sources.length);
    });

    it('does not retokenize when tokenization has already been performed', () => {
      model.tokenize();
      model.tokenize();
      expect(model._tokenizer.tokenize).to.have.callCount(sources.length);
    });

    it('returns itself for easier chaining', () => {
      const actual = model.tokenize();
      expect(actual).to.equal(model);
    });

    it('does not run normalizer by default', () => {
      model.tokenize();
      expect(model._normalizer.normalize).not.to.have.been.called;
    });

    it('runs with normalizer with options { normalize: true }', () => {
      model.tokenize({ normalize: true });
      expect(model._normalizer.normalize).to.have.been.called;
    });

    it('does not run normalizer twice', () => {
      model.tokenize({ normalize: true });
      model._normalizer.normalize.reset();

      model.tokenize({ normalize: true });
      expect(model._normalizer.normalize).not.to.have.been.called;
    });
  });

  describe('getAllTokens()', () => {
    it('returns a list of all tokens from all sources', () => {
      const tokens = model.getAllTokens();
      const count = model.reduce((sum, source) => sum + source.content.tokens.length, 0);
      expect(tokens).to.have.length(count);
    });

    it('executes tokenize()', () => {
      model.tokenize = sinon.stub().returns(model);
      model.getAllTokens();
      expect(model.tokenize).to.have.been.calledOnce;
    });

    it('does not execute tokenize twice', () => {
      model.tokenize = sinon.stub().returns(model);
      model.getAllTokens();
      model.getAllTokens();
      expect(model.tokenize).to.have.been.calledOnce;
    });

    it('can return a normalized list by passing { normalize: true }', () => {
      const opts = { normalize: true };
      model.tokenize = sinon.stub().returns(model);
      model.getAllTokens(opts);
      expect(model.tokenize).to.have.been.calledWith(opts);
    });
  });

  describe('normalize()', () => {
    it('delegates to the normalizer', () => {
      const token = 'xxx';
      const fakeReturn = 'yyy';
      model = new VisualizationModel([], {
        normalizer: { normalize: sinon.stub().returns(fakeReturn) }
      });

      const actual = model.normalize(token);
      expect(model._normalizer.normalize).to.have.been.called;
      expect(actual).to.equal(fakeReturn);
    });
  });

  describe('getContexts', () => {
    it('takes a token and returns all context items', () => {
      const contexts = model.getContexts('text');
      expect(contexts).to.have.length(3);
    });
  });

  describe('getFrequencies()', () => {
    xit('returns a frequency object', () => {
      const frequencies = model.getFrequencies({ normalize: true });
      const expected = [];
      expect(frequencies).to.deep.equal(expected);
    });
  });
});

