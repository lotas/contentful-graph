const assert = require('assert');
const fs = require('fs');
const path = require('path');

const convertApi = require('../src/index')

describe('modelsToDot', function () {
  const unspace = (str) => str.replace(/^\s+/mg, '');

  it('should build empty graph', function () {
    const result = convertApi.modelsMapToDot({});
    const expected = `
digraph obj {
  node[shape=record];


}
`;

    assert.equal(unspace(result), unspace(expected), 'Graph doesnt match');
  });

  it('should render sample graph with fields', function () {
    const sampleModel = require('./fixtures/models-photo-gallery.json');
    const expected = fs.readFileSync(path.join(__dirname, './fixtures/models-photo-gallery.dot'), 'utf-8');

    const modelMap = convertApi.contentTypesToModelMap(sampleModel);
    const result = convertApi.modelsMapToDot(modelMap, {
      hideEntityFields: false
    });

    assert.equal(unspace(result), unspace(expected), 'Graph doesnt match');
  });

  it('should render sample graph with dev information', function () {
    const sampleModel = require('./fixtures/models-photo-gallery.json');
    const expected = fs.readFileSync(path.join(__dirname, './fixtures/models-photo-gallery-dev.dot'), 'utf-8');

    const modelMap = convertApi.contentTypesToModelMap(sampleModel);
    const result = convertApi.modelsMapToDot(modelMap, {
      hideEntityFields: false,
      dev: true
    });

    assert.equal(unspace(result), unspace(expected), 'Graph doesnt match');
  });

  it('should render sample graph without fields', function () {
    const sampleModel = require('./fixtures/models-photo-gallery.json');
    const expected = fs.readFileSync(path.join(__dirname, './fixtures/models-photo-gallery-nofields.dot'), 'utf-8');

    const modelMap = convertApi.contentTypesToModelMap(sampleModel);
    const result = convertApi.modelsMapToDot(modelMap, {
      hideEntityFields: true
    });

    assert.equal(unspace(result), unspace(expected), 'Graph doesnt match');
  });

});
