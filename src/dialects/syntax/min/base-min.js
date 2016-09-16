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


