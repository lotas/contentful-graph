const {TYPE_LINK, LINK_TYPE_ASSET, LINK_TYPE_ENTRY} = require('./constants');

function getRelations(contentType, allTypes) {
  const relations = {};

  const getTypeName = (searchType) => {
    return allTypes.filter(type => type.sys.id === searchType)[0].name;
  };

  contentType.fields.forEach(field => {
    if (field.items) {
      const {type, linkType, validations } = field.items;

      if (type !== TYPE_LINK) {
        return;
      }

      if (linkType === LINK_TYPE_ASSET) {
        relations[field.id] = [linkType];
      } else if (linkType === LINK_TYPE_ENTRY) {
        relations[field.id] = validations.reduce((arr, validation) => {
          return arr.concat(validation.linkContentType.map(getTypeName))
        }, []);
      }
    }
  });

  return relations;
}

module.exports = getRelations;