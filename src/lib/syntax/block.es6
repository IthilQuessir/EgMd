/*jshint esversion: 6 */
import TxtNode from "../txt_node";
import ElNode from "../el_node";

exports.parse = function(s_node) {

    if (s_node.flag !== "blocks") {
        return null;
    }

    var pattern = /(?:^\s*\n)/m,
        blocks = s_node.text.split(/(?:^\s*\n)/m),
        container = new ElNode(),
        tNode = null;

    for (let block of blocks) {
        tNode = new TxtNode(block, "block");
        container.appendChild(tNode);
    }

    return container;

};
