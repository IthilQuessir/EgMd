/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

// FIXME 最后一个\n符号可能被写入到内容中
exports.parse = function(s_node) {

    if (s_node.flag !== "block") {
        return null;
    }

    var node = new ElNode("p");
    node.appendChild(new TxtNode(s_node.text, "inline"));

    return node;
};
