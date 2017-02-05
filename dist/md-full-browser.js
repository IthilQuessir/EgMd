/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Md"] = __webpack_require__(23);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

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

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(5);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(6), __esModule: true };

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(7);
	var $Object = __webpack_require__(10).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(8);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(18), 'Object', {defineProperty: __webpack_require__(14).f});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(9)
	  , core      = __webpack_require__(10)
	  , ctx       = __webpack_require__(11)
	  , hide      = __webpack_require__(13)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 9 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 10 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(12);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(14)
	  , createDesc = __webpack_require__(22);
	module.exports = __webpack_require__(18) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(15)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , toPrimitive    = __webpack_require__(21)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(18) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(18) && !__webpack_require__(19)(function(){
	  return Object.defineProperty(__webpack_require__(20)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(19)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16)
	  , document = __webpack_require__(9).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _dialect = __webpack_require__(24);

	var _dialect2 = _interopRequireDefault(_dialect);

	var _block = __webpack_require__(67);

	var _block2 = _interopRequireDefault(_block);

	var _atx_header = __webpack_require__(68);

	var _atx_header2 = _interopRequireDefault(_atx_header);

	var _setext_header = __webpack_require__(69);

	var _setext_header2 = _interopRequireDefault(_setext_header);

	var _paragraph = __webpack_require__(70);

	var _paragraph2 = _interopRequireDefault(_paragraph);

	var _blockquote = __webpack_require__(71);

	var _blockquote2 = _interopRequireDefault(_blockquote);

	var _table = __webpack_require__(72);

	var _table2 = _interopRequireDefault(_table);

	var _list = __webpack_require__(73);

	var _list2 = _interopRequireDefault(_list);

	var _code = __webpack_require__(74);

	var _code2 = _interopRequireDefault(_code);

	var _horiz_line = __webpack_require__(75);

	var _horiz_line2 = _interopRequireDefault(_horiz_line);

	var _image = __webpack_require__(76);

	var _image2 = _interopRequireDefault(_image);

	var _autolink = __webpack_require__(77);

	var _autolink2 = _interopRequireDefault(_autolink);

	var _hyperlink = __webpack_require__(78);

	var _hyperlink2 = _interopRequireDefault(_hyperlink);

	var _escaped = __webpack_require__(79);

	var _escaped2 = _interopRequireDefault(_escaped);

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	_index2.default.addDialect(new _dialect2.default("office", [_block2.default, _blockquote2.default, _atx_header2.default, _setext_header2.default, _table2.default, _list2.default, _code2.default, _horiz_line2.default, _paragraph2.default, _escaped2.default, _image2.default, _hyperlink2.default, _autolink2.default]), true); /*jshint esversion: 6 */

	module.exports = _index2.default;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(25);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

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
	                    this.parseNodes(newNode);
	                    nodes.replaceChild(i, newNode);
	                } else {
	                    this.parseNodes(child);
	                }
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

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(26), __esModule: true };

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(27);
	__webpack_require__(58);
	module.exports = __webpack_require__(60);

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(28);
	var global        = __webpack_require__(9)
	  , hide          = __webpack_require__(13)
	  , Iterators     = __webpack_require__(31)
	  , TO_STRING_TAG = __webpack_require__(55)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(29)
	  , step             = __webpack_require__(30)
	  , Iterators        = __webpack_require__(31)
	  , toIObject        = __webpack_require__(32);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(36)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(33)
	  , defined = __webpack_require__(35);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(34);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(37)
	  , $export        = __webpack_require__(8)
	  , redefine       = __webpack_require__(38)
	  , hide           = __webpack_require__(13)
	  , has            = __webpack_require__(39)
	  , Iterators      = __webpack_require__(31)
	  , $iterCreate    = __webpack_require__(40)
	  , setToStringTag = __webpack_require__(54)
	  , getPrototypeOf = __webpack_require__(56)
	  , ITERATOR       = __webpack_require__(55)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);

