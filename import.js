#!/usr/bin/env node

require('dotenv').config();

const contentful = require('contentful');
const getRelations = require('./src/get-relations');

const apiToken = process.env.CONTENTFUL_TOKEN;
const spaceId = process.env.CONTENTFUL_SPACE_ID;

const client = contentful.createClient({ accessToken: apiToken, space: spaceId });

async function main () {
  const types = await client.getContentTypes();

  const modelsMap = {};

  types.items.forEach(type => {

    modelsMap[type.name] = {
      fields: type.fields,
      relations: getRelations(type, types.items)
    };

  });

  console.log(JSON.stringify(modelsMap, null, 2));
}

main();
