const {TYPE_LINK, LINK_TYPE_ASSET, LINK_TYPE_ENTRY} = require('./constants');

/**
 * Create dot representation of entities
 *
 * @param {any} models
 * @param {{hideEntityFields: Boolean, dev: Boolean}} options
 * @returns
 */
function modelsMapToDot(models, { hideEntityFields, dev } = {}) {
  const objects = {};
  const connections = [];

  const mapRelations = (displayName, src, props) => {
    Object.keys(src).forEach(srcField => {
      src[srcField].forEach(relatedEntity => {
        const portPart = hideEntityFields ? '' : `:"${srcField}"`;
        connections.push(`"${displayName}"${portPart} -> "${relatedEntity}" [${props.join(',')}];`);
      });
    });
  };

  const fieldMap = (field) => `<${field.id}> ${field.name}`;
  const fieldMapDev = (field) => `<${field.id}> [${field.id}] ${field.id}`;

  Object.keys(models).forEach(modelName => {
    const model = models[modelName];

    const fields = model.fields.map(dev ? fieldMapDev : fieldMap);

    if (hideEntityFields) {
      objects[modelName] = `"${modelName}";`;
    } else {
      objects[modelName] = `"${modelName}" [label="{${dev ? `[${model.sys.id}] ${modelName}` : modelName} |          | ${fields.join('|')}}" shape=Mrecord];`;
    }

    const rels = model.relations;
    if (rels._hasAssets) {
      objects[LINK_TYPE_ASSET] = `"${LINK_TYPE_ASSET}";`;
    }

    mapRelations(modelName, rels.one, ['dir=forward']);
    mapRelations(modelName, rels.many, ['dir=forward', 'label="0..*"']);
  });

  const dot = `
digraph obj {
  node[shape=record];

  ${Object.values(objects).join("\n  ")}

  ${connections.join("\n  ")}
}
`;

  return dot;
}

module.exports = modelsMapToDot;
