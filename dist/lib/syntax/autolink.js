"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
exports.parse = function (s_node) {

    if (s_node.flag !== "inline") {
        return null;
    }

    var str = s_node.text,
        pattern = /<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/,
        reg = str.match(pattern),
        container = new _el_node2.default(),
        node = null;

    if (!reg) {
        return null;
    }

    if (reg.index) {

        node = new _txt_node2.default(str.substring(0, reg.index), "inline");
        container.appendChild(node);
    }

    node = new _el_node2.default("a", "autolink");

    if (reg[3]) {

        node.attr("href", "mailto:" + reg[3]);
        node.appendChild(new _txt_node2.default(reg[3]));
    } else if (reg[2] === "mailto") {

        node.attr("href", encodeURI(reg[1]));
        node.appendChild(new TextNode(reg[1].substr("mailto:".length)));
    } else {

        node.attr("href", encodeURI(reg[1]));
        node.appendChild(new TextNode(reg[1]));
    }

    container.appendChild(node);

    if (reg.index + reg[0].length < str.length) {

        node = new _txt_node2.default(str.substr(reg.index + reg[0].length), "inline");
        container.appendChild(node);
    }

    return container;
};