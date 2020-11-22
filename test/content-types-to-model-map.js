const assert = require('assert');

const convertApi = require('../src/index');

describe('typesToModelMap', () => {
  it('should build empty relations', () => {
    const emptyTypes = {
      items: [],
    };

    assert.deepEqual(convertApi.contentTypesToModelMap(emptyTypes), {}, 'Model not empty');
  });
});
