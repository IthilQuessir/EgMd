/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

exports.parse = function(s_node) {

    var pattern = /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/;

    if (s_node.flag !== "block" || !pattern.test(s_node.text)) {
        return null;
    }


    var str = s_node.text,
        reg = str.match(pattern),
        header = new ElNode("h" + reg[1].length, "atx-header"),
        container = new ElNode();

    header.appendChild(new TxtNode(reg[2], "inline"));

    container.appendChild(header);

    // 将结尾放回
    if (reg[0].length < str.length) {
        var node = new TxtNode(str.substr(reg[0].length), "block");
        container.appendChild(node);
    }

    return container;

};
