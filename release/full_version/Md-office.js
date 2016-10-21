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
                throw new Error("[Md require] Cannot find module: " + url);
            }

        }

        return target;

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
            throw new Error("[Md extend] Unexpected return of the module \"" + path[i] + "\"");
        }
    }

    function Md(str, options) {

        var dialects = require("dialects"),
            dialect = null,
            key;

        options = options || {};

        /**
         * 若配置的解析器不存在或者未配置
         * 则随意选择一个解析器作为默认解析器进行解析
         */
        if (options.dialect && options.dialect in dialects) {
            dialect = dialects[options.dialect];
        } else {
            for (key in dialects) {
                dialect = dialects[key];
                break;
            }
        }

        if (!dialect) {
            throw new Error("[Md] Plese use full_version or include dialect module\n" +
                "请使用完整版或者 Md-seed.js + dialect模块配合使用。" +
                "仅单独使用Md-seed.js是无法运行的");
        }

        str = str
            .replace(/^\s*\n/, "")
            .replace(/\s*$/, "");

        return dialect.parse(str).toHtml();

    }

    Md.extend = extend;

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
            return this.syntaxLib.block.parse(str);
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

    function DialectBuilder() {
        this.list = [];
    }

    DialectBuilder.prototype.setSyntax = function (arr) {
        this.list.push.apply(this.list, arr);

        return this;
    };

    DialectBuilder.prototype.build = function () {

        var i = 0,
            len = this.list.length,
            syntax = null,
            dialect = new Dialect();

        for (; i < len; i ++) {

            syntax = require("syntax/" + this.list[i]);

            dialect.extend(this.list[i], syntax);

        }

        return dialect;

    };

    return DialectBuilder;

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

Md.extend("syntax/block", function(require) {

    var Node = require("node");

    function Block() {
        this.lib = [];
    }

    // XXX 没有去重
    Block.prototype.extend = function(syntax) {
        this.lib.push(syntax);
    };

    Block.prototype.parse = function(str) {

        var queue = [str],
            stack = null,
            i,
            len = this.lib.length,
            rs = null,
            node = new Node();

        do {

            str = queue.pop();

            for (i = 0; i < len; i++) {

                stack = [];
                rs = this.lib[i].parse(str, stack);

                if (stack.length) {
                    stack.reverse();
                    queue.push.apply(queue, stack);
                }

                if (rs) {
                    node.appendChild(rs);
                    break;
                } else if (stack.length) {
                    str = queue.pop();
                }

            }

        } while (queue.length);


        return node;

    };

    Block.expend = function(grammar) {
        expendGrammars.push(grammar);
    };

    return Block;
});

Md.extend("syntax/inline", function(require) {

    var Node = require("node");

    function Inline() {
        this.lib = [];
    }

    Inline.prototype.extend = function(syntax) {
        // XXX 未去重
        this.lib.push(syntax);
    };

    Inline.prototype.parse = function(str) {

        var queue = [str],
            stack = null,
            i,
            len = this.lib.length,
            rs = null,
            node = new Node();

        do {

            str = queue.pop();

            for (i = 0; i < len; i++) {

                stack = [];
                rs = this.lib[i].parse(str, stack);

                if (stack.length) {
                    stack.reverse();
                    queue.push.apply(queue, stack);
                }

                if (rs) {
                    node.appendChild(rs);
                    break;
                } else if (stack.length) {
                    str = queue.pop();
                }
            }

        } while (queue.length);

        return node;
    };

    return Inline;
});

Md.extend("syntax/combin-block", function(require) {

    var Node = require("node");

    function CombinBlock(dialect) {

        this.block = dialect.getSyntax("block");
        this.block.extend(this);

    }

    CombinBlock.prototype.parse = function(str) {

        var pattern = /(?:^\s*\n)/m,
            queue = str.split(/(?:^\s*\n)/m),
            that = this;

        if (queue.length > 1) {

            return (function() {

                var node = new Node(),
                    i = 0,
                    len = queue.length;

                for (; i < len; i++) {
                    node.appendChild(that.block.parse(queue[i]));
                }

                return node;

            }());

        } else {
            return null;
        }

    };

    return CombinBlock;
});

/**
 * 语法事例:
 * # 标题
 * #标题
 * ###### 标题
 */

