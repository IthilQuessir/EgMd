/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

exports.parse = function(s_node) {

    if (s_node.flag !== "inline") return null;

    var source = s_node.text,
        pattern = /!\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,
        reg = source.match(pattern),
        node = null,
        container = null;

    if (!reg) {
        return null;
    }

    container = new ElNode();

    if (reg.index) {
        node = new TxtNode(source.substring(0, reg.index), "inline");
        container.appendChild(node);
    }

    node = new ElNode("img");
    node.attr("alt", reg[1])
        .attr("src", reg[2]);

    if (reg[4]) {
        node.attr("title", "reg[4]");
    }

    container.appendChild(node);
    
    if (reg.index + reg[0].length < source.length) {
        node = new TxtNode(source.substr(reg.index + reg[0].length), "inline");
        container.appendChild(node);
    }

    return container;
};
