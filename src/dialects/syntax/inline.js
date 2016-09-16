function Inline() {
    this.expendGrammars = [];

    this.pattern = null;
}

Inline.prototype.check = function (str) {

};

Inline.prototype.resetCheckPattern = function() {

}

Inline.prototype.parse = function (str) {



    return new textNode(str);
};

Inline.prototype.expend = function (grammar) {
    this.expendGrammars.push(grammar);
};
