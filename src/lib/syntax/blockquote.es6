/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

exports.parse = function(s_node) {

    if (s_node.flag !== "block") {
        return null;
    }

    var source = s_node.text,
        reg = source.match(/^(?:>\s*.*[\n$])+/m),
        node = null,
        container = new ElNode(""),
        str = null;

    if (!reg) {
        return null;
    }

    if (!!reg.index) {
        node = new TxtNode(source.substring(0, reg.index), "block");
        container.appendChild(node);
    }

    str = reg[0].replace(/^>[ \f\r\t\v]*/mg, "");

    node = new ElNode("blockquote")
        .appendChild(new TxtNode(str, "blocks"));

    container.appendChild(node);


    if (reg.index + reg[0].length < source.length) {
        node = new TxtNode(source.substr(reg.index + reg[0].length), "block");
        container.appendChild(node);
    }

    return container;

};
