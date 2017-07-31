const assert = require('assert');

const hasValues = require('../src/has-values')

describe('hasValues', function () {
  it('should return true when values are present', function() {
    assert.ok(hasValues([1,2]), 'Should have values')
    assert.ok(hasValues(["one"]), 'Should have values')
  });
  it('should return false when not array', function() {
    assert.notEqual(hasValues([]), true, 'Should not have values')
    assert.notEqual(hasValues({}), true, 'Should not have values')
    assert.notEqual(hasValues(null), true, 'Should not have values')
    assert.notEqual(hasValues(''), true, 'Should not have values')
  });
});