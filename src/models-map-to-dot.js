const {TYPE_LINK, LINK_TYPE_ASSET, LINK_TYPE_ENTRY} = require('./constants');

function modelsMapToDot(models, showEntityFields = false) {
  const objects = {};
  const connections = [];

  const mapRelations = (displayName, src, props) => {
    Object.keys(src).forEach(srcField => {
      src[srcField].forEach(relatedEntity => {
        const portPart = showEntityFields ? `:${srcField}` : '';
        connections.push(`${displayName}${portPart} -> ${relatedEntity} [${props.join(',')}];`);
      });
    });
  };

  Object.keys(models).forEach(modelName => {
    const model = models[modelName];
    const displayName = modelName.replace(/\W/g, '');

    const fields = model.fields.map(
      field => `<${field.id}> ${field.name}`
    );

    if (showEntityFields) {
      objects[displayName] = `${displayName} [label="{${modelName} |          | ${fields.join('|')}}" shape=Mrecord];`;
    } else {
      objects[displayName] = `${displayName};`;
    }

    const rels = model.relations;
    if (rels._hasAssets) {
      objects[LINK_TYPE_ASSET] = `${LINK_TYPE_ASSET};`;
    }

    mapRelations(displayName, rels.one, ['dir=forward']);
    mapRelations(displayName, rels.many, ['dir=forward', 'label="0..*"']);
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
