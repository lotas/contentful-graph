const assert = require('assert');

const getRelations = require('../src/get-relations')

describe('getRelations', function () {
  it('should return defined structure', function () {
    const data = {
      fields: []
    };
    const expected = {
      _hasAssets: false,
      one: [],
      many: []
    }

    assert.deepEqual(getRelations(data), expected, 'Invalid structure')
  })
});