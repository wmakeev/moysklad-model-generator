var assign = require('lodash.assign')

module.exports = function uuidPatch (schema) {
  return assign({}, schema, {
    elementInfos: schema.elementInfos.concat([
      {
        'elementName': 'uuid',
        'typeInfo': 'ID'
      },
      {
        'elementName': 'id',
        'typeInfo': 'ID'
      }
    ])
  })
}
