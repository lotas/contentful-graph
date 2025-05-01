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

  const allTypesSysId = allTypes ? allTypes.map((typeObj) => typeObj.sys.id) : [];

  const getTypeId = (searchType) => {
    const model = allTypes.filter((type) => type.sys.id === searchType).pop();
    return model ? model.sys.id : `[ Unknown type: ${searchType} ]`;
  };

  const addRelation = (relType, fieldId, linkType, validations) => {
    if (typeof relations[relType][fieldId] === 'undefined') {
      relations[relType][fieldId] = [];
    }
    if (linkType === LINK_TYPE_ASSET) {
       
      relations._hasAssets = true;
      relations[relType][fieldId].push(linkType);
    } else if (linkType === LINK_TYPE_ENTRY) {
      relations[relType][fieldId] = relations[relType][fieldId].concat(
        validations.reduce((arr, validation) => {
          if (hasValues(validation.linkContentType)) {
            return arr.concat(validation.linkContentType.map(getTypeId));
          } if (typeof validation.linkContentType === 'string') {
            return [validation.linkContentType];
          }
          return [];
        }, []),
      );
    }
  };
  const checkRichTextValidationAndAddRelations = (fieldId, richTextValidations) => {
    const nodeTypesEditorConfig = richTextValidations.filter((validationObj) => typeof validationObj.enabledNodeTypes !== 'undefined')[0];
    const nodesRestrictionConfig = richTextValidations.filter((validationObj) => typeof validationObj.nodes !== 'undefined')[0];
    /**
     *
     * @param {string} entryLinkType
     * @returns {string[] | undefined}
     */
    const getNodeRestrictionForEntryLinkType = (entryLinkType) => {
      const entryLinkTypeRestrictionsArray = nodesRestrictionConfig.nodes[entryLinkType];
      if (typeof entryLinkTypeRestrictionsArray === 'undefined') {
        return undefined;
      }
      const restrictionConfig = entryLinkTypeRestrictionsArray.filter((obj) => Object.keys(obj).includes('linkContentType'))[0];
      if (typeof restrictionConfig !== 'undefined') {
        return restrictionConfig.linkContentType;
      }
      return undefined;
    };
    // Either the object with field enabledNodeTypes
    // does not exists or the allowed node types are not empty
    const doesEditorConfigAllowNodes = typeof nodeTypesEditorConfig === 'undefined' || hasValues(nodeTypesEditorConfig.enabledNodeTypes);
    if (!doesEditorConfigAllowNodes) {
      //
      return;
    }
    const doesEditorConfigRestrictAnyField = typeof nodeTypesEditorConfig !== 'undefined' && hasValues(nodeTypesEditorConfig.enabledNodeTypes);
    const assetLinkAllowed = !doesEditorConfigRestrictAnyField || nodeTypesEditorConfig.enabledNodeTypes.filter((it) => it.includes('asset')).length > 0;
    const entryLinkAllowed = !doesEditorConfigRestrictAnyField || nodeTypesEditorConfig.enabledNodeTypes.filter((it) => it.includes('entry')).length > 0;
    const entryLinkTypes = doesEditorConfigRestrictAnyField ? nodeTypesEditorConfig.enabledNodeTypes.filter((it) => it.includes('entry')) : RICH_TEXT_ENTRY_LINK_TYPES;

    if (assetLinkAllowed) {
      addRelation('many', fieldId, LINK_TYPE_ASSET, []);
    }
    if (entryLinkAllowed) {
      const linkedEntriesAsArray = [];
      entryLinkTypes.map(
        (entryType) => {
          const getContentRestrictionList = getNodeRestrictionForEntryLinkType(entryType);
          if (typeof getContentRestrictionList === 'undefined') {
            return allTypesSysId;
          }
          return getContentRestrictionList;
        },
      ).reduce((prev, current) => {
        current.forEach((nodeRevKey) => prev.add(nodeRevKey));
        return prev;
      }, new Set())
        .forEach((linkedEntry) => linkedEntriesAsArray.push(linkedEntry));
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
      checkRichTextValidationAndAddRelations(field.id, field.validations);
    }
  });

  return relations;
}

module.exports = getRelations;
