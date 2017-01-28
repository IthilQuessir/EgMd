"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FIXME 最后一个\n符号可能被写入到内容中
/*jshint esversion: 6 */
exports.parse = function (s_node) {

    if (s_node.flag !== "block") {
        return null;
    }

    var node = new _el_node2.default("p");
    node.appendChild(new _txt_node2.default(s_node.text, "inline"));

    return node;
};