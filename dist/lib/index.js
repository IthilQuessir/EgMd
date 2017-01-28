"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
var dialectStorage = {
    length: 0
};

function preprocess(str) {
    return str.replace(/^\s*\n/, "").replace(/\s*$/, "");
}

var sigleMd = null;

var Md = function () {
    function Md() {
        (0, _classCallCheck3.default)(this, Md);

        if (sigleMd) {
            return sigleMd;
        } else {
            sigleMd = this;
            return this;
        }
    }

    (0, _createClass3.default)(Md, [{
        key: "parse",
        value: function parse(str, op) {

            var dialect = null;

            if (op && op.dialect && dialectStorage[op.dialect]) {
                dialect = dialectStorage[op.dialect];
            } else if (dialectStorage.default) {
                dialect = dialectStorage.default;
            } else {
                throw new Error("[Md] Cannot Find default dialect." + "Please ensure used full_version or include dialect-file.");
            }

            this.str = preprocess(str);
            this.tree = dialect.parse(this.str);

            return this.tree;
        }
    }, {
        key: "toElement",
        value: function toElement() {
            return this.tree.toElement();
        }
    }, {
        key: "toHTML",
        value: function toHTML() {
            return this.tree.toHTML();
        }
    }], [{
        key: "addDialect",
        value: function addDialect(dialect, is_default) {

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
    }, {
        key: "setDefOp",
        value: function setDefOp(op) {
            return this;
        }
    }]);
    return Md;
}();

module.exports = Md;