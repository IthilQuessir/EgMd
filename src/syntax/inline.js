Md.extend("syntax/inline", function(require) {

    var Node = require("node");

    function Inline() {
        this.lib = [];
    }

    Inline.prototype.extend = function(syntax) {
        // XXX 未去重
        this.lib.push(syntax);
    };

    Inline.prototype.parse = function(str) {

        var queue = [str],
            stack = null,
            i,
            len = this.lib.length,
            rs = null,
            node = new Node();

            console.log("[Inline parse]", str);

        do {

            str = queue.pop();

            for (i = 0; i < len; i++) {

                stack = [];
                rs = this.lib[i].parse(str, stack);

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

    return Inline;
});
