var Block = (function(global, undefined) {

    var expendGrammars = [];

    function Block() {}

    Block.prototype.parse = function(str, queue) {

        var i = -1,
            len = expendGrammars.length,
            rs = null,
            grammar = null,
            stack = null;

        while (++i < len) {

            grammar = new expendGrammars[i]();
            stack = [];

            rs = grammar.parse(str, stack);

            if (stack.length && rs === null) {

                stack.reverse();
                str = stack.pop();
                queue.push.apply(queue, stack);

                continue;
            } else if (stack.length) {

                stack.reverse();
                queue.push.apply(queue, stack);

                break;
            } else if (rs !== null ) {
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
