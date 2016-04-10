
var MarkdownHelpers = {};

/** mk_block( block [, trail [, line ]])
 * @description block块
 */
var mkBlock = MarkdownHelpers.mkBlock = function(block, trail, line) {

	if (typeof block !== 'string'){
		throw new Error("`mk_block` expect string param");
	}

	if (arguments.length === 1) {
		trail = '/n/n';
	}

	// The Block Return 字符串对象 避免传参复制
	var s = new String(block);
	s.trail = trail;
	s.toSource = function() {
		return 'new mk_block(\"' +
			(this.toString()) +
			"\" , \"" +
			(this.trail) +
			"\" , " +
			this.lineNum +
			')';
	};

	s.lineNum = line ? line : undefined;

	return s;
};

/** isArray( obj )
 * @description 是否是Array
 */
var isArray = MarkdownHelpers.isArray = Array.isArray || function(obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
};


/** forEach( arr , cb , thisp )
 * 
 * @description 兼容Array.prototype.forEach( array )
 * 
 * @param arr    遍历的数组
 * @param cb(value, index, array)  回调函数 e array元素值
 * @param thisp  改变cb中this的指向
 */
var forEach = MarkdownHelpers.forEach = (function() {
	if (Array.prototype.forEach) {
		return function(arr, cb, thisp) {
			return arr.forEach(cb, thisp);
		};
	}
	else {
		return function(arr, cb, thisp) {
			for (var i = 0; i < arr.length; i++) {
				cb.call(thisp || arr, arr[i], i, arr);
			}
		};
	}
})();

/** isEmpty( obj )
 * 
 * @description 检测对象的属性是否为空（属性必须为自身的属性，而非原型链的属性）
 * 
 * @param obj Object 被检测对象
 */
var isEmpty = MarkdownHelpers.isEmpty = function(obj) {
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key))
			return false;
	}
	return true;
};

/** get_attr_of_jsonml( jsonml )
 * 
 * @description 获取jsonML的attr属性
 */
var getAttrOfJsonML = MarkdownHelpers.getAttrOfJsonML = function(jsonml) {
	return isArray(jsonml)
		&& jsonml.length > 1
		&& typeof jsonml[1] === "object"
		&& !(isArray(jsonml[1]))
		? jsonml[1]
		: undefined;
};

/** clone_attr( attr )
 * 
 * @description Clone Attr
 */
var clone_attr = MarkdownHelpers.clone_attr = function(attr) {

	var res = {};

	for (var key in attr) {
		if (attr.hasOwnProperty(key))
			res[key] = attr[key];
	}

	return res;
};

/** argToArray( arg )
 * 
 * @description 将arguments转换成array	*方便debug打印参数表
 * 
 * @param arg  Object  arguments
 */
var argToArray = MarkdownHelpers.argToArray = function(arg) {
	return Array.prototype.slice.call(arg);
};

