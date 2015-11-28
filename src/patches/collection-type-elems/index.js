var assign = require('lodash.assign')

module.exports = function collectionTypeElemsPatch (model) {
  var typeInfosByName = model.typeInfos.reduce(function (res, typeInfo) {
    res[model.name + '.' + typeInfo.localName] = typeInfo
    return res
  }, {})

  var isTypeAnyPatched = false

  var typeInfos = model.typeInfos.map(function (typeInfo) {
    var isTypeInfoPatched = false
    var propertyInfos = typeInfo.propertyInfos.map(function (propertyInfo) {
      if (!propertyInfo.collection) {
        var propInfoType = typeInfosByName[propertyInfo.typeInfo]
        if (
          propInfoType &&
          propInfoType.propertyInfos.length === 1 &&
          propInfoType.propertyInfos[0].collection === true
        ) {
          isTypeInfoPatched = true
          var propInfoTypeElem = propInfoType.propertyInfos[0]
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
    model = assign({}, model, {
      typeInfos: typeInfos
    })
  }

  return model
}
