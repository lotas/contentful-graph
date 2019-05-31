const contentful = require('contentful');

/**
 * Run content types import through destributions api
 *
 *
 * @param {String} spaceId
 * @param {String} apiToken
 * @param {String} environment
 * @returns {Object} content types definitions
 */
async function getContentTypesFromDistributionApi(spaceId, apiToken, environment) {
  const client = contentful.createClient({ accessToken: apiToken, space: spaceId, environment });
  const types = await client.getContentTypes();
  return types;
}

module.exports = getContentTypesFromDistributionApi;
