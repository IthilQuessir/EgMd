
// @codekit-append "./index.js"
// @codekit-append "./after.js"

var Md = (function(undefined) {
    'use strict';


var Attr = (function() {

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

}());


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


var TextNode = (function() {

    function TextNode(str) {
        this.text = str;
    }

    TextNode.prototype.toHtml = function () {
        return document.createTextNode(this.text);
    };

    return TextNode;
}());


// @codekit-prepend "../attr/index.js"
// @codekit-prepend "../node/index.js"
// @codekit-prepend "../textNode/index.js"

// @codekit-append "./syntax/min/base-min.js"
// @codekit-append "./after.js"

var Dialect = (function(undefined) {


var Blocks = (function(undefined) {

    // var Block = this.Block;

    function Blocks() {
        this.blockGrammar = new Block();
    }

    Blocks.prototype.parse = function(str) {

        var pattern = /([\s\S]+?)($|\n#|\n(?:\s*\n?|$)+)/g,
            queue = [],
            reg = null,
            parseRs = null,
            node = new Node("");

        // 匹配起始空白行
        reg = /^(\s*\n)/.exec(str);
        if ( reg !== null) {
            pattern.lastIndex = reg[0].length;
        }

        reg = pattern.exec(str);
        while (reg !== null) {
            queue.push(reg[1]);
            reg = pattern.exec(str);
        }

        while (queue.length) {
            parseRs = this.blockGrammar.parse(queue.shift(), queue);

            if(parseRs !== null) {
                node.addChild(parseRs);
            }
        }

        return node;
    };

    return Blocks;
}());


var Block = (function(global, undefined) {

    var expendGrammars = [];

    function Block() {
    }

    Block.prototype.parse = function(str, queue) {

        var i = -1,
            len = expendGrammars.length,
            rs = null,
            grammar = null;

        while (++i < len) {
            grammar = new expendGrammars[i]();

            rs = grammar.parse(str, queue);
            if (rs !== null) {
                break;
            }
        }

        return rs;

    };

    Block.expend = function(grammar) {
        expendGrammars.push(grammar);
    };

    return Block;

}(this));


/**
 * 语法事例:
 * # 标题
 * #标题
 * ###### 标题
 */

(function(undefined) {

    // var Block = global.Block;

    var pattern = /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/;

    function atxHeader() {
    }

    atxHeader.prototype.parse = function(str, queue) {

        if (!pattern.test(str)) {
            return null;
        }

        var reg = str.match(pattern);
        var header = new Node("h" + reg[1].length);

        header.addChild(new TextNode(reg[2]));

        if (reg[0].length < str.length) {
            // 将没有解析的尾部放回队列
            queue.push(str.substr(reg[0].length));
        }

        return header;
    };

    Block.expend(atxHeader);

}());


(function(undefined) {

    // var Block = global.Block;

    function Paragraph() {}

    Paragraph.prototype.parse = function(str) {

        var node = new Node("p");

        node.addChild(new TextNode(str));

        return node;
    };

    Block.expend(Paragraph);

}());


// @codekit-prepend "./blocks.js"
// @codekit-prepend "./block.js"
// @codekit-prepend "./atxHeader.js"
// @codekit-prepend "./paragraph.js"

function Dialect() {}

/**
 * 解析Block
 * @param   {Block_Object} block
 * @returns {Node_Object}  解析成功返回一个Node对象，否则返回 null
 */
Dialect.prototype.parse = function(str) {

    var blocks = new Blocks();

    return blocks.parse(strInit(str));
};

/**
 * 对输入的字符串进行格式化，统一换行符
 * @param {String} str 被格式化的字符串
 * @return {String}
 */
function strInit(str) {

    return str.replace(/(\r\n|\n|\r)/g, "\n"); // 把不同的换行符都替换成\n

}

return Dialect;




}());




// @codekit-prepend "../dialects/min/before-min.js"

function Md(str, options) {

    var dialect = new Dialect(),
        nodeTree = dialect.parse(str),
        domTree = nodeTree.toHtml();

    this.options = options;

    return domTree;

}


return Md;


}());


