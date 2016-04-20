var lastTagId = (new Date()).getTime();

function clone(obj) {
    if(null === obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for(var attr in obj) {
        if(copy && obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

var Tag = function (id, data, parent) {

    var tag = this;

    if(!parent && data instanceof Tag) {
        parent = data;
        data = id;
        id = null;
    }

    tag.id = null;
    tag.data = null;
    tag.parent = parent || null;
    tag.depth = parent ? parent.getDepth() + 1 : 0;
    tag.root = parent ? parent.getRoot() : tag;
    tag.children = [];
    this.data = data || id;

    // is root tag
    if(!parent) {
        tag.count = 1;
        tag.tree = {};
    } else {
        tag.parent.getRoot().count++;
    }

    // set defaults args
    if(data === undefined) {
        data = id;
        if(typeof data !== 'string' && !tag.getById(data)) {
          id = null;
        }
    }

    tag.id = id ? id : 'tag' + (++lastTagId);

    if(tag.getById(tag.id)) {
        throw new Error('Id must be unique');
    }

    // add root id to list
    if(!parent) {
        tag.tree[tag.id] = tag;
    }
};

Tag.prototype.add = function (id, data) {
    var tag = this;
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
            prevTag.getChildren().forEach(function (subel) {
                child.add(subel);
            });
        }
    } else {
        // handle an object
        if(id && typeof id === 'object') {
            return tag.add(id.id || null, id.tag || null);
        }
        child = new Tag(id, data, tag);
    }

    tag.getRoot().tree[child.id] = child;
    tag.getChildren().push(child);
    return child;
};

Tag.prototype.remove = function (tagchild) {
    var tag = this;
    var tagchildId = tagchild instanceof Tag ?  tagchild.id : tagchild;
    tag.getChildren().forEach(function (child, idx) {
        if(tagchildId === child.id) {
            child.parent = null;
            delete tag.getRoot().tree[tagchildId];
            tag.getChildren().slice(idx, 1);
        }
    });
};

Tag.prototype.drop = function () {
    var tag = this;
    if(tag.getParent()) {
        tag.getParent().remove(tag);
    }
};

Tag.prototype.path = function (showIds) {
    showIds = showIds === undefined ? false : showIds;
    var tag = this;
    var currtag = tag;
    var path = [ tag[ showIds ? 'id' : 'data' ] ];
    while(currtag.getParent()) {
        currtag = currtag.getParent();
        path.push(currtag[ showIds ? 'id' : 'data' ].toString());
    }
    return path.reverse().join('/');
};

Tag.prototype.getParent = function () {
    return this.parent;
};

Tag.prototype.getChildren = function () {
    return this.children;
};

Tag.prototype.getRoot = function () {
    return this.root;
};

Tag.prototype.getDepth = function () {
    return this.depth;
};

Tag.prototype.getCount = function () {
    return this.getRoot().count;
};

Tag.prototype.getTag = function () {
    return this.data;
};

Tag.prototype.getById = function (id) {
    return (this.getRoot() && this.getRoot().tree[id]) ? this.getRoot().tree[id] : null;
};

Tag.prototype.toString = function () {
  return this.path();
};

Tag.prototype.toJSON = function () {

    var tag = this;
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


var fromJSON = function (json, parent) {
    var tag = !parent ?
      new Tag(json.id, json.tag) : parent.add(json);

    if(json.children) {
        json.children.forEach(function(child) {
          fromJSON(child, tag);
        });
    }
    return tag;
};

module.exports = Tag;
module.exports.fromJSON = fromJSON;
