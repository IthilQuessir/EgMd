Md.extend("syntax/paragraph", function (require) {

    var Node = require("node");

    function Paragraph(dialect) {
        block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    // FIXME 最后一个\n符号可能被写入到内容中
    Paragraph.prototype.parse = function(str) {

        var node = new Node("p");

        node.appendChild(this.inline.parse(str));

        return node;
    };

    return Paragraph;

});
