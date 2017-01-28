"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */

var TxtNode = function () {
    function TxtNode(str, flag) {
        (0, _classCallCheck3.default)(this, TxtNode);


        if (typeof str !== "string") {
            console.error("[Md] TextNode only accpet string");
        }

        this.flag = flag || "";
        this.text = str;
    }

    (0, _createClass3.default)(TxtNode, [{
        key: "toElement",
        value: function toElement() {
            return document.createTextNode(this.text);
        }
    }, {
        key: "toHTML",
        value: function toHTML() {
            return this.text;
        }
    }]);
    return TxtNode;
}();

module.exports = TxtNode;