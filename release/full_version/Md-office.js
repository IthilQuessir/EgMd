(function(global, undefined) {
    'use strict';

    var modules = {};

    function require(url) {

        var path = url.split("/"),
            i = 0,
            len = path.length,
            target = modules;

        for (; i < len; i++) {

            if (path[i] in target) {
                target = target[path[i]];
            } else {
                throw new Error("[Md require] Cannot find module: " + url);
            }

        }

        return target;

    }

    function extend(url, cb) {

        var path = url.split("/"),
            i = 0,
            len = path.length - 1,
            target = modules,
            theModule = null;

        for (; i < len; i++) {
            if (!(path[i] in target)) {
                target[path[i]] = {};
            }

            target = target[path[i]];
        }

        if (path[i] in target) {
            throw new Error("[Md extend] Module had existed;\nThe Url is " + url);
        }

        theModule = cb.call(target, require);

        if (theModule) {
            target[path[i]] = theModule;
        } else {
            throw new Error("[Md extend] Unexpected return of the module \"" + path[i] + "\"");
        }
    }

    function Md(str, options) {

        var dialects = require("dialects"),
            dialect = null,
            key;

        options = options || {};

        /**
         * 若配置的解析器不存在或者未配置
         * 则随意选择一个解析器作为默认解析器进行解析
         */
        if (options.dialect && options.dialect in dialects) {
            dialect = dialects[options.dialect];
        } else {
            for (key in dialects) {
                dialect = dialects[key];
                break;
            }
        }

        if (!dialect) {
            throw new Error("[Md] Plese use full_version or include dialect module\n" +
                "请使用完整版或者 Md-seed.js + dialect模块配合使用。" +
                "仅单独使用Md-seed.js是无法运行的");
        }

        str = str
            .replace(/^\s*\n/, "")
            .replace(/\s*$/, "");

        return dialect.parse(str).toHtml();

    }

    Md.extend = extend;

    global.Md = Md;

}(this));

Md.extend("attr", function (require) {

        function Attr() {
            this.list = {};
        }

        /**
         * 将属性名为name的属性值添加/修改为value
         *
         * @param {String} name  属性名
         * @param {String} value 属性值
         */
        Attr.prototype.add = function(name, value) {
            this.list[name] = value;
        };

        /**
         * 上属性名为name的属性移除
         *
         * @param {String} name 属性名
         */
        Attr.prototype.rm = function(name) {
            delete this.list[name];
        };

        Attr.prototype.get = function(name) {
            return this.list[name] || null;
        };

        Attr.prototype.forEach = function(cb) {
            var key,
                list = this.list;
            for (key in list) {
                if (list.hasOwnProperty(key)) {
                    cb.call(this, key, list[key]);
                }
            }
        };

        Attr.prototype.clone = function() {
            // TODO 深复制代码
        };

        return Attr;
});

Md.extend("dialect-builder", function (require) {

    function Dialect() {
        this.syntaxLib = {};
    }

    Dialect.prototype.parse = function (str) {

        if ("block" in this.syntaxLib) {
            return this.syntaxLib.block.parse(str);
        } else {
            throw new Error("[Dialect parse] Dialect must has extend block module");
        }

    };

    Dialect.prototype.extend = function (name, syntax) {

        this.syntaxLib[name] = new syntax(this);
    };

    Dialect.prototype.getSyntax = function (name) {

        if (name in this.syntaxLib) {
            return this.syntaxLib[name];
        } else {
            throw new Error("[Dialect getSyntax] This dialect hasn't syntax named " + name);
        }

    };

    function DialectBuilder() {
        this.list = [];
    }

    DialectBuilder.prototype.setSyntax = function (arr) {
        this.list.push.apply(this.list, arr);

        return this;
    };

    DialectBuilder.prototype.build = function () {

        var i = 0,
            len = this.list.length,
            syntax = null,
            dialect = new Dialect();

        for (; i < len; i ++) {

            syntax = require("syntax/" + this.list[i]);

            dialect.extend(this.list[i], syntax);

        }

        return dialect;

    };

    return DialectBuilder;

});

