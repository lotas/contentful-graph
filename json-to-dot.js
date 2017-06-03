#!/usr/bin/env node

const modelsToDot = require('./src/models-to-dot');

const fileName = process.argv[2] || './models.json';
const models = require(fileName);

console.log(
  modelsToDot(models, true)
);
