const assert = require('assert');

const getRelations = require('../src/get-relations');

describe('getRelations', () => {
  it('should return defined structure', () => {
    const data = {
      fields: [],
    };
    const expected = {
      _hasAssets: false,
      one: {},
      many: {},
    };

    assert.deepStrictEqual(getRelations(data), expected, 'Invalid structure');
  });

  it('should link to all assets / metadata if a RichText field does not contain any restrictions', () => {
    const contentType = {
      id: 'modelWithWildcardRichText',
      type: 'ContentType',
      displayField: 'title',
      name: 'Model with wildcard richtext',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: true,
          required: true,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'enableEverythingRichText',
          name: 'Enable Everything RichText',
          type: 'RichText',
          validations: [
            {
              nodes: {},
            },
          ],
        },
      ],
    };
    const allItems = [{
      sys: {
        id: 'foreignModel',
      },
      name: 'foreign Model',
    },
    {
      sys: {
        id: 'modelWithWildcardRichText',
      },
      name: 'Model with wildcard richtext',
    }];
    const expected = {
      _hasAssets: true,
      one: {},
      many: {
        enableEverythingRichText: ['Asset', 'foreignModel', 'modelWithWildcardRichText'],
      },
    };
    assert.deepStrictEqual(getRelations(contentType, allItems), expected, 'Does not link to all types');
  });

  it('should not link to any assets if a RichText definition disabled nodes', () => {
    const contentType = {
      id: 'noLinkAndJustSomeFormattingMarksModel',
      type: 'ContentType',
      displayField: 'title',
      name: 'Model with no links and just some formatting marks in RichText',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: true,
          required: true,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'justFormattingMarksNoLinks',
          name: 'Just Formatting Marks no Links',
          type: 'RichText',
          validations: [
            {
              enabledMarks: [
                'bold',
                'italic',
                'underline',
              ],
              message: 'Only bold, italic, and underline marks are allowed',
            },
            {
              enabledNodeTypes: [],
              message: 'Nodes are not allowed',
            },
            {
              nodes: {},
            },
          ],
        },
      ],
    };
    const allItems = [{
      sys: {
        id: 'foreignModel',
      },
      name: 'foreign Model',
    },
    {
      sys: {
        id: 'noLinkAndJustSomeFormattingMarksModel',
      },
      name: 'Model with no links and just some formatting marks in RichText',
    }];
    const expected = {
      _hasAssets: false,
      one: {},
      many: {},
    };
    assert.deepStrictEqual(getRelations(contentType, allItems), expected, 'Did wrongly link to any asset / entry');
  });

  it('should only link to assets if no entry links are allowed', () => {
    const contentType = {
      id: 'modelWithRichText',
      type: 'ContentType',
      displayField: 'title',
      name: 'Model with richtext',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: true,
          required: true,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'richText',
          name: 'RichText',
          type: 'RichText',
          validations: [
            { nodes: {} },
            {
              enabledNodeTypes: ['embedded-asset-block', 'asset-hyperlink'],
            },
          ],
        },
      ],
    };
    const allItems = [{
      sys: {
        id: 'foreignModel',
      },
      name: 'foreign Model',
    },
    {
      sys: {
        id: 'modelWithWildcardRichText',
      },
      name: 'Model with wildcard richtext',
    }];
    const expected = {
      _hasAssets: true,
      one: {},
      many: {
        richText: ['Asset'],
      },
    };
    assert.deepStrictEqual(getRelations(contentType, allItems), expected, 'Does not link to assets or link to entries');
  });

  it('should link to all entries but not assets, if assets are not allowed and entries not restricted', () => {
    const contentType = {
      id: 'modelWithRichText',
      type: 'ContentType',
      displayField: 'title',
      name: 'Model with richtext',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: true,
          required: true,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'richText',
          name: 'RichText',
          type: 'RichText',
          validations: [
            { nodes: {} },
            {
              enabledNodeTypes: ['embedded-entry-block', 'embedded-entry-inline'],
            },
          ],
        },
      ],
    };
    const allItems = [{
      sys: {
        id: 'foreignModel',
      },
      name: 'foreign Model',
    },
    {
      sys: {
        id: 'modelWithRichText',
      },
      name: 'Model with richtext',
    }];
    const expected = {
      _hasAssets: false,
      one: {},
      many: {
        richText: ['foreignModel', 'modelWithRichText'],
      },
    };
    assert.deepStrictEqual(getRelations(contentType, allItems), expected, 'Does not link to assets or link to entries');
  });

  it('should reflect node restrictions to entry types', () => {
    const contentType = {
      id: 'modelWithRichText',
      type: 'ContentType',
      displayField: 'title',
      name: 'Model with richtext',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: true,
          required: true,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'richText',
          name: 'RichText',
          type: 'RichText',
          validations: [
            {
              nodes: {
                'embedded-entry-block': [{ linkContentType: ['foreignModel'] }],
                'embedded-entry-inline': [{ linkContentType: ['foreignModel'] }],
              },
            },
            {
              enabledNodeTypes: ['embedded-entry-block', 'embedded-entry-inline'],
            },
          ],
        },
      ],
    };
    const allItems = [{
      sys: {
        id: 'foreignModel',
      },
      name: 'foreign Model',
    }, {
      sys: {
        id: 'anotherModel',
      },
      name: 'another Model',
    },
    {
      sys: {
        id: 'modelWithRichText',
      },
      name: 'Model with richtext',
    }];
    const expected = {
      _hasAssets: false,
      one: {},
      many: {
        richText: ['foreignModel'],
      },
    };
    assert.deepStrictEqual(getRelations(contentType, allItems), expected, 'Does not only link to foreignModel');
  });
});
