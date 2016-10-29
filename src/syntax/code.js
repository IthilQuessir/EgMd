/**
 * XXX 尚未测试如下事例
 *         1.xxxxxxxxx
 *               codeing
 *               codeing
 *
 *         2.    codeing
 *           xxxxxxxxx
 *               codeing
 *               codeing
 */

Md.extend("syntax/code", function(require) {

    var Node = require("node");
    var TextNode = require("text-node");

    function Code(dialect) {
        var block = dialect.getSyntax("block");
        block.extend(this);
    }

    Code.prototype.parse = function(str, queue) {

        var linePattern = /^(?: {0,3}\t| {4})(.*)\n?/mg,
            typePattern = /\s*\[(.*?)\](?:\s*\[(.*?)\])?[ \t]*/,
            codes = [],
            line = null,
            type = {
                language: null,
                lineNum: 0
            },
            node = null,
            lastIndex = 0;

        if (!(/^(?: {0,3}\t| {4})(.*)/.test(str))) {
            return null;
        }

        for (line = linePattern.exec(str); !!line; line = linePattern.exec(str)) {
            codes.push(line[1]);
            lastIndex = linePattern.lastIndex;
        }

        if (lastIndex < str.length) {
            // 截取剩余部分
            queue.push(str.substr(lastIndex));
        }

        line = typePattern.exec(codes[0]);
        if (line) {

            codes.shift();

            if (line[1]) {
                type.language = line[1];
            }

            if (line[2]) {
                type.lineNum = line[2];
            }

        }

        node = new Node("pre").appendChild(
            new Node("code").appendChild(
                new TextNode(codes.join("\n"))
            )
        );

        return node;

    };

    return Code;

});