Md.extend("node", function(require) {

    var Attr = require("attr");

    function Node(tag) {
        this.__tag__ = tag ? tag : "";
        this.__attr__ = new Attr();
        this.children = [];
    }

    Node.prototype.attr = function(name, value) {

        // 如果没有传入value 则返回name对应属性名的值
        if (typeof value === "undefined") {
            return this.__attr__.get(name);
        } else {
            this.__attr__.add(name, value);
        }

        return this;
    };

    Node.prototype.rmAttr = function(name) {
        this.__attr__.rm(name);
        return this;
    };

    Node.prototype.appendChild = function(node) {
        this.children.push(node);
        return this;
    };

    Node.prototype.toHtml = function() {

        var dom = null,
            children = this.children,
            i = -1,
            len = children.length;

        if (this.__tag__ === "") {
            dom = document.createDocumentFragment();
        } else {
            dom = document.createElement(this.__tag__);

            this.__attr__.forEach(function(key, value) {
                dom.setAttribute(key, value);
            });

        }

        while (++i < len) {
            dom.appendChild(children[i].toHtml());
        }

        return dom;
    };

    return Node;
});

Md.extend("text-node", function(require) {

    function TextNode(str) {
        this.text = str;
    }

    TextNode.prototype.toHtml = function() {
        return document.createTextNode(this.text);
    };

    return TextNode;
});

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

