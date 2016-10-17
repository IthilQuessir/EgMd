(function(undefined) {

    // var Block = global.Block;

    function Paragraph() {}

    Paragraph.prototype.parse = function(str) {

        var node = new Node("p"),
            inline = new Inline();

        node.appendChild(inline.parse(str));

        return node;
    };

    Block.expend(Paragraph);

}());
