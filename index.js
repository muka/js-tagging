var lastTagId = (new Date()).getTime();

function clone(obj) {
    if(null === obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for(var attr in obj) {
        if(copy && obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

var Tag = function (id, info, parent) {

    var tag = this;
    tag.id = null;

    parent = parent || null;

    if(!parent && info instanceof Tag) {
        parent = info;
        info = id;
        id = null;
    }

    var depth = parent ? parent.getDepth() + 1 : 0;

    var root = parent || tag;
    var children = [];

    // is root tag
    if(!parent) {
        tag.count = 1;
    } else {
        parent.getRoot().count++;
    }

    // set defaults args
    if(info === undefined) {
        info = id;
        id = null;
    }

    tag.id = id || 'tag' + (++lastTagId);

    tag.add = function (id, info) {

        // handle list of tags
        if(id instanceof Array) {
            id.forEach(function (el) {
                tag.add(el);
            });
            return null;
        }


        var child;

        // import a Tag instance
        if(id instanceof Tag) {
          var prevTag = id;
          child = new Tag(prevTag.id, prevTag.getTag(), tag);
          if(prevTag.getChildren()) {
            prevTag.getChildren().forEach(function(subel) {
              child.add(subel);
            });
          }
        }
        else {

          // handle an object
          if(typeof id === 'object') {
            return tag.add(id.id || null, id.tag || id);
          }

          child = new Tag(id, info, tag);
        }

        children.push(child);
        return child;
    };

    tag.getParent = function () {
        return parent;
    };

    tag.getChildren = function () {
        return children;
    };

    tag.getRoot = function () {
        return root;
    };

    tag.getDepth = function () {
        return depth;
    };

    tag.getCount = function () {
        return tag.getRoot().count;
    };

    tag.getTag = function () {
        return info;
    };

    tag.toJSON = function () {

        var json = {};

        json.tag = tag.getTag() ? clone(tag.getTag()) : {};
        json.id = tag.id;
        json.depth = tag.getDepth();

        // for root element only
        if(tag.count) {
            json.count = tag.count;
        }

        json.leaf = tag.getParent() ? true : false;
        json.children = tag.getChildren().map(function (child) {
            return child.toJSON();
        });

        return json;
    };

};

var fromJSON = function (json, parent) {
    var tag = new Tag(json.id || null, json.tag, parent || null);
    if(json.children) {
        tag.add(json.children.map(function (child) {
            return fromJSON(child, tag);
        }));
    }
    return tag;
};

module.exports = Tag;
module.exports.fromJSON = fromJSON;
