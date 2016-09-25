var assign = require('lodash.assign')

module.exports = function errorPatch (schema) {
  return assign({}, schema, {

    elementInfos: schema.elementInfos.map(function (elInfo) {
      return elInfo.elementName === 'collection'
        ? { 'elementName': 'collection', 'typeInfo': 'moysklad.collection' }
        : elInfo
    }),

    typeInfos: schema.typeInfos.concat([{
      'type': 'classInfo',
      'localName': 'collection',
      'propertyInfos': [
        {
          'type': 'attribute',
          'name': 'total',
          'typeInfo': 'Int'
        },
        {
          'type': 'attribute',
          'name': 'start',
          'typeInfo': 'Int'
        },
        {
          'type': 'attribute',
          'name': 'count',
          'typeInfo': 'Int'
        }
      ],
      'baseTypeInfo': 'moysklad.collectionContainer'
    }])
  })
}

