Md.extend("syntax/autolink", function(require) {

    var Node = require("node"),
        TextNode = require("text-node");

    function AutoLink(dialect) {

        var inline = dialect.getSyntax("inline");
        inline.extend(this);
    }

    AutoLink.prototype.parse = function(source, queue) {

        var pattern = /<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/,
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

        node = new Node("a");

        if (reg[3]) {
            node.attr("href", "mailto:" + reg[3]);
            node.appendChild(new TextNode(reg[3]));
        } else if (reg[2] === "mailto") {
            node.attr("href", encodeURI(reg[1]));
            node.appendChild(new TextNode(reg[1].substr("mailto:".length)));
        } else {
            node.attr("href", encodeURI(reg[1]));
            node.appendChild(new TextNode(reg[1]));
        }

        return node;

    };

    return AutoLink;
});
