/*jshint esversion: 6 */
import ElNode from "../el_node";
import TxtNode from "../txt_node";

function buildTable(title, align, ctn) {

    var table = new ElNode("table");

    table.appendChild(buildTHead(title, align))
        .appendChild(buildTBody(ctn, align));

    return table;

}

function buildTHead(title, align) {

    var tr = new ElNode("tr"),
        txt = null;

    title.forEach(function(t, i) {

        txt = new TxtNode(t, "inline");
        txt = new ElNode("th").appendChild(txt);

        if (align[i]) {
            txt.attr("align", align[i]);
        }

        tr.appendChild(txt);

    });

    return new ElNode("thead").appendChild(tr);
}

function buildTBody(ctn, align) {

    var tr = null,
        txt = null,
        tbody = new ElNode("tbody");

    ctn.forEach(function(row) {

        tr = new ElNode("tr");

        row.forEach(function(cell, i) {
            txt = new ElNode("td")
                .appendChild(new TxtNode(cell, "inline"));

            if (align[i]) {
                txt.attr("align", align[i]);
            }

            tr.appendChild(txt);
        });

        tbody.appendChild(tr);

    });

    return tbody;

}

exports.parse = function(s_node) {

    if (s_node.flag !== "block") return null;

    var source = s_node.text,
        pattern = /^ {0,3}((?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))\n {0,3}((?:(?:\|\s*(?::\s*)?-[-\s]*(?::\s*)?)+\|?)|(?:(?:\|\s*)?(?::\s*)?-[-\s]*(?::\s*)?(?:(?:\|(?::\s*)?-[-\s]*(?::\s*)?)+\|?|\|)))\n((?: {0,3}(?:(?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))(?:\n|$))+)/,
        reg = source.match(pattern),
        title, align, ctn;

    if (!reg) {
        return null;
    }

    function cleanBothEnds(str) {
        return str.replace(/^\s*\|/, "")
            .replace(/\s*$/, "")
            .replace(/\|$/, "");
    }

    title = cleanBothEnds(reg[1]).split("|");

    align = cleanBothEnds(reg[2]).split("|").map(function(a) {

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

    ctn = cleanBothEnds(reg[3]).split("\n").map(function(n) {
        return cleanBothEnds(n).split("|");
    });

    return buildTable( title, align, ctn);
};
