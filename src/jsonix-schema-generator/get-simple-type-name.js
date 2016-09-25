/**
 * Возвращает наименование простого типа
 *
 * @param nameXsd Наименование типа используемое в XSD схеме
 * @returns {string} Соответствующее наименование для схемы модели
 */
function getSimpleTypeName (nameXsd) {
  if (nameXsd.substring(0, 3) == 'xs:') {
    return nameXsd.charAt(3).toUpperCase() + nameXsd.substring(4)
  } else {
    throw 'Incorrect base type name [' + nameXsd + ']'
  }
}

module.exports = getSimpleTypeName
