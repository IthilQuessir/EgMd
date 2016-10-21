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
