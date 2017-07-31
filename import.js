#!/usr/bin/env node

require('dotenv').config();

const convertApi = require('./src/index')

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const apiToken = process.env.CONTENTFUL_TOKEN;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

const usageHelp = `
Usage:
Running with distribution token:
  CONTENTFUL_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ./import.js

Running with management token:
  CONTENTFUL_MANAGEMENT_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ./import.js
`;

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

  const modelsMap = convertApi.contentTypesToModelMap(contentTypes);
  const dotStr = convertApi.modelsMapToDot(modelsMap, true);

  console.log(dotStr);
}
