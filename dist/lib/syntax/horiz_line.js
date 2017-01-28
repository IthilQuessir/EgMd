"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
var className = {
    dash: "dash",
    underline: "underline",
    asterisk: "asterisk"
};

exports.parse = function (s_node) {

    if (s_node.flag !== "block") return null;

    var str = s_node.text,
        pattern = /^(?:([\s\S]*?)\n)?[ \t]*(([-_*])(?:[ \t]*\3){2,})[ \t]*(?:\n([\s\S]*))?$/,
        reg = str.match(pattern),
        node = null,
        container = null;

    if (!reg) {
        return null;
    }

    container = new _el_node2.default();

    if (reg[1]) {
        node = new _txt_node2.default(reg[1], "block");
        container.appendChild(node);
    }

    node = new _el_node2.default("hr");

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
        node = new _txt_node2.default(reg[4], "block");
        container.appendChild(node);
    }

    return container;
};