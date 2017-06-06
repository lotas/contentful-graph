#!/usr/bin/env node

require('dotenv').config();

const contentful = require('contentful');
const contentfulManagement = require('contentful-management');
const getRelations = require('./src/get-relations');
const modelsToDot = require('./src/models-to-dot');

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const apiToken = process.env.CONTENTFUL_TOKEN;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (managementToken) {
  runManagementImport();
} else if (apiToken) {
  runDistributionImport();
} else {
  console.log(`
Usage:
Running with distribution token:
  CONTENTFUL_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ./import.js

Running with management token:
  CONTENTFUL_MANAGEMENT_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ./import.js
`)
}

async function runDistributionImport () {
  const client = contentful.createClient({ accessToken: apiToken, space: spaceId });
  const types = await client.getContentTypes();

  const modelsMap = typesToModelMap(types);
  console.log(modelsToDot(modelsMap, true));
}

async function runManagementImport () {
  const client = contentfulManagement.createClient({ accessToken: managementToken });

  const space = await client.getSpace(spaceId);
  const types = await space.getContentTypes();

  const modelsMap = typesToModelMap(types);
  console.log(modelsToDot(modelsMap, true));
}

function typesToModelMap(types) {
  const modelsMap = {};

  types.items.forEach(type => {

    modelsMap[type.name] = {
      fields: type.fields,
      relations: getRelations(type, types.items)
    };

  });

  return modelsMap;
}