const contentful = require('contentful');

/** @typedef {import('contentful').ContentTypeCollection} ContentTypeCollection */

/**
 * Run content types import through distributions api
 *
 *
 * @param {String} spaceId
 * @param {String} apiToken
 * @param {String} environment
 * @param {String | undefined} host
 * @returns {Promise<ContentTypeCollection>} content types definitions
 */
function getContentTypesFromDistributionApi(spaceId, apiToken, environment, host) {
  const client = contentful.createClient({ accessToken: apiToken, space: spaceId, environment, host });
  return client.getContentTypes();
}

module.exports = getContentTypesFromDistributionApi;
