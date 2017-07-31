const assert = require('assert');
const fs = require('fs');
const path = require('path');

const typesToModelMap = require('../src/types-to-model-map');

describe('typesToModelMap', function () {
  it('should build empty relations', function () {
    const emptyTypes = {
      items: []
    };

    assert.deepEqual(typesToModelMap(emptyTypes), {}, 'Model not empty');
  });
});