"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _el_node = require("./el_node");

var _el_node2 = _interopRequireDefault(_el_node);

var _txt_node = require("./txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
var Dialect = function () {
    function Dialect(name, syntaxs) {
        (0, _classCallCheck3.default)(this, Dialect);

        if (syntaxs.length === 0) {
            throw new Error("[Dialect mast init with a syntaxs arr]");
        }

        this.name = name;
        this.syntaxs = syntaxs;
    }

    (0, _createClass3.default)(Dialect, [{
        key: "parse",
        value: function parse(str, op) {

            var node = new _txt_node2.default(str, "blocks"),
                nodes = new _el_node2.default();

            nodes.appendChild(node);

            this.parseNodes(nodes);

            return nodes;
        }
    }, {
        key: "parseNodes",
        value: function parseNodes(nodes) {

            if (nodes instanceof _txt_node2.default) {
                return;
            }

            var newNode = null;

            nodes.forEach(function (i, child) {

                newNode = this.parseNode(child);

                if (newNode) {
                    nodes.replaceChild(i, newNode);
                }

                this.parseNodes(nodes.getChild(i));
            }.bind(this));

            return nodes;
        }
    }, {
        key: "parseNode",
        value: function parseNode(node) {

            var newNode = node,
                rs = null;

            do {

                if (!newNode.flag) {
                    break;
                }

                newNode = this.syntaxParse(newNode);

                if (newNode) {
                    rs = newNode;
                }
            } while (newNode);

            return rs;
        }
    }, {
        key: "syntaxParse",
        value: function syntaxParse(node) {

            var pNode = null;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.syntaxs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var syntax = _step.value;


                    pNode = syntax.parse(node);

                    if (pNode) {
                        return pNode;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return null;
        }
    }]);
    return Dialect;
}();

module.exports = Dialect;