"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
exports.parse = function (s_node) {

    var pattern = /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/;

    if (s_node.flag !== "block" || !pattern.test(s_node.text)) {
        return null;
    }

    var str = s_node.text,
        reg = str.match(pattern),
        header = new _el_node2.default("h" + reg[1].length, "atx-header"),
        container = new _el_node2.default();

    header.appendChild(new _txt_node2.default(reg[2], "inline"));

    container.appendChild(header);

    // 将结尾放回
    if (reg[0].length < str.length) {
        var node = new _txt_node2.default(str.substr(reg[0].length), "block");
        container.appendChild(node);
    }

    return container;
};