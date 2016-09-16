var Node = (function() {

    function Node(tag) {
        this.tag = tag;
        this.attr = new Attr();
        this.children = [];
    }

    Node.prototype.attr = function(name, value) {

        // 如果没有传入value 则返回name对应属性名的值
        if (typeof value === "undefined") {
            return this.attr.get(name);
        } else {
            return this.attr.add(name, value);
        }

        return this;
    };

    Node.prototype.rmAttr = function(name) {
        this.attr.rm(name);
        return this;
    };

    Node.prototype.addChild = function(node) {
        this.children.push(node);
        return this;
    };

    Node.prototype.toHtml = function() {

        var dom = null,
            children = this.children,
            i = -1,
            len = children.length;

        if (this.tag === "") {
            dom = document.createDocumentFragment();
        } else {
            dom = document.createElement(this.tag);
        }

        while(++i < len) {
            dom.appendChild(children[i].toHtml());
        }

        return dom;
    };

    return Node;

}());
