var Block = (function(global, undefined) {

    var expendGrammars = [];

    function Block() {
    }

    Block.prototype.parse = function(str, queue) {

        var i = -1,
            len = expendGrammars.length,
            rs = null,
            grammar = null;

        while (++i < len) {
            grammar = new expendGrammars[i]();

            rs = grammar.parse(str, queue);
            if (rs !== null) {
                break;
            }
        }

        return rs;

    };

    Block.expend = function(grammar) {
        expendGrammars.push(grammar);
    };

    return Block;

}(this));
