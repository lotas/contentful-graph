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
  const sanitizeNamesForLabelInDot = (nameToSanitize) => nameToSanitize.replace(/([<>\\|])/g, '\\$&');
  const objects = {};
  const connections = [];

  const mapRelations = (modelSysId, src, props) => {
    Object.keys(src).forEach((srcField, index) => {
      src[srcField].forEach((relatedEntity) => {
        const color = colors[index % colors.length];
        const portPart = hideEntityFields ? '' : `:"${srcField}"`;
        connections.push(`edge [color="${color}"];\n  "${modelSysId}"${portPart} -> "${relatedEntity}" [${props.join(',')}];`);
      });
    });
  };

  const fieldMap = (field) => `<${field.id}> ${sanitizeNamesForLabelInDot(field.name)}`;
  const fieldMapDev = (field) => `<${field.id}> [${field.id}] ${sanitizeNamesForLabelInDot(field.name)}`;

  Object.keys(models).forEach((modelsSysId) => {
    const model = models[modelsSysId];
    const modelName = sanitizeNamesForLabelInDot(model.name);

    const fields = model.fields.map(dev ? fieldMapDev : fieldMap);

    if (hideEntityFields) {
      objects[modelsSysId] = `"${modelsSysId}";`;
    } else {
      objects[modelsSysId] = `"${modelsSysId}" [label="{${
        dev ? `[${model.sys.id}] ${modelName}` : modelName
      } |          | ${fields.join('|').replace(/"/g, "'")}}" shape=Mrecord];`;
    }

    const rels = model.relations;
    // eslint-disable-next-line no-underscore-dangle
    if (rels._hasAssets) {
      objects[LINK_TYPE_ASSET] = `"${LINK_TYPE_ASSET}";`;
    }

    mapRelations(modelsSysId, rels.one, ['dir=forward']);
    mapRelations(modelsSysId, rels.many, ['dir=forward', 'label="0..*"']);
  });

  return `
digraph obj {
  node[shape=record];

  ${Object.values(objects)
    .join('\n  ')}

  ${connections.join('\n  ')}
}
`;
}

module.exports = modelsMapToDot;
