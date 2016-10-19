Md.extend("combin-block", function (require) {

    function CombinBlock(dialect) {

        this.block = dialect.getSyntax("block");
        this.block.extend(this);

    }

    CombinBlock.prototype.parse = function (str) {

        var pattern = /($|\n(?:\s*\n|\s*$)+)/,
            queue = str.split(pattern);

        // 匹配起始空白行
        // reg = /^(\s*\n)/.exec(str);
        // if ( reg !== null) {
        //     pattern.lastIndex = reg[0].length;
        // }

        console.log(queue);

        if (queue.length > 1) {
            // TODO 解析模块
        } else {
            return null;
        }

    };

    return CombinBlock;
});
