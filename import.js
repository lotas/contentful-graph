#!/usr/bin/env node

require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const convertApi = require('./src/index');

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const apiToken = process.env.CONTENTFUL_TOKEN;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';

const cmd = process.argv[1].split('/').pop();
const usageHelp = `
Usage:
Running with distribution token:
  CONTENTFUL_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ${cmd}

Running with management token:
  CONTENTFUL_MANAGEMENT_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ${cmd}

Running in different environment:
  CONTENTFUL_ENVIRONMENT_ID=xxx CONTENTFUL_MANAGEMENT_TOKEN=xxx CONTENTFUL_SPACE_ID=yyy ${cmd}

Importing from local json file:
  ${cmd} ./path/to/model.json

Available options:
  --help (-h)          Display this help
  --dev (-d)           Include developer information - field Id's and entity Id's
  --no-fields (-n)     Hide entity fields information, show only entity names and relationships
`;

if (argv.help || argv.h) {
  console.info(usageHelp);
  process.exit(0);
}

try {
  run(spaceId, managementToken, apiToken, environmentId);
} catch (err) {
  console.warn(err);
}

async function run(spaceId, managementToken, apiToken, env) {
  let contentTypes;

  if (argv._.length === 1) {
    contentTypes = JSON.parse(fs.readFileSync(argv._[0], 'utf8'));
  } else if (managementToken) {
    contentTypes = await convertApi.getContentTypesFromManagementApi(spaceId, managementToken, env);
  } else if (apiToken) {
    contentTypes = await convertApi.getContentTypesFromDistributionApi(spaceId, apiToken, env);
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
