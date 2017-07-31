const getRelations = require('./get-relations');

/**
 * Convert Contentful model types definitions to a structure
 * that contains "relations" property, which can be used to build
 * dependency graph
 *
 * @param {any} types
 * @returns
 */
function typesToModelMap(types) {
  const modelsMap = {};

  types.items.forEach(type => {

    modelsMap[type.name] = {
      fields: type.fields,
      relations: getRelations(type, types.items)
    };

  });

  return modelsMap;
}

module.exports = typesToModelMap;