Md.extend("syntax/hyperlink", function(require) {

    var Node = require("node"),
        TextNode = require("text-node");

    function Hyperlink(dialect) {
        var inline = dialect.getSyntax("inline");
        inline.extend(this);

    }

    Hyperlink.prototype.parse = function(source, queue) {

        var pattern = /\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,
            reg = source.match(pattern),
            node = null;

        if (!reg) {
            return null;
        } else if (reg.index) {
            queue.push(source.substring(0, reg.index));
            queue.push(reg[0]);
            queue.push(source.substr(reg.index + reg[0].length));

            return null;
        } else if (reg[0].length < source.length) {
            queue.push(source.substr(reg[0].length));
        }

        console.log(reg);


        node = new Node("a");
        node.appendChild(new TextNode(reg[1]));
        node.attr("href", reg[2])
            .attr("title", reg[4]);

        return node;
    };

    return Hyperlink;
});
