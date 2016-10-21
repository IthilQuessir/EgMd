Md.extend("syntax/setext-header", function(require) {

    var Node = require("node");

    function SetextHeader(dialect) {
        block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    SetextHeader.prototype.parse = function(str, queue) {

        var pattern = /^(.*)\n([-=])\2\2+(?:\n|$)/,
            reg = null,
            level = "",
            header = null,
            inline = null;

        if (!pattern.test(str)) {
            return null;
        }

        reg = str.match(pattern);

        level = (reg[2] === "=") ? "h1" : "h2";
        header = new Node(level);

        header.appendChild(this.inline.parse(reg[1]));

        // 字符串尾部还有其余内容，则将其放回队列头部
        if (reg[0].length < str.length) {
            queue.push(str.substr(reg[0].length));
        }

        return header;
    };

    return SetextHeader;
});
