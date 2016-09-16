var TextNode = (function() {

    function TextNode(str) {
        this.text = str;
    }

    TextNode.prototype.toHtml = function () {
        return document.createTextNode(this.text);
    };

    return TextNode;
}());
