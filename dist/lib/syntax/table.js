"use strict";

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
function buildTable(title, align, ctn) {

    var table = new _el_node2.default("table");

    table.appendChild(buildTHead(title, align)).appendChild(buildTBody(ctn, align));

    return table;
}

function buildTHead(title, align) {

    var tr = new _el_node2.default("tr"),
        txt = null;

    title.forEach(function (t, i) {

        txt = new _txt_node2.default(t, "inline");
        txt = new _el_node2.default("th").appendChild(txt);

        if (align[i]) {
            txt.attr("align", align[i]);
        }

        tr.appendChild(txt);
    });

    return new _el_node2.default("thead").appendChild(tr);
}

function buildTBody(ctn, align) {

    var tr = null,
        txt = null,
        tbody = new _el_node2.default("tbody");

    ctn.forEach(function (row) {

        tr = new _el_node2.default("tr");

        row.forEach(function (cell, i) {
            txt = new _el_node2.default("td").appendChild(new _txt_node2.default(cell, "inline"));

            if (align[i]) {
                txt.attr("align", align[i]);
            }

            tr.appendChild(txt);
        });

        tbody.appendChild(tr);
    });

    return tbody;
}

exports.parse = function (s_node) {

    if (s_node.flag !== "block") return null;

    var source = s_node.text,
        pattern = /^ {0,3}((?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))\n {0,3}((?:(?:\|\s*(?::\s*)?-[-\s]*(?::\s*)?)+\|?)|(?:(?:\|\s*)?(?::\s*)?-[-\s]*(?::\s*)?(?:(?:\|(?::\s*)?-[-\s]*(?::\s*)?)+\|?|\|)))\n((?: {0,3}(?:(?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))(?:\n|$))+)/,
        reg = source.match(pattern),
        title,
        align,
        ctn;

    if (!reg) {
        return null;
    }

    function cleanBothEnds(str) {
        return str.replace(/^\s*\|/, "").replace(/\s*$/, "").replace(/\|$/, "");
    }

    title = cleanBothEnds(reg[1]).split("|");

    align = cleanBothEnds(reg[2]).split("|").map(function (a) {

        var reg = a.match(/\s*(:)?[-\s]+(:)?/);

        if (!!reg[1] && !!reg[2]) {
            // center
            return "center";
        } else if (!!reg[1]) {
            // left
            return "left";
        } else if (!!reg[2]) {
            // right
            return "right";
        } else {
            return null;
        }
    });

    ctn = cleanBothEnds(reg[3]).split("\n").map(function (n) {
        return cleanBothEnds(n).split("|");
    });

    return buildTable(title, align, ctn);
};