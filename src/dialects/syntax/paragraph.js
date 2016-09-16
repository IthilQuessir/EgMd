(function(undefined) {

    // var Block = global.Block;

    function Paragraph() {}

    Paragraph.prototype.parse = function(str) {

        var node = new Node("p");

        node.addChild(new TextNode(str));

        return node;
    };

    Block.expend(Paragraph);

}());
