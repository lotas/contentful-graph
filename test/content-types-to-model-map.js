const assert = require('assert');
const fs = require('fs');
const path = require('path');

const convertApi = require('../src/index');

describe('typesToModelMap', function () {
  it('should build empty relations', function () {
    const emptyTypes = {
      items: []
    };

    assert.deepEqual(convertApi.contentTypesToModelMap(emptyTypes), {}, 'Model not empty');
  });
});
