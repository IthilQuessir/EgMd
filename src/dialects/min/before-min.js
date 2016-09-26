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
        this.__tag__ = tag;
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


var Inline = (function() {

    var expendGrammars = [];

    function Inline() {}

    Inline.expend = function(grammar) {
        expendGrammars.push(grammar);
    };

    Inline.prototype.parse = function(str) {

        var queue = [str],
            gammar = null,
            i = -1,
            len = expendGrammars.length,
            rs = null,
            stack = null,
            node = new Node("");

        while (queue.length) {

            i = -1;
            str = queue.pop();

            while (++i < len) {
                stack = [];
                gammar = new expendGrammars[i]();

                rs = gammar.parse(str, stack);

                if (stack.length && rs === null) {
                    // 语法仅对字符串结构进行调整，保障其优先级

                    stack.reverse();
                    str = stack.pop();
                    queue.push.apply(queue, stack);

                    continue;
                } else if (stack.length) {
                    // 语法解析字符串，并有部分尾部部分无法解析

                    stack.reverse();
                    queue.push.apply(queue, stack);

                    break;
                } else if (rs !== null) {
                    // 语法对字符串进行了完整成功的解析

                    break;
                }
            }

            if (rs !== null ) {
                node.appendChild(rs);
            }
        }

        return node;
    };

    return Inline;


}());


(function() {



    function Escaped() {

    }

    Escaped.prototype.parse = function(str, queue) {

        // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
        var pattern = /\\([\\`\*_{}\[\]()#\+.!\-])/,
            reg = pattern.exec(str),
            rs = null;

        if (!pattern.test(str)) {
            return null;
        }

        if(reg.index === 0) {
            queue.push(str.substr(reg[0].length));
            return new TextNode(reg[1]);
        } else {
            queue.push(str.substring(0,reg.index));
            queue.push(str.substr(reg.index));
            return null;
        }

        return rs;
    };

    Inline.expend(Escaped);
}());


(function() {

    function inlinePlainText() {
    }

    inlinePlainText.prototype.parse = function (str) {
        return new TextNode(str);
    };

    Inline.expend(inlinePlainText);
}());


var Blocks = (function(undefined) {

    // var Block = this.Block;

    function Blocks() {
        this.blockGrammar = new Block();
    }

    Blocks.prototype.parse = function(str) {

        var pattern = /([\s\S]+?)($|\n(?:\s*\n|\s*$)+)/g,
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

        // 这里主要目的是之后在向头部插入时使用push而不是unshif，因为unshift在IE中有BUG
        queue.reverse();

        while (queue.length) {
            parseRs = this.blockGrammar.parse(queue.pop(), queue);

            if(parseRs !== null) {
                node.appendChild(parseRs);
            }
        }

        return node;
    };

    return Blocks;
}());


var Block = (function(global, undefined) {

    var expendGrammars = [];

    function Block() {}

    Block.prototype.parse = function(str, queue) {

        var i = -1,
            len = expendGrammars.length,
            rs = null,
            grammar = null,
            stack = null;

        while (++i < len) {

            grammar = new expendGrammars[i]();
            stack = [];

            rs = grammar.parse(str, stack);

            if (stack.length && rs === null) {

                stack.reverse();
                str = stack.pop();
                queue.push.apply(queue, stack);

                continue;
            } else if (stack.length) {

                stack.reverse();
                queue.push.apply(queue, stack);

                break;
            } else if (rs !== null ) {
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

        header.appendChild(new TextNode(reg[2]));

        if (reg[0].length < str.length) {
            // 将没有解析的尾部放回队列
            queue.push(str.substr(reg[0].length));
        }

        return header;
    };

    Block.expend(atxHeader);

}());


(function() {

    function setextHeader() {}

    setextHeader.prototype.parse = function(str, queue) {

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

        inline = new Inline();
        header.appendChild(inline.parse(reg[1]));

        // 字符串尾部还有其余内容，则将其放回队列头部
        if( reg[0].length < str.length ) {
            queue.push( str.substr(reg[0].length) );
        }

        return header;
    };

    Block.expend(setextHeader);

}());


(function() {

    var className = {
        dash: "dash",
        underline: "underline",
        asterisk: "asterisk"
    };

    function horizLine() {

    }

    horizLine.prototype.parse = function(str, queue) {

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

    Block.expend(horizLine);

}());


(function(undefined) {

    // var Block = global.Block;

    function Paragraph() {}

    Paragraph.prototype.parse = function(str) {

        var node = new Node("p"),
            inline = new Inline();

        node.appendChild(inline.parse(str));

        return node;
    };

    Block.expend(Paragraph);

}());


// @codekit-prepend "./inline.js"
// @codekit-prepend "./escaped.js"
// @codekit-prepend "./inlinePlainText.js"
// @codekit-prepend "./blocks.js"
// @codekit-prepend "./block.js"
// @codekit-prepend "./atxHeader.js"
// @codekit-prepend "./setextHeader.js"
// @codekit-prepend "./horizLine.js"
// @codekit-prepend "./paragraph.js"

function Dialect() {}

/**
 * 对输入的字符串进行格式化，统一换行符
 * @param {String} str 被格式化的字符串
 * @return {String}
 */
function strInit(str) {

    return str.replace(/(\r\n|\n|\r)/g, "\n"); // 把不同的换行符都替换成\n

}

/**
 * 解析Block
 * @param   {Block_Object} block
 * @returns {Node_Object}  解析成功返回一个Node对象，否则返回 null
 */
Dialect.prototype.parse = function(str) {

    var blocks = new Blocks();

    return blocks.parse(strInit(str));
};

return Dialect;




}());


