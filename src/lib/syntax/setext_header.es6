/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

exports.parse = function(s_node) {

    var pattern = /^(.*)\n([-=])\2\2+(?:\n|$)/,
        str = s_node.text,
        reg = null,
        level = "",
        node = null,
        container = new ElNode("", "atx-header");

    if (s_node.flag !== "block" || !pattern.test(str)) {
        return null;
    }

    reg = str.match(pattern);

    level = (reg[2] === "=") ? "h1" : "h2";
    node = new ElNode(level);

    node.appendChild(new TxtNode(reg[1], "inline"));
    container.appendChild(node);

    // 字符串尾部还有其余内容
    if (reg[0].length < str.length) {

        node = new TxtNode(str.substr(reg[0].length), "block");
        container.appendChild(node);

    }

    return container;

};
