var Blocks = (function(undefined) {

    // var Block = this.Block;

    function Blocks() {
        this.blockGrammar = new Block();
    }

    Blocks.prototype.parse = function(str) {

        var pattern = /([\s\S]+?)($|\n(?:\s*\n|\s*$)+)/g,
            queue = [],
            reg = null,
            parseRs = null,
            node = new Node("");

        // 匹配起始空白行
        reg = /^(\s*\n)/.exec(str);
        if ( reg !== null) {
            pattern.lastIndex = reg[0].length;
        }

        reg = pattern.exec(str);
        while (reg !== null) {
            queue.push(reg[1]);
            reg = pattern.exec(str);
        }

        // 这里主要目的是之后在向头部插入时使用push而不是unshif，因为unshift在IE中有BUG
        queue.reverse();

        while (queue.length) {
            parseRs = this.blockGrammar.parse(queue.pop(), queue);

            if(parseRs !== null) {
                node.appendChild(parseRs);
            }
        }

        return node;
    };

    return Blocks;
}());
