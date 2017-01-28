"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */

var Attr = function () {
    function Attr() {
        (0, _classCallCheck3.default)(this, Attr);

        this.list = {};
    }

    (0, _createClass3.default)(Attr, [{
        key: "add",
        value: function add(name, val) {
            this.list[name] = val;
        }
    }, {
        key: "rm",
        value: function rm(name) {
            delete this.list[name];
            return this;
        }
    }, {
        key: "get",
        value: function get(name) {
            return this.list[name] || null;
        }
    }, {
        key: "forEach",
        value: function forEach(cb) {
            var list = this.list;

            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    cb.call(this, key, list[key]);
                }
            }
        }
    }, {
        key: "clone",
        value: function clone() {
            // TODO 深复制代码
        }
    }]);
    return Attr;
}();

module.exports = Attr;