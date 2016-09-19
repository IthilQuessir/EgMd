(function() {

    function inlinePlainText() {
    }

    inlinePlainText.prototype.parse = function (str) {
        return new TextNode(str);
    };

    Inline.expend(inlinePlainText);
}());
