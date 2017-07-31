'use strict';

module.exports.getContentTypesFromManagementApi = require('./contentful/import-management');
module.exports.getContentTypesFromDistributionApi = require('./contentful/import-distribution');

module.exports.contentTypesToModelMap = require('./content-types-to-model-map');
module.exports.modelsMapToDot = require('./models-map-to-dot');

