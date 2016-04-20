var Tag = require('./index');

var tag = new Tag('myobject');

var child1 = tag.add({
  name: 'test1',
  description: ['some']
});

console.log(require('util').inspect(tag.toJSON(), { depth: null }));

var tag = new Tag('root');

var add100 = function (tag1, depth) {
    depth = depth || 0;
    depth++;
    for(var i = 0; i < 5; i++) {
        var child = tag1.add(null, 'newtag_' + i);
        if(depth < 5) {
          add100(child, depth);
        }
    }
};

// add100(tag);
// console.log(Tag.fromJSON(tag.toJSON()).toJSON());

var tag = Tag.fromJSON({
  id: 'colors',
  children: [
    {
      id: 'red',
      children: [
        {
          id: 'orange',
          children: [
            {
              id: 'yellow',
            }
          ]
        },
      ]
    },
    {
      id: 'blue',
    },
    {
      id: 'green',
    }
  ]
});

// console.log(tag.toJSON());
console.log(tag.getById('yellow'));
console.log(tag.getById('yellow').toString());

console.log(tag.getById('yellow').toString());
tag.getById('orange').remove('yellow');
console.log(tag.getById('yellow') === null);
console.log(tag.getRoot().path());
