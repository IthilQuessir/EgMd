/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

var className = {
    dash: "dash",
    underline: "underline",
    asterisk: "asterisk"
};

exports.parse = function(s_node) {

    if (s_node.flag !== "block") return null;

    var str = s_node.text,
        pattern = /^(?:([\s\S]*?)\n)?[ \t]*(([-_*])(?:[ \t]*\3){2,})[ \t]*(?:\n([\s\S]*))?$/,
        reg = str.match(pattern),
        node = null,
        container = null;

    if (!reg) {
        return null;
    }

    container = new ElNode();

    if (reg[1]) {
        node = new TxtNode(reg[1], "block");
        container.appendChild(node);
    }

    node = new ElNode("hr");

    switch (reg[3]) {
        case '-':
            node.attr("class", className.dash);
            break;
        case '_':
            node.attr("class", className.underline);
            break;
        case '*':
            node.attr("class", className.asteris);
            break;
            // No Default;
    }

    container.appendChild(node);


    // hr之后有剩余内容
    if (reg[4]) {
        node = new TxtNode(reg[4], "block");
        container.appendChild(node);
    }

    return container;
};
