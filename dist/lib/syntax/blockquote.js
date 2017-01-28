"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
exports.parse = function (s_node) {

    if (s_node.flag !== "block") {
        return null;
    }

    var source = s_node.text,
        reg = source.match(/^(?:>\s*.*[\n$])+/m),
        node = null,
        container = new _el_node2.default(""),
        str = null;

    if (!reg) {
        return null;
    }

    if (!!reg.index) {
        node = new _txt_node2.default(source.substring(0, reg.index), "block");
        container.appendChild(node);
    }

    str = reg[0].replace(/^>[ \f\r\t\v]*/mg, "");

    node = new _el_node2.default("blockquote").appendChild(new _txt_node2.default(str, "blocks"));

    container.appendChild(node);

    if (reg.index + reg[0].length < source.length) {
        node = new _txt_node2.default(source.substr(reg.index + reg[0].length), "block");
        container.appendChild(node);
    }

    return container;
};