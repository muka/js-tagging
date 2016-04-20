# tagging

A tagging library for node js with children support

```
var tag = new Tag('myobject');

var child1 = tag.add({
 name: 'another object',
 description: ['some']
});

console.log(
  Tag.fromJSON(
    tag.toJSON()
  ).toJSON()
);

```
