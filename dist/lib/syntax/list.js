"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * space's depth > depth return 1
 * space's depth < depth return -1
 * space's depth = depth return 0
 */
/*jshint esversion: 6 */

/**
 *  TODO  尚未对如下情况进行测试
 *
 *        以下是一个列表
 *        * 第一条
 *            * 子列表第一条
 *            * 子列表第二条
 *
 *        此时当list语法优先级高时，需要对列表结构进行提取
 */

function calcDepth(space, depth) {

    return space.replace(/(?: {0,3}\\t| {4})/, "\t").length;
}

/**
 * 循环解析同层li，递归解决不同层的list
 * 通过判断起始的空白符来确定这一行内容属于那一个层次
 * 同层的作为li解析，下一层的递归生成新的子列表
 *
 * @param {Array} line 待解析的行
 * @param {Int} depth 层次，起始0
 */
function mkList(lines, i, depth, cb) {

    var len = lines.length,
        list = new _el_node2.default("ul");

    // reg[1] = 空白符  reg[2] 前缀  reg[3] 内容
    var pattern = /^(\s*)([*+-]|\\d+\\.)[ \t]+(.*)/,
        reg = null,
        node = null,
        lineDepth;

    function nextDepthCb(list, index) {
        node = new _el_node2.default("li").appendChild(list);
        i = index;
    }

    for (; i < len; i++) {

        reg = lines[i].match(pattern);
        lineDepth = calcDepth(reg[1]);

        if (lineDepth > depth) {
            // 下一层列表的 li
            mkList(lines, i, depth + 1, nextDepthCb);
        } else if (lineDepth < depth) {
            // 上一层列表的li
            break;
        } else {
            // 当前列表的下一个li
            node = new _txt_node2.default(reg[3], "inline");
            node = new _el_node2.default("li").appendChild(node);
        }

        list.appendChild(node);
    }

    cb(list, i);
}

exports.parse = function (s_node) {

    if (s_node.flag !== "block") return null;

    var source = s_node.text,
        reg = source.match(/^(?: *(?:[*+-]|\\d+\\.)[ \t]+.*(\n|$))+/),
        lines = null,
        node = null,
        container = null;

    if (!reg) {
        return null;
    }

    container = new _el_node2.default();

    lines = reg[0].split("\n");
    if (lines[lines.length - 1] === "") {
        lines.pop();
    }

    mkList(lines, 0, 0, function (list) {
        container.appendChild(list);
    });

    if (reg[0].length < source.length) {
        node = new _txt_node2.default(source.substr(reg[0].length), "block");
        container.appendChild(node);
    }

    return container;
};