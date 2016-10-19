Md.extend("dialect-builder", function (require) {

    function Dialect() {
        this.syntaxLib = {};
    }

    Dialect.prototype.parse = function (str) {

        if ("block" in this.syntaxLib) {
            this.syntaxLib.block(str);
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

    function dialectBuilder() {
        this.list = [];
    }

    dialectBuilder.prototype.addSyntax = function (arr) {
        this.list.push.apply(this.list, arr);
    };

    dialectBuilder.prototype.build = function () {

        var i = 0,
            len = this.list.length,
            syntax = null,
            dialect = new Dialect();

        for (; i < len; i ++) {

            syntax = require(this.list[i]);

            dialect.extend(this.list[i], syntax);

        }

    };

});
