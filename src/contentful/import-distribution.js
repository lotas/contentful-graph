const contentful = require('contentful');

/**
 * Run content types import through destributions api
 *
 *
 * @param {String} spaceId
 * @param {String} apiToken
 * @returns {Object} content types definitions
 */
async function getContentTypesFromDistributionApi(spaceId, apiToken) {
  const client = contentful.createClient({ accessToken: apiToken, space: spaceId });
  const types = await client.getContentTypes();

  return types;
}

module.exports = getContentTypesFromDistributionApi;
