moysklad-model-generator
========================

Генерирует объектную модель МойСклад

# Описание

Генерируемая модель изначально предназначена для описания преобразований сущностей возращаемых REST API сервиса МойСклад из XML в JSON и обратно.


# Использование

```js
var fs = require('fs')
var ModelGenerator = require('moysklad-model-generator')

var xsd = fs.readFileSync('/path/to/MOYsklad.xsd', 'utf8')

var modelGenerator = new ModelGenerator()
var model = modelGenerator.generateModel(xsd)

console.log(model)
```

# Планы развития

- покрыть тестами
