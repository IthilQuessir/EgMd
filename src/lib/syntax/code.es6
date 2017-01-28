/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

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
exports.parse = function(s_node) {

    if (s_node.flag !== 'block') {
        return null;
    }

    var str = s_node.text,
        linePattern = /^(?: {0,3}\t| {4})(.*)\n?/mg,
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

    node = new ElNode("pre").appendChild(
        new ElNode("code").appendChild(
            new TxtNode(codes.join("\n"))
        )
    );
    var container = new ElNode().appendChild(node);


    if (lastIndex < str.length) {
        // 截取剩余部分
        container.appendChild(new TxtNode(str.substr(lastIndex), "block"));
    }

    return container;
};
