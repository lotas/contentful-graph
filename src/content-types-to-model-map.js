const getRelations = require('./get-relations');

/**
 * Convert Contentful model types definitions to a structure
 * that contains "relations" property, which can be used to build
 * dependency graph
 *
 * @param {any} types
 * @returns
 */
function contentTypesToModelMap(types) {
  const modelsMap = {};

  types.items.forEach((type) => {
    modelsMap[type.sys.id] = {
      name: type.name,
      fields: type.fields,
      relations: getRelations(type, types.items),
      sys: type.sys,
    };
  });

  return modelsMap;
}

module.exports = contentTypesToModelMap;
