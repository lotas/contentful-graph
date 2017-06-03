const {TYPE_LINK, LINK_TYPE_ASSET, LINK_TYPE_ENTRY} = require('./constants');

function modelsToDot(models, showEntityFields = false) {
  const objects = {};
  const connections = [];

  Object.keys(models).forEach(modelName => {
    const model = models[modelName];

    const displayName = modelName.replace(/\W/g, '');
    const fields = model.fields.map(
      field => `<${field.id}> ${field.name}`
    );
    if (showEntityFields) {
      objects[displayName] = `${displayName} [label="{${modelName} | +++++++++++ | ${fields.join('|')}}" shape=Mrecord];`;
    } else {
      objects[displayName] = `${displayName};`;
    }

    Object.keys(model.relations).forEach(srcField => {
      const rels = model.relations[srcField];

      rels.forEach(relatedEntity => {
        if (relatedEntity === LINK_TYPE_ASSET) {
          objects[LINK_TYPE_ASSET] = LINK_TYPE_ASSET;
        }
        connections.push(`${displayName}:${srcField} -> ${relatedEntity} [dir="forward"];`);
      });
    });
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

module.exports = modelsToDot;
