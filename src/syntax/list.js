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
