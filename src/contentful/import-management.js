const contentfulManagement = require('contentful-management');
/**
 *  @typedef {import('contentful-management').ContentType} ContentType
 *  @typedef {import('contentful-management').CollectionProp} CollectionProp
 *  @typedef {import('contentful-management').ContentTypeProps} ContentTypeProps
 */

/**
 * Run content types import through management api
 *
 *
 * @param {String} spaceId
 * @param {String} managementToken
 * @param {String} environment
 * @param {String | undefined} host
 * @returns {Promise<CollectionProp<ContentTypeProps>>} content types definitions
 */
function getContentTypesFromManagementApi(spaceId, managementToken, environment, host) {
  const client = contentfulManagement.createClient({ accessToken: managementToken, host }, {type: "plain"});
  return client.contentType.getMany({environmentId: environment, spaceId})
}

module.exports = getContentTypesFromManagementApi;
