/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

exports.parse = function(s_node) {

    if (s_node.flag !== "inline") {
        return null;
    }

    var str = s_node.text,
        pattern = /<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/,
        reg = str.match(pattern),
        container = new ElNode(),
        node = null;

    if (!reg) {
        return null;
    }

    if (reg.index) {

        node = new TxtNode(str.substring(0, reg.index), "inline");
        container.appendChild(node);

    }



    node = new ElNode("a", "autolink");

    if (reg[3]) {

        node.attr("href", "mailto:" + reg[3]);
        node.appendChild(new TxtNode(reg[3]));

    } else if (reg[2] === "mailto") {

        node.attr("href", encodeURI(reg[1]));
        node.appendChild(new TextNode(reg[1].substr("mailto:".length)));

    } else {

        node.attr("href", encodeURI(reg[1]));
        node.appendChild(new TextNode(reg[1]));

    }

    container.appendChild(node);


    if (reg.index + reg[0].length < str.length) {

        node = new TxtNode(str.substr(reg.index + reg[0].length), "inline");
        container.appendChild(node);

    }

    return container;

};
