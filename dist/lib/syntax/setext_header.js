"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
exports.parse = function (s_node) {

    var pattern = /^(.*)\n([-=])\2\2+(?:\n|$)/,
        str = s_node.text,
        reg = null,
        level = "",
        node = null,
        container = new _el_node2.default("", "atx-header");

    if (s_node.flag !== "block" || !pattern.test(str)) {
        return null;
    }

    reg = str.match(pattern);

    level = reg[2] === "=" ? "h1" : "h2";
    node = new _el_node2.default(level);

    node.appendChild(new _txt_node2.default(reg[1], "inline"));
    container.appendChild(node);

    // 字符串尾部还有其余内容
    if (reg[0].length < str.length) {

        node = new _txt_node2.default(str.substr(reg[0].length), "block");
        container.appendChild(node);
    }

    return container;
};