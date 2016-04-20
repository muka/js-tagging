# tagging

A javascript tagging library to handle generic tags tree

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
