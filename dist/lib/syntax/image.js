"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
exports.parse = function (s_node) {

    if (s_node.flag !== "inline") return null;

    var source = s_node.text,
        pattern = /!\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,
        reg = source.match(pattern),
        node = null,
        container = null;

    if (!reg) {
        return null;
    }

    container = new _el_node2.default();

    if (reg.index) {
        node = new _txt_node2.default(source.substring(0, reg.index), "inline");
        container.appendChild(node);
    }

    node = new _el_node2.default("img");
    node.attr("alt", reg[1]).attr("src", reg[2]);

    if (reg[4]) {
        node.attr("title", reg[4]);
    }

    container.appendChild(node);

    if (reg.index + reg[0].length < source.length) {
        node = new _txt_node2.default(source.substr(reg.index + reg[0].length), "inline");
        container.appendChild(node);
    }

    return container;
};