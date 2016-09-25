var fs = require('fs')
var path = require('path')
var test = require('tape')

var MoyskladSchema = require('..')
var JsonixSchemaGenerator = MoyskladSchema.JsonixSchemaGenerator
var getIdrefTypes = MoyskladSchema.getIdrefTypes

var xsd = fs.readFileSync(path.join(__dirname, 'res', 'MOYsklad.xsd'), 'utf8')
var testJsonixSchema = require('./res/jsonix-schema')
var testIdrefTypes = require('./res/idref-type')

var jsonixSchemaGenerator = new JsonixSchemaGenerator()
var jsonixSchema = jsonixSchemaGenerator.generateSchema(xsd)
var idrefTypes = getIdrefTypes(jsonixSchema)

test('Moysklad schema', function (t) {
  // console.log(JSON.stringify(jsonixSchema))
  t.deepEqual(jsonixSchema, testJsonixSchema)
  t.end()
})

test('Moysklad IDREF types', function (t) {
  // console.log(JSON.stringify(idrefTypes))
  t.deepEqual(idrefTypes, testIdrefTypes)
  t.end()
})
