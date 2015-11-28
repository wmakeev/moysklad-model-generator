collection-type-elems
=====================

Исправление определенных видов элементов-коллекций

К примеру, до применения патча элемент `salePrices` определен в модели следующим образом:

```
{
  "type": "element",
  "name": "salePrices",
  "typeInfo": "moysklad.prices",
}
```

`salePrices` не является коллекцией, но имеет тип `moysklad.prices` который, в свою очередь, содержит один элемент-коллекцию с типом `moysklad.price`.
 
```
{
  "type": "classInfo",
  "localName": "prices",
  "propertyInfos": [
    {
      "type": "element",
      "name": "price",
      "collection": true,
      "typeInfo": "moysklad.price"
    }
  ]
}
```

В таком виде XML представление `salePrices` преобразуется в JSON не самым удобным образом

```
good.salePrices.price[]
```

Очевиднее ожидать такого преобразования

```
good.salePrices[]
```

Патч "сворачивает" такие зависимости, преобразуя `salePrices` следующим образом

```
{
  "type": "element",
  "name": "salePrices",
  "typeInfo": "moysklad.price",
  "elementName": "price",
  "collection": true,
  "wrapperElementName": "salePrices"
}
```
