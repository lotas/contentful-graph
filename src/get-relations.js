const hasValues = require('./has-values');
const { TYPE_LINK, LINK_TYPE_ASSET, LINK_TYPE_ENTRY } = require('./constants');


function getRelations(contentType, allTypes) {
  const relations = {
    _hasAssets: false,
    one: [],
    many: []
  };

  const getTypeName = (searchType) => {
    const result = allTypes.filter(type => type.sys.id === searchType);
    return `${result[0].name}\n(${searchType})`;
  };

  const addRelation = (relType, fieldId, linkType, validations) => {
    if (linkType === LINK_TYPE_ASSET) {
      relations._hasAssets = true;
      relations[relType][fieldId] = [linkType];
    } else if (linkType === LINK_TYPE_ENTRY) {
      relations[relType][fieldId] = validations.reduce((arr, validation) => {
        if (hasValues(validation.linkContentType)) {
          return arr.concat(validation.linkContentType.map(getTypeName));
        } else if (typeof validation.linkContentType === 'string') {
          return [validation.linkContentType];
        }
        return [];
      }, []);
    }
  }

  // One-to-one relationships are being stored in field.validations
  // One-to-many are stored in field.items
  contentType.fields.forEach(field => {
    if (hasValues(field.validations) && field.type === TYPE_LINK) {
      addRelation('one', field.id, field.linkType, field.validations);
    } else if (field.items && field.items.type === TYPE_LINK) {
      const { type, linkType, validations } = field.items;
      debugger;
      addRelation('many', field.id, linkType, validations);
    }
  });

  return relations;
}

module.exports = getRelations;