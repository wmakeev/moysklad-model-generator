var assign = require('lodash.assign')

module.exports = function collectionTypeElemsPatch (schema) {
  var typeInfosByName = schema.typeInfos.reduce(function (res, typeInfo) {
    res[schema.name + '.' + typeInfo.localName] = typeInfo
    return res
  }, {})

  var isTypeAnyPatched = false

  var typeInfos = schema.typeInfos.map(function (typeInfo) {
    var isTypeInfoPatched = false
    var propInfoType
    var propInfoTypeElem
    var propertyInfos = typeInfo.propertyInfos.map(function (propertyInfo) {
      if (!propertyInfo.collection) {
        propInfoType = typeInfosByName[propertyInfo.typeInfo]
        if (
          propInfoType &&
          propInfoType.propertyInfos.length === 1 &&
          propInfoType.propertyInfos[0].collection === true
        ) {
          isTypeInfoPatched = true
          propInfoTypeElem = propInfoType.propertyInfos[0]
          propertyInfo = assign({}, propertyInfo, {
            elementName: propInfoTypeElem.name,
            collection: true,
            wrapperElementName: propertyInfo.name,
            typeInfo: propInfoTypeElem.typeInfo
          })

          console.log('fix:',
            typeInfo.localName + '.' + propertyInfo.name + ' <- ' +
            propInfoType.localName + '.' + propInfoTypeElem.name)
        }
      }

      return propertyInfo
    })
    if (isTypeInfoPatched) {
      isTypeAnyPatched = true
      typeInfo = assign({}, typeInfo, {
        propertyInfos: propertyInfos
      })
    }
    return typeInfo
  })

  if (isTypeAnyPatched) {
    schema = assign({}, schema, {
      typeInfos: typeInfos
    })
  }

  return schema
}
