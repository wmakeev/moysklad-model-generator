var assign = require('lodash.assign')

module.exports = function uuidPatch (model) {
  return assign({}, model, {
    elementInfos: model.elementInfos.concat([
      {
        "elementName": "uuid",
        "typeInfo": "String"
      },
      {
        "elementName": "id",
        "typeInfo": "String"
      }
    ])
  })
}
