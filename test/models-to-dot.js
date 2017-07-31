const assert = require('assert');
const fs = require('fs');
const path = require('path');

const modelsToDot = require('../src/models-to-dot')
const typesToModelMap = require('../src/types-to-model-map');

describe('modelsToDot', function () {
  const unspace = (str) => str.replace(/^\s+/mg, '');

  it('should build empty graph', function () {
    const result = modelsToDot({});
    const expected = `
digraph obj {
  node[shape=record];


}
`;

    assert.equal(unspace(result), unspace(expected), 'Graph doesnt match');
  });

  it('should render sample graph', function () {
    const sampleModel = require('./fixtures/models-photo-gallery.json');
    const expected = fs.readFileSync(path.join(__dirname, './fixtures/models-photo-gallery.dot'), 'utf-8');

    const result = modelsToDot(typesToModelMap(sampleModel), true);

    assert.equal(unspace(result), unspace(expected), 'Graph doesnt match');
  });

});