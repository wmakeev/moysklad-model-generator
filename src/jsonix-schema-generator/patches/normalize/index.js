var stringify = require('json-stable-stringify')
var sortBy = require('lodash.sortby')

/**
 * Возвращает имя элемента
 * @param {Object} obj Элемент
 * @returns {string|null} Имя элемента
 */
function getName (obj) {
  return obj.name || obj.elementName || obj.localName
}

/**
 * Сортируем массивы элементов по имени
 * @param key
 * @param value
 */
function replacer (key, value) {
  if (value instanceof Array && value.length && getName(value[0])) {
    return sortBy(value, getName)
  } else {
    return value
  }
}

module.exports = function normalize (schema) {
  return JSON.parse(stringify(schema, {
    replacer: replacer
  }))
}
