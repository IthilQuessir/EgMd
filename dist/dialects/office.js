"use strict";

var _dialect = require("../lib/dialect");

var _dialect2 = _interopRequireDefault(_dialect);

var _block = require("../lib/syntax/block");

var _block2 = _interopRequireDefault(_block);

var _atx_header = require("../lib/syntax/atx_header");

var _atx_header2 = _interopRequireDefault(_atx_header);

var _setext_header = require("../lib/syntax/setext_header");

var _setext_header2 = _interopRequireDefault(_setext_header);

var _paragraph = require("../lib/syntax/paragraph");

var _paragraph2 = _interopRequireDefault(_paragraph);

var _blockquote = require("../lib/syntax/blockquote");

var _blockquote2 = _interopRequireDefault(_blockquote);

var _table = require("../lib/syntax/table");

var _table2 = _interopRequireDefault(_table);

var _list = require("../lib/syntax/list");

var _list2 = _interopRequireDefault(_list);

var _code = require("../lib/syntax/code");

var _code2 = _interopRequireDefault(_code);

var _horiz_line = require("../lib/syntax/horiz_line");

var _horiz_line2 = _interopRequireDefault(_horiz_line);

var _image = require("../lib/syntax/image");

var _image2 = _interopRequireDefault(_image);

var _autolink = require("../lib/syntax/autolink");

var _autolink2 = _interopRequireDefault(_autolink);

var _hyperlink = require("../lib/syntax/hyperlink");

var _hyperlink2 = _interopRequireDefault(_hyperlink);

var _escaped = require("../lib/syntax/escaped");

var _escaped2 = _interopRequireDefault(_escaped);

var _index = require("../lib/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.addDialect(new _dialect2.default("office", [_block2.default, _blockquote2.default, _atx_header2.default, _setext_header2.default, _table2.default, _list2.default, _code2.default, _horiz_line2.default, _paragraph2.default, _escaped2.default, _image2.default, _hyperlink2.default, _autolink2.default]), true); /*jshint esversion: 6 */


module.exports = _index2.default;