const contentfulManagement = require('contentful-management');

/**
 * Run content types import through management api
 *
 *
 * @param {String} spaceId
 * @param {String} managementToken
 * @param {String} environment
 * @returns {Object} content types definitions
 */
async function getContentTypesFromManagementApi(spaceId, managementToken, environment) {
  const client = contentfulManagement.createClient({ accessToken: managementToken });
  const space = await client.getSpace(spaceId);
  const env = await space.getEnvironment(environment);
  return env.getContentTypes();
}

module.exports = getContentTypesFromManagementApi;
