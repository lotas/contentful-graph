#!/usr/bin/env node

require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));

const convertApi = require('./src/index');

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const apiToken = process.env.CONTENTFUL_TOKEN;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

const usageHelp = `
Usage:
Running with distribution token:
  CONTENTFUL_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ./import.js

Running with management token:
  CONTENTFUL_MANAGEMENT_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ./import.js

Available options:
  --help (-h)          Display this help
  --dev (-d)           Include developer information - field Id's and entity Id's
  --hide-fields (-h)   Hide entity fields information, show only entity names and relationships
`;


if (argv.help || argv.h) {
  console.info(usageHelp);
  process.exit(0);
}

try {
  run(spaceId, managementToken, apiToken);
} catch (err) {
  console.warn(err);
}

async function run(spaceId, managementToken, apiToken) {
  let contentTypes;

  if (managementToken) {
    contentTypes = await convertApi.getContentTypesFromManagementApi(spaceId, managementToken);
  } else if (apiToken) {
    contentTypes = await convertApi.getContentTypesFromDistributionApi(spaceId, apiToken);
  } else {
    console.log(usageHelp);
    return false;
  }

  const options = {
    hideEntityFields: argv.n || argv['no-fields'],
    dev: argv.dev || argv.d
  };

  const modelsMap = convertApi.contentTypesToModelMap(contentTypes);
  const dotStr = convertApi.modelsMapToDot(modelsMap, options);

  console.log(dotStr);
}