/***/ },
/* 39 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(41)
	  , descriptor     = __webpack_require__(22)
	  , setToStringTag = __webpack_require__(54)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(13)(IteratorPrototype, __webpack_require__(55)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(15)
	  , dPs         = __webpack_require__(42)
	  , enumBugKeys = __webpack_require__(52)
	  , IE_PROTO    = __webpack_require__(49)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(20)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(53).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(14)
	  , anObject = __webpack_require__(15)
	  , getKeys  = __webpack_require__(43);

	module.exports = __webpack_require__(18) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(44)
	  , enumBugKeys = __webpack_require__(52);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(39)
	  , toIObject    = __webpack_require__(32)
	  , arrayIndexOf = __webpack_require__(45)(false)
	  , IE_PROTO     = __webpack_require__(49)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(32)
	  , toLength  = __webpack_require__(46)
	  , toIndex   = __webpack_require__(48);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(47)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(47)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(50)('keys')
	  , uid    = __webpack_require__(51);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(9)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9).document && document.documentElement;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(14).f
	  , has = __webpack_require__(39)
	  , TAG = __webpack_require__(55)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(50)('wks')
	  , uid        = __webpack_require__(51)
	  , Symbol     = __webpack_require__(9).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(39)
	  , toObject    = __webpack_require__(57)
	  , IE_PROTO    = __webpack_require__(49)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(35);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(59)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(36)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(47)
	  , defined   = __webpack_require__(35);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(15)
	  , get      = __webpack_require__(61);
	module.exports = __webpack_require__(10).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(62)
	  , ITERATOR  = __webpack_require__(55)('iterator')
	  , Iterators = __webpack_require__(31);
	module.exports = __webpack_require__(10).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(34)
	  , TAG = __webpack_require__(55)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(25);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _attr = __webpack_require__(64);

	var _attr2 = _interopRequireDefault(_attr);

	var _template_string = __webpack_require__(65);

	var _template_string2 = _interopRequireDefault(_template_string);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	var increasingNum = 1;

	function getId() {
	    return increasingNum++;
	}

	function attrToString() {

	    var str = "";

	    for (var variable in this) {
	        if (this.hasOwnProperty(variable) && variable !== "toString") {
	            str += " " + variable + "=" + "\"" + this[variable] + "\"";
	        }
	    }

	    return str;
	}

	var templateLib = {
	    h2: "<{tagName}><a name='{id}' {attr}>{children}</a></{tagName}>",
	    default: "<{tagName} {attr}>{children}</{tagName}>"
	};

	var ElNode = function () {
	    function ElNode(tag_name, flag) {
	        (0, _classCallCheck3.default)(this, ElNode);


	        // ElNode唯一标识
	        this.__id__ = getId();

	        this.tagName = tag_name || "";
	        this.flag = flag || this.tagName;
	        this.__attr__ = {
	            toString: attrToString
	        };
	        this.__children__ = [];

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
	                return this.__attr__[name] || null;
	            } else {
	                this.__attr__[name] = val;
	            }

	            return this;
	        }
	    }, {
	        key: "rmAttr",
	        value: function rmAttr(name) {
	            delete this.__attr__[name];
	            return this;
	        }
	    }, {
	        key: "appendChild",
	        value: function appendChild(child) {
	            this.__children__.push(child);
	            return this;
	        }
	    }, {
	        key: "replaceChild",
	        value: function replaceChild(index, child) {
	            var old = this.__children__[index];
	            this.__children__.splice(index, 1, child);
	            return old;
	        }
	    }, {
	        key: "forEach",
	        value: function forEach(cb) {
	            var children = this.__children__,
	                i = 0,
	                len = children.length;

	            for (; i < len; i++) {
	                cb(i, children[i]);
	            }
	        }
	    }, {
	        key: "getChild",
	        value: function getChild(i) {
	            return this.__children__[i];
	        }
	    }, {
	        key: "toElement",
	        value: function toElement() {

	            var el = document.createElement("div"),
	                df = document.createDocumentFragment(),
	                children,
	                i,
	                len;

	            el.innerHTML = this.toHTML();
	            children = el.childNodes;

	            console.log(children);

	            while (children.length) {
	                df.appendChild(children[0]);
	            }

	            return df;
	        }
	    }, {
	        key: "toHTML",
	        value: function toHTML(template) {

	            var childrenString = "",
	                currentTemplate;

	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = (0, _getIterator3.default)(this.__children__), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var child = _step.value;

	                    childrenString += child.toHTML();
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

	            if (this.tagName) {

	                currentTemplate = template || templateLib[this.tagName] || templateLib.default;

	                return _template_string2.default.render(currentTemplate, {

	                    id: this.__id__,
	                    tagName: this.tagName,

	                    attr: this.__attr__,
	                    children: childrenString

	                });
	            } else {
	                return childrenString;
	            }
	        }

	        /**
	         * 解析为标准 Md语法
	         *
	         * 解析器可能将一些错误语法进行纠正。
	         * 此API可以输出纠正后的Md文本
	         *
	         * TODO 对不合理语法进行查找替换，比解析后再输出效率更高。但扩展定制性如何保证？
	         *     起因于每个人的习惯不一样，需要一个对错误宽容对解析器来解析。一刀切对替换存在弊端。
	         *     替换可以通过配置，但是这就不允许他人扩展，增加对其他错误宽容对解析语法，必须全部由我来编写。
	         *     替换方案增加文件体积，但是却并不可能所有人都需要。
	         *     语法复原规则和解析器紧密相关，如何编写是问题
	         *
	         */

	    }, {
	        key: "toStanderMd",
	        value: function toStanderMd() {}

	        /**
	         * TODO 如果在解析过程中统计数据
	         *      会造成多余的增删操作，而且每一个节点增删的操作都会从叶节点冒泡到根节点
	         *      以便全部清除
	         *
	         *      其功能完整实现意义依赖渲染模板
	         *      因此首先完成渲染模板
	         */

	    }, {
	        key: "getTarget",
	        value: function getTarget(tagName) {}
	    }]);
	    return ElNode;
	}();

	module.exports = ElNode;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

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
	        key: "getAll",
	        value: function getAll() {
	            return this.list;
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
	    }, {
	        key: "toString",
	        value: function toString() {}
	    }]);
	    return Attr;
	}();

	module.exports = Attr;

