Md.extend("node", function(require) {

    var Attr = require("attr");

    function Node(tag) {
        this.__tag__ = tag ? tag : "";
        this.__attr__ = new Attr();
        this.children = [];
    }

    Node.prototype.attr = function(name, value) {

        // 如果没有传入value 则返回name对应属性名的值
        if (typeof value === "undefined") {
            return this.__attr__.get(name);
        } else {
            return this.__attr__.add(name, value);
        }

        return this;
    };

    Node.prototype.rmAttr = function(name) {
        this.__attr__.rm(name);
        return this;
    };

    Node.prototype.appendChild = function(node) {
        this.children.push(node);
        return this;
    };

    Node.prototype.toHtml = function() {

        var dom = null,
            children = this.children,
            i = -1,
            len = children.length;

        if (this.__tag__ === "") {
            dom = document.createDocumentFragment();
        } else {
            dom = document.createElement(this.__tag__);

            this.__attr__.forEach(function(key, value) {
                dom.setAttribute(key, value);
            });

        }

        while (++i < len) {
            dom.appendChild(children[i].toHtml());
        }

        return dom;
    };

    return Node;
});
