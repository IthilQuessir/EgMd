/**
 * 语法事例:
 * # 标题
 * #标题
 * ###### 标题
 */

Md.extend("syntax/atx-header", function (require) {

    var Node = require("node");

    var pattern = /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/;

    function AtxHeader() {
    }

    AtxHeader.prototype.parse = function(str, queue) {

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

    return AtxHeader;
});
