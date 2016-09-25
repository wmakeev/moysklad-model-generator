var assign = require('lodash.assign')

module.exports = function errorPatch (schema) {
  return assign({}, schema, {

    elementInfos: schema.elementInfos.concat([{
      'elementName': 'error',
      'typeInfo': 'moysklad.error'
    }]),

    typeInfos: schema.typeInfos.concat([{
      'type': 'classInfo',
      'localName': 'error',
      'propertyInfos': [
        {
          'type': 'element',
          'name': 'uid',
          'typeInfo': 'String'
        },
        {
          'type': 'element',
          'name': 'moment',
          'typeInfo': 'String'
        },
        {
          'type': 'element',
          'name': 'message',
          'typeInfo': 'String'
        },
        {
          'type': 'element',
          'name': 'stack',
          'typeInfo': 'String'
        }
      ]
    }])
  })
}
