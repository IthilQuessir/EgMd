Md.extend("syntax/table", function(require) {

    var Node = require("node");

    function Table(dialect) {

        var block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    Table.prototype.parse = function(source, queue) {

        var pattern = /^ {0,3}((?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))\n {0,3}((?:(?:\|\s*(?::\s*)?-[-\s]*(?::\s*)?)+\|?)|(?:(?:\|\s*)?(?::\s*)?-[-\s]*(?::\s*)?(?:(?:\|(?::\s*)?-[-\s]*(?::\s*)?)+\|?|\|)))\n((?: {0,3}(?:(?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))(?:\n|$))+)/,
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

        return buildTable.call(this, title, align, ctn);

    };

    function buildTable(title, align, ctn) {

        var table = new Node("table");

        table.appendChild(buildTHead.call(this, title, align))
            .appendChild(buildTBody.call(this, ctn, align));

        return table;

    }

    function buildTHead(title, align) {

        var tr = new Node("tr"),
            txt = null;

        title.forEach(function(t, i) {

            txt = this.inline.parse(t);
            txt = new Node("th").appendChild(txt);
            txt.attr("align", align[i]);

            if (align[i]) {
                txt.attr("align", align[i]);
            }

            tr.appendChild(txt);

        }, this);

        return new Node("thead").appendChild(tr);
    }

    function buildTBody(ctn, align) {

        var tr = new Node("tr"),
            txt = null,
            tbody = new Node("tbody");

        ctn.forEach(function(row) {

            tr = new Node("tr");

            row.forEach(function(cell, i) {
                txt = new Node("td").appendChild(this.inline.parse(cell));

                if (align[i]) {
                    txt.attr("align", align[i]);
                }

                tr.appendChild(txt);
            }, this);

            tbody.appendChild(tr);

        }, this);

        return tbody;

    }



    return Table;
});
