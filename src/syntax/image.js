Md.extend("syntax/image", function(require) {

    var Node = require("node");

    function Image(dialect) {

        var inline = dialect.getSyntax("inline");
        inline.extend(this);

    }

    Image.prototype.parse = function(source, queue) {

        var pattern = /!\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,
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

        node = new Node("img");

        node.attr("alt", reg[1])
            .attr("src", reg[2]);

        if (reg[4]) {
            node.attr("title", "reg[4]");
        }

        return node;

    };

    return Image;
});
