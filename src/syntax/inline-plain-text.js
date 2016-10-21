Md.extend("syntax/inline-plain-text", function(require) {

    var TextNode = require("text-node");

    function PlainText(dialect) {
        var inline = dialect.getSyntax("inline");
        inline.extend(this);
    }

    PlainText.prototype.parse = function(str) {
        return new TextNode(str);
    };

    return PlainText;

});
