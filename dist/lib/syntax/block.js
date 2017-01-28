"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _txt_node = require("../txt_node");

var _txt_node2 = _interopRequireDefault(_txt_node);

var _el_node = require("../el_node");

var _el_node2 = _interopRequireDefault(_el_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint esversion: 6 */
exports.parse = function (s_node) {

    if (s_node.flag !== "blocks") {
        return null;
    }

    var pattern = /(?:^\s*\n)/m,
        blocks = s_node.text.split(/(?:^\s*\n)/m),
        container = new _el_node2.default(),
        tNode = null;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(blocks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var block = _step.value;

            tNode = new _txt_node2.default(block, "block");
            container.appendChild(tNode);
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

    return container;
};