Md.extend("syntax/block", function(require) {

    var Node = require("node");

    function Block() {
        this.lib = [];
    }

    // XXX 没有去重
    Block.prototype.extend = function(syntax) {
        this.lib.push(syntax);
    };

    Block.prototype.parse = function(str) {

        var queue = [str],
            stack = null,
            i,
            len = this.lib.length,
            rs = null,
            node = new Node();


        do {

            console.log("[Block parse1] ", str, queue);
            str = queue.pop();
            console.log("[Block parse2] ", str, queue);

            for (i = 0; i < len; i++) {

                stack = [];
                rs = this.lib[i].parse(str, stack);

                console.log("[Block parse] try result ", rs, stack );

                if (stack.length) {
                    stack.reverse();
                    queue.push.apply(queue, stack);
                }

                if (rs) {
                    node.appendChild(rs);
                    break;
                } else if (stack.length) {
                    str = queue.pop();
                }

            }

        } while (queue.length);


        return node;

    };

    Block.expend = function(grammar) {
        expendGrammars.push(grammar);
    };

    return Block;
});
