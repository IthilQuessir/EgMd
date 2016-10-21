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

    Block.expend = function(grammar) {
        expendGrammars.push(grammar);
    };

    return Block;
});

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

/**
 * 语法事例:
 * # 标题
 * #标题
 * ###### 标题
 */

Md.extend("syntax/atx-header", function (require) {

    var Node = require("node");

    var pattern = /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/;

    function AtxHeader(dialect) {

        var block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    AtxHeader.prototype.parse = function(str, queue) {

        if (!pattern.test(str)) {
            return null;
        }

        var reg = str.match(pattern);
        var header = new Node("h" + reg[1].length);

        header.appendChild(this.inline.parse(reg[2]));

        if (reg[0].length < str.length) {
            // 将没有解析的尾部放回队列
            queue.push(str.substr(reg[0].length));
        }

        return header;
    };

    return AtxHeader;
});

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

Md.extend("syntax/horiz-line", function(require) {

    var Node = require("node");

    var className = {
        dash: "dash",
        underline: "underline",
        asterisk: "asterisk"
    };

    function HorizLine(dialect) {
        var block = dialect.getSyntax("block");
        block.extend(this);
    }

    HorizLine.prototype.parse = function(str, queue) {

        var a = {s: str};

        var pattern = /^(?:([\s\S]*?)\n)?[ \t]*(([-_*])(?:[ \t]*\3){2,})[ \t]*(?:\n([\s\S]*))?$/,
            reg = str.match(pattern),
            node = null;

        if (!reg) {
            return null;
        }

        // 在hr之前又内容，将内容分割后重新放回流
        if (reg[1]) {
            queue.push(reg[1]);
            queue.push(reg[2]);
            if (reg[4]) {
                queue.push(reg[4]);
            }

            return null;
        }

        node = new Node("hr");

        switch (reg[3]) {
            case '-':
                node.attr("class", className.dash);
                break;
            case '_':
                node.attr("class", className.underline);
                break;
            case '*':
                node.attr("class", className.asteris);
                break;
                // No Default;
        }

        // hr之后有剩余内容
        if (reg[4]) {
            queue.push(reg[4]);
        }

        return node;
    };

    return HorizLine;
});

Md.extend("syntax/paragraph", function (require) {

    var Node = require("node");

    function Paragraph(dialect) {
        block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    Paragraph.prototype.parse = function(str) {

        var node = new Node("p");

        node.appendChild(this.inline.parse(str));

        return node;
    };

    return Paragraph;

});

Md.extend("syntax/escaped", function(require) {

    var TextNode = require("text-node");

    function Escaped(dialect) {
        var inline = dialect.getSyntax("inline");
        inline.extend(this);
    }

    Escaped.prototype.parse = function(str, queue) {

        // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
        var pattern = /\\([\\`\*_{}\[\]()#\+.!\-])/,
            reg = pattern.exec(str),
            rs = null;

        if (!pattern.test(str)) {
            return null;
        }

        if (reg.index === 0) {
            queue.push(str.substr(reg[0].length));
            return new TextNode(reg[1]);
        } else {
            queue.push(str.substring(0, reg.index));
            queue.push(str.substr(reg.index));
            return null;
        }

        return rs;
    };

    return Escaped;
});

Md.extend("syntax/inline-plain-text", function(require) {

    var TextNode = require("text-node");

    function PlainText(dialect) {
        var inline = dialect.getSyntax("inline");
        inline.extend(this);
    }

    PlainText.prototype.parse = function(str) {
        return new TextNode(str);
    };

    return PlainText;

});

Md.extend("dialects/office", function(require) {

    var DialectBuilder = require("dialect-builder");

    return new DialectBuilder()
        .setSyntax([
            

                "block" ,

            

                "inline" ,

            

                "combin-block" ,

            

                "atx-header" ,

            

                "setext-header" ,

            

                "horiz-line" ,

            

                "paragraph" ,

            

                "escaped" ,

            

                "inline-plain-text" 

            
        ])
        .build();

});