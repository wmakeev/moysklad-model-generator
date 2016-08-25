var fs = require('fs')
var test = require('tape')

var ModelGenerator = require('../src')
var xsd = fs.readFileSync(__dirname + '/model.xsd', 'utf8')
var testModel = require('./model')

var modelGenerator = new ModelGenerator()
var model = modelGenerator.generateModel(xsd)

test('Model', function (t) {
  t.deepEqual(model, testModel)
  t.end()
})
