Md.extend("syntax/inline-plain-text", function(require) {

    var TextNode = require("text-node");

    function PlainText() {}

    PlainText.prototype.parse = function(str) {
        return new TextNode(str);
    };

    return PlainText;

});
