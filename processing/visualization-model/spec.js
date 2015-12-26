/* eslint-disable no-unused-expressions */

const { sinon } = HELPERS;

import VisualizationModel from '.';

var model, sources;

beforeEach(function() {
  sources = [
    {
      meta: {
        by: {
          name: 'GH'
        }
      },
      content: {
        text: 'This is the first test text.'
      }
    },
    {
      meta: {
        by: {
          name: 'RW'
        }
      },
      content: {
        text: 'This is the second test text.'

      }
    },
    {
      meta: {
        by: {
          name: 'SF'
        }
      },
      content: {
        text: 'This is the third of the test texts.'
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
    model.tokenizer = {
      tokenize: sinon.stub().returns([])
    };
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
    expect(model.tokenizer.tokenize).to.have.callCount(sources.length);
  });

  it('does not retokenize when tokenization has already been performed', () => {
    model.tokenize();
    model.tokenize();
    expect(model.tokenizer.tokenize).to.have.callCount(sources.length);
  });

  it('returns itself for easier chaining', () => {
    const actual = model.tokenize();
    expect(actual).to.equal(model);
  });
});
