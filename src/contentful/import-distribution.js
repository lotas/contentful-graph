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
  const space = await client.getSpace(spaceId);
  const env = await space.getEnvironment(environment);
  const types = await env.getContentTypes();
  return types;
}

module.exports = getContentTypesFromDistributionApi;
