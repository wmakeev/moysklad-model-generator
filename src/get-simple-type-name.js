/**
 * Возвращает наименование простого типа
 *
 * @param nameXsd Наименование типа используемое в XSD схеме
 * @returns {string} Соответствующее наименование для схемы модели
 */
function getSimpleTypeName (nameXsd) {
  switch (nameXsd) {
    case 'xs:base64Binary':
    case 'xs:IDREF':
    case 'xs:ID':
    case 'xs:string':
      return 'String'

    case 'xs:dateTime':
    case 'xs:double':
    case 'xs:long':
    case 'xs:int':
    case 'xs:unsignedShort':
    case 'xs:boolean':
    default:
      if (nameXsd.substring(0, 3) == 'xs:') {
        return nameXsd.charAt(3).toUpperCase() + nameXsd.substring(4)
      } else {
        throw 'Incorrect base type name [' + nameXsd + ']'
      }
  }
}

module.exports = getSimpleTypeName