Md.extend("syntax/atx-header", function (require) {

    var Node = require("node");

    var pattern = /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/;

    function AtxHeader(dialect) {

        var block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    AtxHeader.prototype.parse = function(str, queue) {

        if (!pattern.test(str)) {
            return null;
        }

        var reg = str.match(pattern);
        var header = new Node("h" + reg[1].length);

        header.appendChild(this.inline.parse(reg[2]));

        if (reg[0].length < str.length) {
            // 将没有解析的尾部放回队列
            queue.push(str.substr(reg[0].length));
        }

        return header;
    };

    return AtxHeader;
});

Md.extend("syntax/setext-header", function(require) {

    var Node = require("node");

    function SetextHeader(dialect) {
        block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    SetextHeader.prototype.parse = function(str, queue) {

        var pattern = /^(.*)\n([-=])\2\2+(?:\n|$)/,
            reg = null,
            level = "",
            header = null,
            inline = null;

        if (!pattern.test(str)) {
            return null;
        }

        reg = str.match(pattern);

        level = (reg[2] === "=") ? "h1" : "h2";
        header = new Node(level);

        header.appendChild(this.inline.parse(reg[1]));

        // 字符串尾部还有其余内容，则将其放回队列头部
        if (reg[0].length < str.length) {
            queue.push(str.substr(reg[0].length));
        }

        return header;
    };

    return SetextHeader;
});

Md.extend("syntax/horiz-line", function(require) {

    var Node = require("node");

    var className = {
        dash: "dash",
        underline: "underline",
        asterisk: "asterisk"
    };

    function HorizLine(dialect) {
        var block = dialect.getSyntax("block");
        block.extend(this);
    }

    HorizLine.prototype.parse = function(str, queue) {

        var a = {s: str};

        var pattern = /^(?:([\s\S]*?)\n)?[ \t]*(([-_*])(?:[ \t]*\3){2,})[ \t]*(?:\n([\s\S]*))?$/,
            reg = str.match(pattern),
            node = null;

        if (!reg) {
            return null;
        }

        // 在hr之前又内容，将内容分割后重新放回流
        if (reg[1]) {
            queue.push(reg[1]);
            queue.push(reg[2]);
            if (reg[4]) {
                queue.push(reg[4]);
            }

            return null;
        }

        node = new Node("hr");

        switch (reg[3]) {
            case '-':
                node.attr("class", className.dash);
                break;
            case '_':
                node.attr("class", className.underline);
                break;
            case '*':
                node.attr("class", className.asteris);
                break;
                // No Default;
        }

        // hr之后有剩余内容
        if (reg[4]) {
            queue.push(reg[4]);
        }

        return node;
    };

    return HorizLine;
});

Md.extend("syntax/paragraph", function (require) {

    var Node = require("node");

    function Paragraph(dialect) {
        block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    Paragraph.prototype.parse = function(str) {

        var node = new Node("p");

        node.appendChild(this.inline.parse(str));

        return node;
    };

    return Paragraph;

});

Md.extend("syntax/escaped", function(require) {

    var TextNode = require("text-node");

    function Escaped(dialect) {
        var inline = dialect.getSyntax("inline");
        inline.extend(this);
    }

    Escaped.prototype.parse = function(str, queue) {

        // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
        var pattern = /\\([\\`\*_{}\[\]()#\+.!\-])/,
            reg = pattern.exec(str),
            rs = null;

        if (!pattern.test(str)) {
            return null;
        }

        if (reg.index === 0) {
            queue.push(str.substr(reg[0].length));
            return new TextNode(reg[1]);
        } else {
            queue.push(str.substring(0, reg.index));
            queue.push(str.substr(reg.index));
            return null;
        }

        return rs;
    };

    return Escaped;
});

Md.extend("syntax/inline-plain-text", function(require) {

    var TextNode = require("text-node");

    function PlainText(dialect) {
        var inline = dialect.getSyntax("inline");
        inline.extend(this);
    }

    PlainText.prototype.parse = function(str) {
        return new TextNode(str);
    };

    return PlainText;

});

Md.extend("dialects/office", function(require) {

    var DialectBuilder = require("dialect-builder");

    return new DialectBuilder()
        .setSyntax([
            

                "block" ,

            

                "inline" ,

            

                "combin-block" ,

            

                "atx-header" ,

            

                "setext-header" ,

            

                "horiz-line" ,

            

                "paragraph" ,

            

                "escaped" ,

            

                "inline-plain-text" 

            
        ])
        .build();

});
