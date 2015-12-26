import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(sinonChai);
chai.use(chaiAsPromised);

// Aliasing for convenience - need to wrap as fns, as describe and it will
// only be defined as globals after this script runs
global.fdescribe = (...args) => describe.only(...args);
global.fit = (...args) => it.only(...args);

global.expect = expect;

// TODO - import mock generators, need to be preprocessed as they are coffeescript
global.HELPERS = {
    sinon
};

