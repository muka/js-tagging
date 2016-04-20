var Tag = require('./index');

// var tag = new Tag('myobject');
//
// var child1 = tag.add({
//   name: 'test1',
//   description: ['some']
// });
//
// console.log(require('util').inspect(tag.toJSON(), { depth: null }));

var tag = new Tag('root');

var add100 = function (tag1, depth) {

    depth = depth || 0;
    depth++;

    // console.log("add depth " + depth);

    for(var i = 0; i < 5; i++) {
        var child = tag1.add('newtag_' + i);
        if(depth < 5) {
          add100(child, depth);
        }
    }

};

add100(tag);

// console.log(tag.toJSON());

console.log(
  require('util').inspect(
    Tag.fromJSON(tag.toJSON()).toJSON(),
  { depth: null })
);
