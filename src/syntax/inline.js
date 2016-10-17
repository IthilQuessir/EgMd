var Inline = (function() {

    var expendGrammars = [];

    function Inline() {}

    Inline.expend = function(grammar) {
        expendGrammars.push(grammar);
    };

    Inline.prototype.parse = function(str) {

        var queue = [str],
            gammar = null,
            i = -1,
            len = expendGrammars.length,
            rs = null,
            stack = null,
            node = new Node("");

        while (queue.length) {

            i = -1;
            str = queue.pop();

            while (++i < len) {
                stack = [];
                gammar = new expendGrammars[i]();

                rs = gammar.parse(str, stack);

                if (stack.length && rs === null) {
                    // 语法仅对字符串结构进行调整，保障其优先级

                    stack.reverse();
                    str = stack.pop();
                    queue.push.apply(queue, stack);

                    continue;
                } else if (stack.length) {
                    // 语法解析字符串，并有部分尾部部分无法解析

                    stack.reverse();
                    queue.push.apply(queue, stack);

                    break;
                } else if (rs !== null) {
                    // 语法对字符串进行了完整成功的解析

                    break;
                }
            }

            if (rs !== null ) {
                node.appendChild(rs);
            }
        }

        return node;
    };

    return Inline;


}());
