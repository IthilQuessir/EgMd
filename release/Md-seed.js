(function(global, undefined) {
    'use strict';

    var modules = {};

    function require(url) {

        var path = url.split("/"),
            i = 0,
            len = path.length,
            target = modules;

        for (; i < len; i++) {

            if (path[i] in target) {
                target = target[path[i]];
            } else {
                throw new Error("[Md require] Cannot find the module;\nThe url is " + url);
            }

        }


        if (path in modules) {
            return modules[name];
        } else {
            throw new Error("CANNOT ");
        }

    }

    function extend(url, cb) {

        var path = url.split("/"),
            i = 0,
            len = path.length - 1,
            target = modules,
            theModule = null;

        for (; i < len; i++) {
            if (!(path[i] in target)) {
                target[path[i]] = {};
            }

            target = target[path[i]];
        }

        if (path[i] in target) {
            throw new Error("[Md extend] Module had existed;\nThe Url is " + url);
        }

        theModule = cb.call(target, require);

        if (theModule) {
            target[path[i]] = theModule;
        } else {
            throw new Error("[Md extend] the module \"" + path[i] + "\"" + "had existed");
        }
    }

    function Md(str, options) {

        var dialect = new Dialect(),
            nodeTree = dialect.parse(str),
            domTree = nodeTree.toHtml();

        this.options = options;

        return domTree;

    }

    Md.prototype.extend = extend;

    global.Md = Md;

}(this));

Md.extend("attr", function (require) {

        function Attr() {
            this.list = {};
        }

        /**
         * 将属性名为name的属性值添加/修改为value
         *
         * @param {String} name  属性名
         * @param {String} value 属性值
         */
        Attr.prototype.add = function(name, value) {
            this.list[name] = value;
        };

        /**
         * 上属性名为name的属性移除
         *
         * @param {String} name 属性名
         */
        Attr.prototype.rm = function(name) {
            delete this.list[name];
        };

        Attr.prototype.get = function(name) {
            return this.list[name] || null;
        };

        Attr.prototype.forEach = function(cb) {
            var key,
                list = this.list;
            for (key in list) {
                if (list.hasOwnProperty(key)) {
                    cb.call(this, key, list[key]);
                }
            }
        };

        Attr.prototype.clone = function() {
            // TODO 深复制代码
        };

        return Attr;
});

Md.extend("dialect-builder", function (require) {

    function Dialect() {
        this.syntaxLib = {};
    }

    Dialect.prototype.parse = function (str) {

        if ("block" in this.syntaxLib) {
            this.syntaxLib.block(str);
        } else {
            throw new Error("[Dialect parse] Dialect must has extend block module");
        }

    };

    Dialect.prototype.extend = function (name, syntax) {

        this.syntaxLib[name] = new syntax(this);
    };

    Dialect.prototype.getSyntax = function (name) {

        if (name in this.syntaxLib) {
            return this.syntaxLib[name];
        } else {
            throw new Error("[Dialect getSyntax] This dialect hasn't syntax named " + name);
        }

    };

    function dialectBuilder() {
        this.list = [];
    }

    dialectBuilder.prototype.addSyntax = function (arr) {
        this.list.push.apply(this.list, arr);
    };

    dialectBuilder.prototype.build = function () {

        var i = 0,
            len = this.list.length,
            syntax = null,
            dialect = new Dialect();

        for (; i < len; i ++) {

            syntax = require(this.list[i]);

            dialect.extend(this.list[i], syntax);

        }

    };

});

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

Md.extend("text-node", function(require) {

    function TextNode(str) {
        this.text = str;
    }

    TextNode.prototype.toHtml = function() {
        return document.createTextNode(this.text);
    };

    return TextNode;
});
