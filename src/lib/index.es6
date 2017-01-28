/*jshint esversion: 6 */
var dialectStorage = {
    length: 0
};

function preprocess(str) {
    return str
        .replace(/^\s*\n/, "")
        .replace(/\s*$/, "");
}

var sigleMd = null;

class Md {
    constructor() {
        if (sigleMd) {
            return sigleMd;
        } else {
            sigleMd = this;
            return this;
        }
    }


    static addDialect(dialect, is_default) {

        var name = dialect.name;

        if (dialectStorage[name]) {
            console.warn("Please ensure dialect named " + name + " was included once");
        } else if (name === "length" || name === "default") {
            throw new Error("[Md] dialect should not named \"length\" or \"deafult\"");
        }

        if (dialectStorage.length === 0 || is_default) {
            dialectStorage.default = dialect;
        }

        dialectStorage[name] = dialect;

        return this;
    }

    static setDefOp(op) {
        return this;
    }

    parse(str, op) {

        var dialect = null;

        if (op && op.dialect && dialectStorage[op.dialect]) {
            dialect = dialectStorage[op.dialect];
        } else if (dialectStorage.default) {
            dialect = dialectStorage.default;
        } else {
            throw new Error("[Md] Cannot Find default dialect." +
                "Please ensure used full_version or include dialect-file.");
        }

        this.str = preprocess(str);
        this.tree = dialect.parse(this.str);

        return this.tree;
    }

    toElement () {
        return this.tree.toElement();
    }

    toHTML () {
        return this.tree.toHTML();
    }

}

module.exports = Md;
