moysklad-model-generator
========================

[![npm](https://img.shields.io/npm/v/moysklad-model-generator.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/moysklad-model-generator)
[![Travis](https://img.shields.io/travis/wmakeev/moysklad-model-generator.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/wmakeev/moysklad-model-generator)
[![Gemnasium](https://img.shields.io/gemnasium/wmakeev/moysklad-model-generator.svg?maxAge=2592000&style=flat-square)](https://gemnasium.com/github.com/wmakeev/moysklad-model-generator)

> Генерирует объектную модель МойСклад

Генерация модели для сервиса МойСклад предназначенной для описания преобразований сущностей возращаемых REST API сервиса МойСклад из XML в JSON и обратно.

## Установка

```bash
$ npm install moysklad-model-generator
```

## Использование

```js
var fs = require('fs')
var ModelGenerator = require('moysklad-model-generator')

var xsd = fs.readFileSync('/path/to/MOYsklad.xsd', 'utf8')

var modelGenerator = new ModelGenerator()
var model = modelGenerator.generateModel(xsd)

console.log(JSON.stringify(model, null, 2))
```

## License

MIT © Vitaliy V. Makeev.
