Md.extend("syntax/combin-block", function(require) {

    var Node = require("node");

    function CombinBlock(dialect) {

        this.block = dialect.getSyntax("block");
        this.block.extend(this);

    }

    CombinBlock.prototype.parse = function(str) {

        var pattern = /(?:^\s*\n)/m,
            queue = str.split(/(?:^\s*\n)/m),
            that = this;

        console.log("[CombinBlock parse] ", queue, queue.length);

        if (queue.length > 1) {

            return (function() {

                var node = new Node(),
                    i = 0,
                    len = queue.length;

                for (; i < len; i++) {
                    node.appendChild(that.block.parse(queue[i]));
                }

                return node;

            }());

        } else {
            return null;
        }

    };

    return CombinBlock;
});