/***/ },
/* 65 */
/***/ function(module, exports) {

	/*jshint esversion: 6 */

	/**
	 * 查找context中token所代表的属性
	 *
	 * @param {String} token
	 * @param {Object} context
	 *
	 * @return  若 token = "product.id"
	 *          则返回 context.product.id || null（查找失败）;
	 */
	function SearchVariable(token, context) {

	    var variables = token.split('.'),
	        currentObject = context,
	        i, len, variable;


	    for (i = 0, len = variables.length; i < len; ++i) {

	        variable = variables[i];
	        currentObject = currentObject[variable];
	        // 查找失败
	        if (currentObject === undefined || currentObject === null) {
	            return null;
	        }

	    }


	    if( typeof currentObject === "object" ) {
	        return currentObject.toString() || null;
	    }

	    return currentObject;

	}

	/**
	 * 简易模板字符串
	 *
	 * 1. 仅包含变量替换功能，变量由 {}包含，两侧允许有空格
	 * 2. 可以使用反斜杠转译{}
	 * 3. 支持级联变量，如：{ product.id }
	 *
	 * @param {String} template 如: "Hello {text}"
	 * @param {Object} context  如: {text: "World"}
	 *
	 * @return {String} 解析结果，如: "Hello World"
	 *
	 */
	function render(template, context) {

	    var tokenReg = /(\\)?\{\s*([^\{\}\s\\]+)\s*(\\)?\}/g;

	    return template.replace(tokenReg, function(word, slash1, token, slash2) {

	        // 若大括号被转译，则不进行解析
	        if (slash1 || slash2) {
	            return word.replace('\\', '');
	        }

	        // 查找对应替换内容
	        return SearchVariable(token, context) || "";

	    });

	}

	exports.render = render;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

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

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(25);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	var _el_node = __webpack_require__(63);

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

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    var pattern = /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/;

	    if (s_node.flag !== "block" || !pattern.test(s_node.text)) {
	        return null;
	    }

	    var str = s_node.text,
	        reg = str.match(pattern),
	        header = new _el_node2.default("h" + reg[1].length, "atx-header"),
	        container = new _el_node2.default();

	    header.appendChild(new _txt_node2.default(reg[2], "inline"));

	    container.appendChild(header);

	    // 将结尾放回
	    if (reg[0].length < str.length) {
	        var node = new _txt_node2.default(str.substr(reg[0].length), "block");
	        container.appendChild(node);
	    }

	    return container;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    var pattern = /^(.*)\n([-=])\2\2+(?:\n|$)/,
	        str = s_node.text,
	        reg = null,
	        level = "",
	        node = null,
	        container = new _el_node2.default("", "atx-header");

	    if (s_node.flag !== "block" || !pattern.test(str)) {
	        return null;
	    }

	    reg = str.match(pattern);

	    level = reg[2] === "=" ? "h1" : "h2";
	    node = new _el_node2.default(level);

	    node.appendChild(new _txt_node2.default(reg[1], "inline"));
	    container.appendChild(node);

	    // 字符串尾部还有其余内容
	    if (reg[0].length < str.length) {

	        node = new _txt_node2.default(str.substr(reg[0].length), "block");
	        container.appendChild(node);
	    }

	    return container;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// FIXME 最后一个\n符号可能被写入到内容中
	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    if (s_node.flag !== "block") {
	        return null;
	    }

	    var node = new _el_node2.default("p");
	    node.appendChild(new _txt_node2.default(s_node.text, "inline"));

	    return node;
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    if (s_node.flag !== "block") {
	        return null;
	    }

	    var source = s_node.text,
	        reg = source.match(/^(?:>\s*.*[\n$])+/m),
	        node = null,
	        container = new _el_node2.default(""),
	        str = null;

	    if (!reg) {
	        return null;
	    }

	    if (!!reg.index) {
	        node = new _txt_node2.default(source.substring(0, reg.index), "block");
	        container.appendChild(node);
	    }

	    str = reg[0].replace(/^>[ \f\r\t\v]*/mg, "");

	    node = new _el_node2.default("blockquote").appendChild(new _txt_node2.default(str, "blocks"));

	    container.appendChild(node);

	    if (reg.index + reg[0].length < source.length) {
	        node = new _txt_node2.default(source.substr(reg.index + reg[0].length), "block");
	        container.appendChild(node);
	    }

	    return container;
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	function buildTable(title, align, ctn) {

	    var table = new _el_node2.default("table");

	    table.appendChild(buildTHead(title, align)).appendChild(buildTBody(ctn, align));

	    return table;
	}

	function buildTHead(title, align) {

	    var tr = new _el_node2.default("tr"),
	        txt = null;

	    title.forEach(function (t, i) {

	        txt = new _txt_node2.default(t, "inline");
	        txt = new _el_node2.default("th").appendChild(txt);

	        if (align[i]) {
	            txt.attr("align", align[i]);
	        }

	        tr.appendChild(txt);
	    });

	    return new _el_node2.default("thead").appendChild(tr);
	}

	function buildTBody(ctn, align) {

	    var tr = null,
	        txt = null,
	        tbody = new _el_node2.default("tbody");

	    ctn.forEach(function (row) {

	        tr = new _el_node2.default("tr");

	        row.forEach(function (cell, i) {
	            txt = new _el_node2.default("td").appendChild(new _txt_node2.default(cell, "inline"));

	            if (align[i]) {
	                txt.attr("align", align[i]);
	            }

	            tr.appendChild(txt);
	        });

	        tbody.appendChild(tr);
	    });

	    return tbody;
	}

	exports.parse = function (s_node) {

	    if (s_node.flag !== "block") return null;

	    var source = s_node.text,
	        pattern = /^ {0,3}((?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))\n {0,3}((?:(?:\|\s*(?::\s*)?-[-\s]*(?::\s*)?)+\|?)|(?:(?:\|\s*)?(?::\s*)?-[-\s]*(?::\s*)?(?:(?:\|(?::\s*)?-[-\s]*(?::\s*)?)+\|?|\|)))\n((?: {0,3}(?:(?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))(?:\n|$))+)/,
	        reg = source.match(pattern),
	        title,
	        align,
	        ctn;

	    if (!reg) {
	        return null;
	    }

	    function cleanBothEnds(str) {
	        return str.replace(/^\s*\|/, "").replace(/\s*$/, "").replace(/\|$/, "");
	    }

	    title = cleanBothEnds(reg[1]).split("|");

	    align = cleanBothEnds(reg[2]).split("|").map(function (a) {

	        var reg = a.match(/\s*(:)?[-\s]+(:)?/);

	        if (!!reg[1] && !!reg[2]) {
	            // center
	            return "center";
	        } else if (!!reg[1]) {
	            // left
	            return "left";
	        } else if (!!reg[2]) {
	            // right
	            return "right";
	        } else {
	            return null;
	        }
	    });

	    ctn = cleanBothEnds(reg[3]).split("\n").map(function (n) {
	        return cleanBothEnds(n).split("|");
	    });

	    return buildTable(title, align, ctn);
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * space's depth > depth return 1
	 * space's depth < depth return -1
	 * space's depth = depth return 0
	 */
	/*jshint esversion: 6 */

	/**
	 *  TODO  尚未对如下情况进行测试
	 *
	 *        以下是一个列表
	 *        * 第一条
	 *            * 子列表第一条
	 *            * 子列表第二条
	 *
	 *        此时当list语法优先级高时，需要对列表结构进行提取
	 */

	function calcDepth(space, depth) {

	    return space.replace(/(?: {0,3}\\t| {4})/, "\t").length;
	}

	/**
	 * 循环解析同层li，递归解决不同层的list
	 * 通过判断起始的空白符来确定这一行内容属于那一个层次
	 * 同层的作为li解析，下一层的递归生成新的子列表
	 *
	 * @param {Array} line 待解析的行
	 * @param {Int} depth 层次，起始0
	 */
	function mkList(lines, i, depth, cb) {

	    var len = lines.length,
	        list = new _el_node2.default("ul");

	    // reg[1] = 空白符  reg[2] 前缀  reg[3] 内容
	    var pattern = /^(\s*)([*+-]|\\d+\\.)[ \t]+(.*)/,
	        reg = null,
	        node = null,
	        lineDepth;

	    function nextDepthCb(list, index) {
	        node = new _el_node2.default("li").appendChild(list);
	        i = index;
	    }

	    for (; i < len; i++) {

	        reg = lines[i].match(pattern);
	        lineDepth = calcDepth(reg[1]);

	        if (lineDepth > depth) {
	            // 下一层列表的 li
	            mkList(lines, i, depth + 1, nextDepthCb);
	        } else if (lineDepth < depth) {
	            // 上一层列表的li
	            break;
	        } else {
	            // 当前列表的下一个li
	            node = new _txt_node2.default(reg[3], "inline");
	            node = new _el_node2.default("li").appendChild(node);
	        }

	        list.appendChild(node);
	    }

	    cb(list, i);
	}

	exports.parse = function (s_node) {

	    if (s_node.flag !== "block") return null;

	    var source = s_node.text,
	        reg = source.match(/^(?: *(?:[*+-]|\\d+\\.)[ \t]+.*(\n|$))+/),
	        lines = null,
	        node = null,
	        container = null;

	    if (!reg) {
	        return null;
	    }

	    container = new _el_node2.default();

	    lines = reg[0].split("\n");
	    if (lines[lines.length - 1] === "") {
	        lines.pop();
	    }

	    mkList(lines, 0, 0, function (list) {
	        container.appendChild(list);
	    });

	    if (reg[0].length < source.length) {
	        node = new _txt_node2.default(source.substr(reg[0].length), "block");
	        container.appendChild(node);
	    }

	    return container;
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * XXX 尚未测试如下事例
	 *         1.xxxxxxxxx
	 *               codeing
	 *               codeing
	 *
	 *         2.    codeing
	 *           xxxxxxxxx
	 *               codeing
	 *               codeing
	 */
	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    if (s_node.flag !== 'block') {
	        return null;
	    }

	    var str = s_node.text,
	        linePattern = /^(?: {0,3}\t| {4})(.*)\n?/mg,
	        typePattern = /\s*\[(.*?)\](?:\s*\[(.*?)\])?[ \t]*/,
	        codes = [],
	        line = null,
	        type = {
	        language: null,
	        lineNum: 0
	    },
	        node = null,
	        lastIndex = 0;

	    if (!/^(?: {0,3}\t| {4})(.*)/.test(str)) {
	        return null;
	    }

	    for (line = linePattern.exec(str); !!line; line = linePattern.exec(str)) {
	        codes.push(line[1]);
	        lastIndex = linePattern.lastIndex;
	    }

	    line = typePattern.exec(codes[0]);
	    if (line) {

	        codes.shift();

	        if (line[1]) {
	            type.language = line[1];
	        }

	        if (line[2]) {
	            type.lineNum = line[2];
	        }
	    }

	    node = new _el_node2.default("pre").appendChild(new _el_node2.default("code").appendChild(new _txt_node2.default(codes.join("\n"))));
	    var container = new _el_node2.default().appendChild(node);

	    if (lastIndex < str.length) {
	        // 截取剩余部分
	        container.appendChild(new _txt_node2.default(str.substr(lastIndex), "block"));
	    }

	    return container;
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	var className = {
	    dash: "dash",
	    underline: "underline",
	    asterisk: "asterisk"
	};

	exports.parse = function (s_node) {

	    if (s_node.flag !== "block") return null;

	    var str = s_node.text,
	        pattern = /^(?:([\s\S]*?)\n)?[ \t]*(([-_*])(?:[ \t]*\3){2,})[ \t]*(?:\n([\s\S]*))?$/,
	        reg = str.match(pattern),
	        node = null,
	        container = null;

	    if (!reg) {
	        return null;
	    }

	    container = new _el_node2.default();

	    if (reg[1]) {
	        node = new _txt_node2.default(reg[1], "block");
	        container.appendChild(node);
	    }

	    node = new _el_node2.default("hr");

	    switch (reg[3]) {
	        case '-':
	            node.attr("class", className.dash);
	            break;
	        case '_':
	            node.attr("class", className.underline);
	            break;
	        case '*':
	            node.attr("class", className.asteris);
	            break;
	        // No Default;
	    }

	    container.appendChild(node);

	    // hr之后有剩余内容
	    if (reg[4]) {
	        node = new _txt_node2.default(reg[4], "block");
	        container.appendChild(node);
	    }

	    return container;
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    if (s_node.flag !== "inline") return null;

	    var source = s_node.text,
	        pattern = /!\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,
	        reg = source.match(pattern),
	        node = null,
	        container = null;

	    if (!reg) {
	        return null;
	    }

	    container = new _el_node2.default();

	    if (reg.index) {
	        node = new _txt_node2.default(source.substring(0, reg.index), "inline");
	        container.appendChild(node);
	    }

	    node = new _el_node2.default("img");
	    node.attr("alt", reg[1]).attr("src", reg[2]);

	    if (reg[4]) {
	        node.attr("title", reg[4]);
	    }

	    container.appendChild(node);

	    if (reg.index + reg[0].length < source.length) {
	        node = new _txt_node2.default(source.substr(reg.index + reg[0].length), "inline");
	        container.appendChild(node);
	    }

	    return container;
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    if (s_node.flag !== "inline") {
	        return null;
	    }

	    var str = s_node.text,
	        pattern = /<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/,
	        reg = str.match(pattern),
	        container = new _el_node2.default(),
	        node = null;

	    if (!reg) {
	        return null;
	    }

	    if (reg.index) {

	        node = new _txt_node2.default(str.substring(0, reg.index), "inline");
	        container.appendChild(node);
	    }

	    node = new _el_node2.default("a", "autolink");

	    if (reg[3]) {

	        node.attr("href", "mailto:" + reg[3]);
	        node.appendChild(new _txt_node2.default(reg[3]));
	    } else if (reg[2] === "mailto") {

	        node.attr("href", encodeURI(reg[1]));
	        node.appendChild(new TextNode(reg[1].substr("mailto:".length)));
	    } else {

	        node.attr("href", encodeURI(reg[1]));
	        node.appendChild(new TextNode(reg[1]));
	    }

	    container.appendChild(node);

	    if (reg.index + reg[0].length < str.length) {

	        node = new _txt_node2.default(str.substr(reg.index + reg[0].length), "inline");
	        container.appendChild(node);
	    }

	    return container;
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    if (s_node.flag !== "inline") return null;

	    var source = s_node.text,
	        pattern = /\[\s*([^\]\[]*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,
	        reg = source.match(pattern),
	        node = null,
	        container = null;

	    if (!reg) {
	        return null;
	    }

	    container = new _el_node2.default();

	    if (reg.index) {

	        node = new _txt_node2.default(source.substring(0, reg.index));
	        container.appendChild(node);
	    }

	    node = new _el_node2.default("a");
	    node.appendChild(new _txt_node2.default(reg[1], "inline"));
	    node.attr("href", reg[2]);
	    if (reg[4]) {
	        node.attr("title", reg[4]);
	    }
	    container.appendChild(node);

	    if (reg.index + reg[0].length < source.length) {
	        node = new _txt_node2.default(source.substr(reg.index + reg[0].length), "inline");
	        container.appendChild(node);
	    }

	    return container;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _el_node = __webpack_require__(63);

	var _el_node2 = _interopRequireDefault(_el_node);

	var _txt_node = __webpack_require__(66);

	var _txt_node2 = _interopRequireDefault(_txt_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*jshint esversion: 6 */
	exports.parse = function (s_node) {

	    if (s_node.flag !== "inline") return null;

	    // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
	    var str = s_node.text,
	        pattern = /\\([\\`\*_{}\[\]()#\+.!\-])/,
	        reg = pattern.exec(str),
	        rs = null,
	        container = null;

	    if (!pattern.test(str)) {
	        return null;
	    }

	    container = new _el_node2.default();

	    if (reg.index) {
	        container.appendChild(new _txt_node2.default(str.substring(0, reg.index), "inline"));
	    }

	    container.appendChild(new _txt_node2.default(reg[1], "escaped"));

	    if (reg.index + reg[0].length < str.length) {
	        container.appendChild(new _txt_node2.default(str.substr(reg.index + reg[0].length), "inline"));
	    }

	    return container;
	};

/***/ }
/******/ ]);