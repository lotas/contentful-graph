
const hasValues = require('./has-values');
const {
  TYPE_LINK, TYPE_RICH_TEXT, LINK_TYPE_ASSET, LINK_TYPE_ENTRY, RICH_TEXT_ENTRY_LINK_TYPES,
} = require('./constants');

function getRelations(contentType, allTypes) {
  const relations = {
    _hasAssets: false,
    one: {},
    many: {},
  };

  const allTypesSysId = allTypes ? allTypes.map(typeObj => typeObj.sys.id): [];

  const getTypeName = (searchType) => {
    const model = allTypes.filter(type => type.sys.id === searchType).pop();
    return model ? model.name : `[ Unknown type: ${searchType} ]`;
  };

  const addRelation = (relType, fieldId, linkType, validations) => {
    if (typeof relations[relType][fieldId] === 'undefined') {
      relations[relType][fieldId] = [];
    }
    if (linkType === LINK_TYPE_ASSET) {
      // eslint-disable-next-line no-underscore-dangle
      relations._hasAssets = true;
      relations[relType][fieldId].push(linkType);
    } else if (linkType === LINK_TYPE_ENTRY) {
      relations[relType][fieldId] = relations[relType][fieldId].concat(
        validations.reduce((arr, validation) => {
          if (hasValues(validation.linkContentType)) {
            return arr.concat(validation.linkContentType.map(getTypeName));
          } if (typeof validation.linkContentType === 'string') {
            return [validation.linkContentType];
          }
          return [];
        }, []),
      );
    }
  };
  const checkRichtextValidationAndAddRelations = (fieldId, richTextValidations) => {
    const editorConfig = richTextValidations.filter(validationObj => typeof validationObj.enabledNodeTypes !== 'undefined')[0];
    const nodesRestrictionConfig = richTextValidations.filter(validationObj => typeof validationObj.nodes !== 'undefined')[0];
    const doesEditorConfigRestrictAnyField = hasValues(editorConfig.enabledNodeTypes);
    const assetLinkAllowed = !doesEditorConfigRestrictAnyField || editorConfig.enabledNodeTypes.filter(it => it.includes('asset')).length > 0;
    const entryLinkAllowed = !doesEditorConfigRestrictAnyField || editorConfig.enabledNodeTypes.filter(it => it.includes('entry')).length > 0;
    const entryLinkTypes = doesEditorConfigRestrictAnyField ? editorConfig.enabledNodeTypes.filter(it => it.includes('entry')) : RICH_TEXT_ENTRY_LINK_TYPES;


    if (assetLinkAllowed) {
      addRelation('many', fieldId, LINK_TYPE_ASSET, []);
    }
    if (entryLinkAllowed) {
      const linkedEntriesAsArray = [];
      entryLinkTypes.map(
        (entryType) => {
          if (typeof nodesRestrictionConfig.nodes[entryType] !== 'undefined' && hasValues(nodesRestrictionConfig.nodes[entryType])) {
            const elementsWithKeyLinkContentType = nodesRestrictionConfig.nodes[entryType].filter(obj => Object.keys(obj).includes('linkContentType'));
            if (hasValues(elementsWithKeyLinkContentType)) {
              return elementsWithKeyLinkContentType[0].linkContentType;
            }
          }
          return allTypesSysId;
        },
      ).reduce((prev, current) => {
        current.forEach(nodeRevKey => prev.add(nodeRevKey));
        return prev;
      }, new Set())
        .forEach(linkedEntry => linkedEntriesAsArray.push(linkedEntry));
      addRelation('many', fieldId, LINK_TYPE_ENTRY, [{ linkContentType: linkedEntriesAsArray }]);
    }
  };
  // One-to-one relationships are being stored in field.validations
  // One-to-many are stored in field.items
  // BUT: This behaviour differs in RichText: The validations array defines
  // if there any restrictions, and if yes, to which elements.
  contentType.fields.forEach((field) => {
    if (hasValues(field.validations) && field.type === TYPE_LINK) {
      addRelation('one', field.id, field.linkType, field.validations);
    } else if (field.items && field.items.type === TYPE_LINK) {
      const { linkType, validations } = field.items;
      addRelation('many', field.id, linkType, validations);
    } else if (hasValues(field.validations) && field.type === TYPE_RICH_TEXT) {
      checkRichtextValidationAndAddRelations(field.id, field.validations);
    }
  });

  return relations;
}

module.exports = getRelations;
