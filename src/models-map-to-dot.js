const {
  // TYPE_LINK,
  LINK_TYPE_ASSET,
  // LINK_TYPE_ENTRY
} = require('./constants');

const colors = [
  '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9',
];

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
    Object.keys(src).forEach((srcField, index) => {
      src[srcField].forEach((relatedEntity) => {
        const color = colors[index % colors.length];
        const portPart = hideEntityFields ? '' : `:"${srcField}"`;
        connections.push(`edge [color="${color}"];\n  "${displayName}"${portPart} -> "${relatedEntity}" [${props.join(',')}];`);
      });
    });
  };

  const fieldMap = field => `<${field.id}> ${field.name}`;
  const fieldMapDev = field => `<${field.id}> [${field.id}] ${field.id}`;

  Object.keys(models).forEach((modelName) => {
    const model = models[modelName];

    const fields = model.fields.map(dev ? fieldMapDev : fieldMap);

    if (hideEntityFields) {
      objects[modelName] = `"${modelName}";`;
    } else {
      objects[modelName] = `"${modelName}" [label="{${
        dev ? `[${model.sys.id}] ${modelName}` : modelName
      } |          | ${fields.join('|').replace(/"/g, "'")}}" shape=Mrecord];`;
    }

    const rels = model.relations;
    // eslint-disable-next-line no-underscore-dangle
    if (rels._hasAssets) {
      objects[LINK_TYPE_ASSET] = `"${LINK_TYPE_ASSET}";`;
    }

    mapRelations(modelName, rels.one, ['dir=forward']);
    mapRelations(modelName, rels.many, ['dir=forward', 'label="0..*"']);
  });

  const dot = `
digraph obj {
  node[shape=record];

  ${Object.values(objects).join('\n  ')}

  ${connections.join('\n  ')}
}
`;

  return dot;
}

module.exports = modelsMapToDot;
