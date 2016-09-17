var Inline = (function() {

    var expendGrammars = [];

    function Inline() {
    }

    Inline.expend = function (grammar) {
        this.expendGrammars.push(grammar);
    };

    Inline.prototype.check = function (str) {

    };

    Inline.prototype.resetCheckPattern = function() {

    }

    Inline.prototype.parse = function (str) {

        return new textNode(str);
    };



}());
