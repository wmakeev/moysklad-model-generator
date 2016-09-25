// TODO Надо правильно обработать goodPrices в goodFolder

var parseXsd = require('./parse-xsd')
var getSimpleTypeName = require('./get-simple-type-name')
var patches = require('./patches')

function JsonixSchemaGenerator () {
  this.schema = null
}

/**
 * Генерирует модель данных
 *
 * @param {string} xsd XSD-схема МойСклад
 * @returns {Object} Jsonix schema
 */
JsonixSchemaGenerator.prototype.generateSchema = function generateSchema (xsd) {
  var xsdObj = parseXsd(xsd)

  // jsonix schema
  this.schema = {
    name: 'moysklad'
  }

  // xs:simpleType
  this.schema.enums = {}
  xsdObj['xs:simpleType'].forEach(this._addSimpleType, this)

  // xs:element
  this.schema.elementInfos = []
  this._addGlobalElements(xsdObj['xs:element'])

  // xs:complexType
  this.schema.typeInfos = []
  xsdObj['xs:complexType'].forEach(function (complexType) {
    var extension
    var typeInfo = {
      type: 'classInfo',
      localName: complexType.$attribute.name,
      propertyInfos: []
    }

    // xs:complexContent
    if (complexType['xs:complexContent']) {
      // xs:extension
      if (complexType['xs:complexContent']['xs:extension']) {
        extension = complexType['xs:complexContent']['xs:extension']
        if (extension.$attribute.base) {
          // Inheritance
          typeInfo.baseTypeInfo = this._getTypeInfo(extension.$attribute.base)

          // xs:all
          if (extension['xs:all'] && extension['xs:all'].$count > 0) {
            this._addElements(typeInfo, extension['xs:all']['xs:element'])
          }

          // xs:attribute
          if (extension['xs:attribute']) {
            this._addAttributes(typeInfo, extension['xs:attribute'])
          }

          // xs:sequence
          if (extension['xs:sequence'] && extension['xs:sequence'].$count > 0) {
            this._addElements(typeInfo, extension['xs:sequence']['xs:element'])
          }
        } else {
          throw new Error('"base" attribute in xs:extension not found')
        }
      }
    }

    // xs:sequence
    if (complexType['xs:sequence']) {
      // xs:element
      if (complexType['xs:sequence']['xs:element']) {
        this._addElements(typeInfo, complexType['xs:sequence']['xs:element'])
      }

      // xs:any
      if (complexType['xs:sequence']['xs:any']) {
        this._addAnyElement(typeInfo, complexType['xs:sequence']['xs:any'])
      }
    }

    // xs:attribute // (in <xs:complexType name="unit">)
    if (complexType['xs:attribute']) {
      this._addAttributes(typeInfo, complexType['xs:attribute'])
    }

    this.schema.typeInfos.push(typeInfo)
  }, this)

  return patches.reduce(function (res, patch) {
    return patch(res)
  }, this.schema)
}

// Enums
JsonixSchemaGenerator.prototype._addSimpleType = function addSimpleType (elementXsd) {
  if (!elementXsd) { return }
  var enumValues = {}
  var enumerations = elementXsd['xs:restriction']['xs:enumeration']
  if (enumerations) {
    enumerations.forEach(function (enumerationItem) {
      enumValues[enumerationItem.$attribute.value.toUpperCase()] =
        enumerationItem.$attribute.value
    })
  }
  this.schema.enums[elementXsd.$attribute.name] = enumValues
}

// Elements (global)
JsonixSchemaGenerator.prototype._addGlobalElements = function addGlobalElements (elements) {
  if (!elements) { return }
  elements.forEach(function (element) {
    this.schema.elementInfos.push({
      elementName: element.$attribute.name,
      typeInfo: this._getTypeInfo(element.$attribute.type)
    })
  }, this)
}

// Attributes
JsonixSchemaGenerator.prototype._addAttributes = function addAttributes (typeInfo, attributesXsd) {
  attributesXsd = attributesXsd instanceof Array ? attributesXsd : [attributesXsd]
  attributesXsd.forEach(function (attributeItem) {
    typeInfo.propertyInfos.push({
      type: 'attribute',
      name: attributeItem.$attribute.name,
      typeInfo: this._getTypeInfo(attributeItem.$attribute.type)
    })
  }, this)
}

// Elements
JsonixSchemaGenerator.prototype._addElements = function addElements (typeInfo, elementsXsd) {
  // TODO Будет ли корректно обрабатываться name вместо elementName
  elementsXsd = elementsXsd instanceof Array ? elementsXsd : [elementsXsd]
  elementsXsd.forEach(function (elementXsd) {
    var elComplexType
    var elementName
    var propertyInfo = {
      type: 'element'
    }

    // простой элемент
    var el = elementXsd.$attribute

    propertyInfo.name = el.name || el.type || el.ref

    if (el.maxOccurs === 'unbounded') {
      propertyInfo.collection = true
    }

    // элемент коллекция (с вложенными элементами), напр "slots"
    if (elementXsd['xs:complexType']) {
      elComplexType = elementXsd['xs:complexType']['xs:sequence']['xs:element'].$attribute
      elementName = elComplexType.name || elComplexType.ref
      if (propertyInfo.name !== elementName) {
        propertyInfo.elementName = elementName
      }
      propertyInfo.collection = true
      propertyInfo.wrapperElementName = propertyInfo.name
      propertyInfo.typeInfo = this._getTypeInfo(elComplexType.type || elComplexType.ref)
    } else {
      propertyInfo.typeInfo = this._getTypeInfo(el.type || el.ref)
    }

    typeInfo.propertyInfos.push(propertyInfo)
  }, this)
}

// AnyElement
JsonixSchemaGenerator.prototype._addAnyElement = function addAnyElement (typeInfo, elementXsd) {
  var propertyInfo = {
    type: 'anyElement'
  }

  var el = elementXsd.$attribute

  if (el.namespace !== '##other') {
    throw new Error('Not expected namespace [' + el.namespace + ']')
  }

  if (el.processContents === 'strict') {
    propertyInfo.allowDom = false
  } else if (el.processContents === 'skip') {
    propertyInfo.allowTypedObject = false
  }

  if (el.maxOccurs === 'unbounded') {
    propertyInfo.name = 'items'
    propertyInfo.collection = true
  } else {
    propertyInfo.name = 'item'
  }

  // addPropInfo('mixed', false);

  typeInfo.propertyInfos.push(propertyInfo)
}

JsonixSchemaGenerator.prototype._getTypeInfo = function getTypeInfo (typeName) {
  if (!typeName) { return }

  // base type
  if (typeName.substring(0, 3) === 'xs:') {
    return getSimpleTypeName(typeName)
  }

  // enum
  if (typeName in this.schema.enums) {
    return 'String'
  }

  // moysklad
  return this.schema.name + '.' + typeName
}

module.exports = JsonixSchemaGenerator
