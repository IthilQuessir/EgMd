Md.extend("syntax/blockquote", function(require) {

    var Node = require("node");

    function Blockquote(dialect) {

        this.block = dialect.getSyntax("block");
        this.block.extend(this);

    }

    Blockquote.prototype.parse = function(source, queue) {

        var reg = source.match(/^(?:>\s*.*[\n$])+/m),
            str = null;

        if (!reg) {
            return null;
        } else if (!!reg.index) {

            queue.push(source.substring(0, reg.index));
            queue.push(reg[0]);
            queue.push(source.substr(reg.index + reg[0].length));

            return null;

        } else if (reg[0].length < source.length) {
            queue.push(source.substr(reg[0].length));
        }

        str = reg[0].replace(/^>[ \f\r\t\v]*/mg, "");

        return new Node("blockquote")
            .appendChild(this.block.parse(str));

    };

    return Blockquote;

});
