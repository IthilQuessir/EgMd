"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
exports.parse = function (s_node) {

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

    container = new _el_node2.default();

    if (reg.index) {
        container.appendChild(new _txt_node2.default(str.substring(0, reg.index), "inline"));
    }

    container.appendChild(new _txt_node2.default(reg[1], "escaped"));

    if (reg.index + reg[0].length < str.length) {
        container.appendChild(new _txt_node2.default(str.substr(reg.index + reg[0].length), "inline"));
    }

    return container;
};