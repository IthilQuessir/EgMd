Md.extend("syntax/paragraph", function (require) {

    var Node = require("node");

    function Paragraph() {}

    Paragraph.prototype.parse = function(str) {

        var node = new Node("p"),
            inline = new Inline();

        node.appendChild(inline.parse(str));

        return node;
    };

    return Paragraph;

});
