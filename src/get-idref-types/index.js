'use strict'

var assign = require('lodash.assign')
var stringify = require('json-stable-stringify')

var defaultPatch = require('./patches/idref-type-patch')

module.exports = function getIdrefTypes (jsonixSchema, patch) {
  patch = assign({}, defaultPatch, patch || {})

  var availableTypes = jsonixSchema.typeInfos.reduce(function (res, typeInfo) {
    res[typeInfo.localName] = true
    return res
  }, {})

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
    if (idrefTypes[key]) {
      Object.keys(patch[key]).forEach(function (patchKey) {
        if (patchKey in idrefTypes[key]) {
          idrefTypes[key][patchKey] = patch[key][patchKey]
        } else {
          console.log('Warning: Can\'t find property "' + patchKey +
            '" in "' + key + '" type (patch skiped)')
        }
      })
    } else {
      console.log('Warning: Patch can\'t find "' + key + '" type (patch skiped)')
    }
  })

  // Тестируем типы на корретность
  Object.keys(idrefTypes).forEach(function (idrefType) {
    Object.keys(idrefTypes[idrefType]).forEach(function (idrefProp) {
      var value = idrefTypes[idrefType][idrefProp]
      var check = function (typeName) {
        if (!availableTypes[typeName]) {
          console.log('Warning: Type check can\'t find type "' + typeName + '" of "' +
            idrefProp + '" in "' + idrefType + '"')
        }
      }
      if (value === null) {
        return
      } else if (value instanceof Array) {
        value.forEach(check)
      } else if (typeof value === 'string') {
        check(value)
      } else {
        check(value.type)
      }
    })
  })

  return JSON.parse(stringify(idrefTypes))
}
