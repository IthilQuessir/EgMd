/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

exports.parse = function(s_node) {

    if (s_node.flag !== "inline") return null;

    // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
    var str = s_node.text,
        pattern = /\\([\\`\*_{}\[\]()#\+.!\-])/,
        reg = pattern.exec(str),
        rs = null,
        container = null;

    if (!pattern.test(str)) {
        return null;
    }

    container = new ElNode();

    if (reg.index) {
        container.appendChild(new TxtNode(str.substring(0, reg.index), "inline"));
    }

    container.appendChild(new TxtNode(reg[1], "escaped"));

    if (reg.index + reg[0].length < str.length) {
        container.appendChild(new TxtNode(str.substr(reg.index + reg[0].length), "inline"));
    }

    return container;
};
