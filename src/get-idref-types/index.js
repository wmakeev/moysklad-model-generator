'use strict'

var assign = require('lodash.assign')
var stringify = require('json-stable-stringify')

var defaultPatch = require('./patches/idref-type-patch')

module.exports = function getIdrefTypes (jsonixSchema, patch) {
  patch = assign({}, defaultPatch, patch || {})

  var idrefTypes = jsonixSchema.typeInfos.reduce(function (res, typeInfo) {
    var refTypes = typeInfo.propertyInfos.reduce(function (refTypesRes, propertyInfo) {
      if (propertyInfo.typeInfo === 'IDREF' && propertyInfo.name.slice(-4) === 'Uuid') {
        refTypesRes[propertyInfo.name] = propertyInfo.name.slice(0, -4)
      }
      return refTypesRes
    }, {})
    if (Object.keys(refTypes).length > 0) {
      res[typeInfo.localName] = refTypes
    }
    return res
  }, {})

  Object.keys(patch).forEach(function (key) {
    idrefTypes[key] = idrefTypes[key] || {}
    assign(idrefTypes[key], patch[key])
  })

  // TODO Добавить проверку (все типы должны быть существующие)

  return JSON.parse(stringify(idrefTypes))
}