Md.extend("syntax/blockquote", function(require) {

    var Node = require("node");

    function Blockquote(dialect) {

        this.block = dialect.getSyntax("block");
        this.block.extend(this);

    }

    Blockquote.prototype.parse = function(source, queue) {

        var reg = source.match(/^(?:>\s*.*[\n$])+/m),
            str = null;

        if (!reg) {
            return null;
        } else if (!!reg.index) {

            queue.push(source.substring(0, reg.index));
            queue.push(reg[0]);
            queue.push(source.substr(reg.index + reg[0].length));

            return null;

        } else if (reg[0].length < source.length) {
            queue.push(source.substr(reg[0].length));
        }

        str = reg[0].replace(/^>[ \f\r\t\v]*/mg, "");

        return new Node("blockquote")
            .appendChild(this.block.parse(str));

    };

    return Blockquote;

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

Md.extend("syntax/table", function(require) {

    var Node = require("node");

    function Table(dialect) {

        var block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");
    }

    Table.prototype.parse = function(source, queue) {

        var pattern = /^ {0,3}((?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))\n {0,3}((?:(?:\|\s*(?::\s*)?-[-\s]*(?::\s*)?)+\|?)|(?:(?:\|\s*)?(?::\s*)?-[-\s]*(?::\s*)?(?:(?:\|(?::\s*)?-[-\s]*(?::\s*)?)+\|?|\|)))\n((?: {0,3}(?:(?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))(?:\n|$))+)/,
            reg = source.match(pattern),
            title, align, ctn;

        if (!reg) {
            return null;
        }

        function cleanBothEnds(str) {
            return str.replace(/^\s*\|/, "")
                .replace(/\s*$/, "")
                .replace(/\|$/, "");
        }

        title = cleanBothEnds(reg[1]).split("|");

        align = cleanBothEnds(reg[2]).split("|").map(function(a) {

            var reg = a.match(/\s*(:)?[-\s]+(:)?/);

            if (!!reg[1] && !!reg[2]) {
                // center
                return "center";

            } else if (!!reg[1]) {
                // left
                return "left";

            } else if (!!reg[2]) {
                // right
                return "right";

            } else {
                return null;
            }

        });

        ctn = cleanBothEnds(reg[3]).split("\n").map(function(n) {
            return cleanBothEnds(n).split("|");
        });

        return buildTable.call(this, title, align, ctn);

    };

    function buildTable(title, align, ctn) {

        var table = new Node("table");

        table.appendChild(buildTHead.call(this, title, align))
            .appendChild(buildTBody.call(this, ctn, align));

        return table;

    }

    function buildTHead(title, align) {

        var tr = new Node("tr"),
            txt = null;

        title.forEach(function(t, i) {

            txt = this.inline.parse(t);
            txt = new Node("th").appendChild(txt);
            txt.attr("align", align[i]);

            if (align[i]) {
                txt.attr("align", align[i]);
            }

            tr.appendChild(txt);

        }, this);

        return new Node("thead").appendChild(tr);
    }

    function buildTBody(ctn, align) {

        var tr = new Node("tr"),
            txt = null,
            tbody = new Node("tbody");

        ctn.forEach(function(row) {

            tr = new Node("tr");

            row.forEach(function(cell, i) {
                txt = new Node("td").appendChild(this.inline.parse(cell));

                if (align[i]) {
                    txt.attr("align", align[i]);
                }

                tr.appendChild(txt);
            }, this);

            tbody.appendChild(tr);

        }, this);

        return tbody;

    }



    return Table;
});

/**
 *  TODO  尚未对如下情况进行测试
 *
 *        以下是一个列表
 *        * 第一条
 *            * 子列表第一条
 *            * 子列表第二条
 *
 *        此时当list语法优先级高时，需要对列表结构进行提取
 */

Md.extend("syntax/list", function(require) {

    var Node = require("node");

    function List(dialect) {

        var block = dialect.getSyntax("block");
        block.extend(this);

        this.inline = dialect.getSyntax("inline");

    }

    List.prototype.parse = function(source, queue) {

        var node = null,
            reg = source.match(/^(?: *(?:[*+-]|\\d+\\.)[ \t]+.*(\n|$))+/),
            leave = 0,
            lines = null,
            i, len, str, rs;

        if (!reg) {
            return null;
        } else if (reg[0].length < source.length) {
            queue.push(source.substr(reg[0].length));
        }

        lines = reg[0].split("\n");
        if (lines[lines.length - 1] === "") {
            lines.pop();
        }

        mkList.call(this, lines, 0, 0, function (list) {
            rs = list;
        });

        return rs;
    };


    /**
     * space's depth > depth return 1
     * space's depth < depth return -1
     * space's depth = depth return 0
     */
    function calcDepth(space, depth) {

        return space.replace(/(?: {0,3}\\t| {4})/, "\t").length;

    }

    /**
     * 循环解析同层li，递归解决不同层的list
     * 通过判断起始的空白符来确定这一行内容属于那一个层次
     * 同层的作为li解析，下一层的递归生成新的子列表
     *
     * @param {Array} line 待解析的行
     * @param {Int} depth 层次，起始0
     */
    function mkList(lines, i, depth, cb) {

        var len = lines.length,
            list = new Node("ul");

        // reg[1] = 空白符  reg[2] 前缀  reg[3] 内容
        var pattern = /^(\s*)([*+-]|\\d+\\.)[ \t]+(.*)/,
            reg = null,
            node = null,
            lineDepth;

        function nextDepthCb(list, index) {
            node = new Node("li").appendChild(list);
            i = index;
        }

        for (; i < len; i++) {

            reg = lines[i].match(pattern);
            lineDepth = calcDepth(reg[1]);

            if (lineDepth > depth) {
                // 下一层列表的 li
                mkList.call(this, lines, i, depth + 1, nextDepthCb);

            } else if (lineDepth < depth) {
                // 上一层列表的li
                break;
            } else {
                // 当前列表的下一个li
                node = this.inline.parse(reg[3]);
                node = new Node("li").appendChild(node);
            }

            list.appendChild(node);

        }

        cb(list, i);

    }





    return List;

});

/**
 * XXX 尚未测试如下事例
 *         1.xxxxxxxxx
 *               codeing
 *               codeing
 *
 *         2.    codeing
 *           xxxxxxxxx
 *               codeing
 *               codeing
 */

Md.extend("syntax/code", function(require) {

    var Node = require("node");
    var TextNode = require("text-node");

    function Code(dialect) {
        var block = dialect.getSyntax("block");
        block.extend(this);
    }

    Code.prototype.parse = function(str, queue) {

        var linePattern = /^(?: {0,3}\t| {4})(.*)\n?/mg,
            typePattern = /\s*\[(.*?)\](?:\s*\[(.*?)\])?[ \t]*/,
            codes = [],
            line = null,
            type = {
                language: null,
                lineNum: 0
            },
            node = null,
            lastIndex = 0;

        if (!(/^(?: {0,3}\t| {4})(.*)/.test(str))) {
            return null;
        }

        for (line = linePattern.exec(str); !!line; line = linePattern.exec(str)) {
            codes.push(line[1]);
            lastIndex = linePattern.lastIndex;
        }

        if (lastIndex < str.length) {
            // 截取剩余部分
            queue.push(str.substr(lastIndex));
        }

        line = typePattern.exec(codes[0]);
        if (line) {

            codes.shift();

            if (line[1]) {
                type.language = line[1];
            }

            if (line[2]) {
                type.lineNum = line[2];
            }

        }

        node = new Node("pre").appendChild(
            new Node("code").appendChild(
                new TextNode(codes.join("\n"))
            )
        );

        return node;

    };

    return Code;

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

    // FIXME 最后一个\n符号可能被写入到内容中
    Paragraph.prototype.parse = function(str) {

        var node = new Node("p");

        node.appendChild(this.inline.parse(str));

        return node;
    };

    return Paragraph;

});

Md.extend("syntax/image", function(require) {

    var Node = require("node");

    function Image(dialect) {

        var inline = dialect.getSyntax("inline");
        inline.extend(this);

    }

    Image.prototype.parse = function(source, queue) {

        var pattern = /!\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,
            reg = source.match(pattern),
            node = null;

        if (!reg) {
            return null;
        } else if (reg.index) {
            queue.push(source.substring(0, reg.index));
            queue.push(reg[0]);
            queue.push(source.substr(reg.index + reg[0].length));

            return null;
        } else if (reg[0].length < source.length) {
            queue.push(source.substr(reg[0].length));
        }

        node = new Node("img");

        node.attr("alt", reg[1])
            .attr("src", reg[2]);

        if (reg[4]) {
            node.attr("title", "reg[4]");
        }

        return node;

    };

    return Image;
});

Md.extend("syntax/hyperlink", function(require) {

    var Node = require("node"),
        TextNode = require("text-node");

    function Hyperlink(dialect) {
        var inline = dialect.getSyntax("inline");
        inline.extend(this);

    }

    Hyperlink.prototype.parse = function(source, queue) {

        var pattern = /\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,
            reg = source.match(pattern),
            node = null;

        if (!reg) {
            return null;
        } else if (reg.index) {
            queue.push(source.substring(0, reg.index));
            queue.push(reg[0]);
            queue.push(source.substr(reg.index + reg[0].length));

            return null;
        } else if (reg[0].length < source.length) {
            queue.push(source.substr(reg[0].length));
        }

        console.log(reg);


        node = new Node("a");
        node.appendChild(new TextNode(reg[1]));
        node.attr("href", reg[2])
            .attr("title", reg[4]);

        return node;
    };

    return Hyperlink;
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

            

                "blockquote" ,

            

                "atx-header" ,

            

                "setext-header" ,

            

                "table" ,

            

                "list" ,

            

                "code" ,

            

                "horiz-line" ,

            

                "paragraph" ,

            

                "image" ,

            

                "hyperlink" ,

            

                "escaped" ,

            

                "inline-plain-text" 

            
        ])
        .build();

});
