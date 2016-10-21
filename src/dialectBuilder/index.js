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
