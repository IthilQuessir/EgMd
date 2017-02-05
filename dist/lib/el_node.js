"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _attr = require("./attr");

var _attr2 = _interopRequireDefault(_attr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ElNode = function () {
    function ElNode(tag_name, flag) {
        (0, _classCallCheck3.default)(this, ElNode);

        this.tagName = tag_name || "";
        this.flag = flag || this.tagName;
        this.__attr__ = new _attr2.default();
        this.children = [];

        this.__data__ = {
            // 字数
            wordCount: "0",
            // 标签统计
            tags: {
                "h1": []
            }

        };
    }

    (0, _createClass3.default)(ElNode, [{
        key: "attr",
        value: function attr(name, val) {
            if (typeof val === "undefined") {
                return this.__attr__.get(name);
            } else {
                this.__attr__.add(name, val);
            }

            return this;
        }
    }, {
        key: "rmAttr",
        value: function rmAttr(name) {
            this.__attr__.rm(name);
            return this;
        }
    }, {
        key: "appendChild",
        value: function appendChild(child) {
            this.children.push(child);
            return this;
        }
    }, {
        key: "replaceChild",
        value: function replaceChild(index, child) {
            var old = this.children[index];
            this.children.splice(index, 1, child);
            return old;
        }
    }, {
        key: "forEach",
        value: function forEach(cb) {
            var children = this.children,
                i = 0,
                len = children.length;

            for (; i < len; i++) {
                cb(i, children[i]);
            }
        }
    }, {
        key: "getChild",
        value: function getChild(i) {
            return this.children[i];
        }
    }, {
        key: "toElement",
        value: function toElement() {

            var el = null,
                name = this.tagName;

            if (name === "") {
                el = document.createDocumentFragment();
            } else {
                el = document.createElement(name);

                this.__attr__.forEach(function (key, value) {
                    el.setAttribute(key, value);
                });
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.children), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var child = _step.value;

                    el.appendChild(child.toElement());
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

            return el;
        }
    }, {
        key: "toHTML",
        value: function toHTML() {
            var str = "",
                name = this.tagName,
                attr = "";

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(this.children), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var child = _step2.value;

                    str += child.toHTML();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.__attr__.forEach(function (key, value) {
                attr += " " + key + "=" + "\"" + value + "\"";
            });

            if (name !== "") {
                str = "<" + name + attr + ">" + str + "</" + name + ">";
            }

            return str;
        }

        /**
         * 解析为标准 Md语法
         *
         * 解析器可能将一些错误语法进行纠正。
         * 此API可以输出纠正后的Md文本
         *
         * XXX 对不合理语法进行查找替换，比解析后再输出效率更高。但扩展定制性如何保证？
         *     起因于每个人的习惯不一样，需要一个对错误宽容对解析器来解析。一刀切对替换存在弊端。
         *     替换可以通过配置，但是这就不允许他人扩展，增加对其他错误宽容对解析语法，必须全部由我来编写。
         *     替换方案增加文件体积，但是却并不可能所有人都需要。
         *     语法复原规则和解析器紧密相关，如何编写是问题
         *
         */

    }, {
        key: "toStanderMd",
        value: function toStanderMd() {}
    }, {
        key: "getTarget",
        value: function getTarget(tagName) {}
    }]);
    return ElNode;
}(); /*jshint esversion: 6 */


module.exports = ElNode;