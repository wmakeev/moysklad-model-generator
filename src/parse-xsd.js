var DOMParser = require('xmldom').DOMParser
var XmlToJson = require('../vendor/xml-to-json')

module.exports = function parseXsd (xsdXml) {
  var parser = new DOMParser()
  var xsdDocument = parser.parseFromString(xsdXml, "application/xml")
  return XmlToJson.ToJSON(xsdDocument.documentElement)
}
