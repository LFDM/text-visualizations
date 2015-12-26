import tokenizer from '../tokenizer';

export default class VisualizationModel {
  constructor(sources) {
    this.sources = sources;
    this.tokenizer = tokenizer;
  }

  tokenize() {
    this.sources.forEach((source) => {
      const { content } = source;
      if (!content.tokens) {
        content.tokens = this.tokenizer.tokenize(content.text);
      }
    });

    return this;
  }

  getAllTokens() {
    this.tokenize();
    return this.sources.reduce((result, source) => result.concat(source.content.tokens), []);
  }
}
