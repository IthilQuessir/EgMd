Md.extend("syntax/horiz-line", function(require) {

    var Node = require("node");

    var className = {
        dash: "dash",
        underline: "underline",
        asterisk: "asterisk"
    };

    function HorizLine(dialect) {
        var block = dialect.getSyntax("block");
        block.extend(this);
    }

    HorizLine.prototype.parse = function(str, queue) {

        var a = {s: str};
        console.log("[HorizLine parse] " , a);

        var pattern = /^(?:([\s\S]*?)\n)?[ \t]*(([-_*])(?:[ \t]*\3){2,})[ \t]*(?:\n([\s\S]*))?$/,
            reg = str.match(pattern),
            node = null;

        if (!reg) {
            return null;
        }

        // 在hr之前又内容，将内容分割后重新放回流
        if (reg[1]) {
            queue.push(reg[1]);
            queue.push(reg[2]);
            if (reg[4]) {
                queue.push(reg[4]);
            }

            return null;
        }

        node = new Node("hr");

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

        // hr之后有剩余内容
        if (reg[4]) {
            queue.push(reg[4]);
        }

        return node;
    };

    return HorizLine;
});
