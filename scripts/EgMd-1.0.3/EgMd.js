// @codekit-prepend "before.js";
// @codekit-prepend "Config.js";
// @codekit-prepend "EgMdHelper.js"
// @codekit-append "Dialects/Complex.js";
// @codekit-append "after.js";

if (global.Markdown) {
	throw new Error("Markdown已存在");
}

/** Markdown.prototype.buildOptions( options )
 * 
 * @description 运行时配置生成
 */
function buildOptions(options) {

	this.is_debug && this.debug("buildOptions()\t::arguments:\n", arguments);

	options = options || {};

	if (typeof options !== "object" || isArray(options))
		throw new TypeError("Unexpert param(options) at buildOptions(" + options + ")");

	if (!options.isset) {
		options.isset = true;
		options.deleteSource = options.deleteSource || this.deleteSource;
		options.deleteTree = options.deleteTree || this.deleteTree;
		options.deleteHTML = options.deleteHTML || this.deleteHTML;
		options.deleteH1 = options.deleteH1 || this.deleteH1;

		options.root = options.root || typeof options.root === "string" ? options.root : this.root;
		options.rootAttr = options.rootAttr || this.rootAttr || {};
		options.dialect = getDialect(options.dialect || this.dialect);

		this.options = options;
	}
	return options;
}

/** Markdown( [source [, config ])
 * 
 * @description Markdown主程序
 *              调用toHTML触发     toHTML事件
 *              调用toHtmlTree触发 toHtmlTree事件
 * 
 * @param source  String        源文本
 * @param config  Function      配置初始化选项
 * 
 * 
 * @event toHTML      当调用Markdown.toHTML()的时候触发	event
 * @event toHtmlTree  
 */
function Markdown(source) {

	source = source || "";
	var config = null;
	
	if( typeof source === "object" ) {
		config = source;
	}
	else if (typeof source !== 'string' && typeof source !== 'undefined') {
		throw new Error('Markdown Expect Stirng param');
	}

	// 初始化配置
	Config.call(this);

	// 传入的配置属性
	if (config) {

		// 复制配置属性
		for (var key in config) {
			if (config.hasOwnProperty(key)) {
				this[key] = config[key];
			}
		}
	}

	public_attr.call(this);
	this.source = source;

	// 监听事件
	this.listener = {
		all: []
	};
}

Markdown.version = "1.0.2";		// 版本号


/** public_attr()
 * 
 * @description Markdown的公共属性---翻译后可供访问但是翻译前无法访问的属性
 *              Reset的时候这些属性会被清空
 */
function public_attr() {
	this.em_state = [];		// 行内em匹配栈
	this.strong_state = [];	// 行内strong匹配栈

	this.references = {};	// 变量表

	this.tree = null;
	this.Header = [];		// toHTML 列表内容是字符串  |  toHTMLTree 类别内容是JsonML
	// H1 list  this.Header[1]
	// H2 list  this.Header[2]

	this.html = "";			// 翻译结果 toHTML()后被设置
}

Markdown.dialects = {};


/** on( event [, data ], fun)
 * 
 * @description 绑定事件
 * 
 * @param event string   事件名
 * @param data  *        传入的额外参数
 * @param fun   function( event , data  )
 *              event			trigger时的事件参数
 * 				data 			传入参数
 * 
 * TODO 如何多事件绑定
 */
Markdown.prototype.on = function(event) {

	var fun, data, arg;

	if (arguments[2]) {
		fun = arguments[2];
		data = arguments[1];
	} else if (typeof arguments[1] === "function") {
		fun = arguments[1];
	} else {
		throw new TypeError("Markdown.on TypeError");
	}

	if (typeof event !== "string" || (typeof fun !== "function" && typeof fun !== "string"))
		throw new TypeError("Markdown.on TypeError");

	if (event === "all") {
		this.listener.all.push({
			fun: fun,
			data: data
		});
	} else {
		if (!this.listener[event])
			this.listener[event] = [];

		this.listener[event].push({
			fun: fun,
			data: data
		});
	}

	return this;
};

/** trigger( event [, arg ])
 * 
 * @description 触发事件
 * 
 * @param event String 事件名
 * @param arg   array  触发事件的事件参数
 * 
 */
Markdown.prototype.trigger = function(event, arg) {

	var listeners = this.listener[event];

	function carry(events_list) {
	}

	// trigger event
	if (listeners) {
		forEach(listeners, function(val) {
			val.data && arg.push(val.data);

			val.fun.apply(this, arg);
		}, this);
	}

	// trigger all
	forEach(this.listener.all, function(val) {

		if (val.data)
			val.fun.call(this, val.data);
		else
			val.fun.call(this);

	}, this);
};

/** off([ event [, fun ]])
 * 
 * @description 接触事件绑定
 * 
 * @param event string   事件名
 * @param fun   Function 函数对象
 * 
 */
Markdown.prototype.off = function(event, fun) {

	var listeners;

	if (typeof fun === "function" && typeof event === "string") {
		// Remove Function

		listeners = this.listener[event];

		if (listeners) {

			for (var key in listeners) {
				if (listeners[key].fun === fun) {
					listeners.splice(key, 1);
					break;
				}
			}
		}

	} else if (typeof event === "string") {
		// Remove Event 
		if (this.listener[event]) {
			this.listener[event] = [];
		}
	} else {
		throw new TypeError("Markdown.unbind Unexpect param");
	}
};

/** debug( [ arguments ] )
 * 
 * @descript 输出提示（用于测试）
 * 
 * @param 将参数逐个打印出来
 */
Markdown.prototype.debug = function() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(this.debug_indent);

	if (typeof console !== "undefined" && typeof console.log !== "undefined")
		console.log.apply(console, args);
};

/** getDialect( dialect )
 * 
 * @description 获取dialect对象
 * 
 * @param dialect  String/Object/undefine
 */
var getDialect = Markdown.getDialect = function(dialect) {
	switch (typeof dialect) {
		case "object":
			return dialect;
		default:
			if (dialect in Markdown.dialects)
				return Markdown.dialects[dialect];
			else
				throw new Error("Unknown Markdown dialect '" + String(dialect) + "'");
			break;
	}
};

/** buildOptions( options )
 * 
 * @description 运行时配置生成
 */
Markdown.prototype.buildOptions = buildOptions;


/** countLines( str )
 * 
 * @description 对str计行
 */
function countLines(str) {
	var n = 0,
		i = -1;
	while ((i = str.indexOf("\n", i + 1)) !== -1)
		n++;
	return n;
}


/** split_blocks( str )
 * 
 * @discription 把源markdown文本粗略分成block块
 */
function split_blocks(str) {
	str = str.replace(/(\r\n|\n|\r)/g, "\n");		// 把不同的换行符都替换成\n

	var re = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,		// 匹配block块（空白行分割 #起始行分割）
		blocks = [],
		m;

	var line_no = 1;

	// 忽略起始空白行
	if ((m = /^(\s*\n)/.exec(str)) !== null) {
		line_no += countLines(m[0]);
		re.lastIndex = m[0].length;
	}

	while ((m = re.exec(str)) !== null) {

		if (m[2] === "\n#") {
			m[2] = "\n";
			re.lastIndex--;
		}

		blocks.push(mkBlock(m[1], m[2], line_no));
		line_no += countLines(m[0]);
	}

	return blocks;
}


/** processBlock( block , next )
 * 
 * @descript 通过渲染引擎将block转换成jsonML *递归
 * 
 * @param block 当前处理的block
 * @param next  当前block之后的待处理block
 * 
 * @return JsonML MD Tree
 */
Markdown.prototype.processBlock = function processBlock(block, next) {
	var blockAnalyse = this.options.dialect.block,
		ord = blockAnalyse.__order__;

	if ("__call__" in blockAnalyse)
		return blockAnalyse.__call__.call(this, block, next);

	for (var i = 0; i < ord.length; i++) {
		var res = blockAnalyse[ord[i]].call(this, block, next);

		if (res) {
			this.is_debug && this.debug(this.options.dialect.name + '::' + ord[i] + "(block,next)\t::arguments:\n", arguments, "\n result:\n", res);
			if (!isArray(res))
				throw new Error(this.options.dialect.name + '::' + ord[i] + 'return an illegal Result(' + (typeof res) + ')');

			return res;
		}
	}

	// 无合适匹配
	return [];
};

/** processInline( inline_block )
 * 
 * @descript 分析字符串的行内元素	*递归
 * 
 * @param block String 被分析的字符串
 * 
 * @return JsonML Tree / String
 */
Markdown.prototype.processInline = function processInline(inline_block) {
	this.is_debug && this.debug('processInline()\t::arguments\n', arguments);
	return this.options.dialect.inline.__call__.call(this, String(inline_block));
};


/** toMDTree( source , custom_root = array("markdown") [, options ])
 * 
 * @descript	将输入 文本/block 转换成 MD Tree	*递归
 * 
 * @param source      String/Array 源text/block块集合
 * @param custom_root Array        设置后返回jsonML树但是不修改this.tree内容。
 */
Markdown.prototype.toMDTree = function toMDTree(source, custom_root) {

	// 如果不是Array尝试progress => blocks分块
	var blocks = source instanceof Array ? source : split_blocks(source);

	this.is_debug && this.debug("toMDTree()\t::arguments:\n", arguments, "\n blocks:\n", blocks);

	var old_tree = this.tree;
	try {
		this.tree = custom_root || this.tree || ["markdown"];

		blocks_loop:
		while (blocks.length) {
			var b = this.processBlock(blocks.shift(), blocks);
			if (!b.length)
				continue blocks_loop;

			this.tree.push.apply(this.tree, b);
		}

		return this.tree;
	}
	finally {
		if (custom_root)
			this.tree = old_tree;
	}
};


/** Reset( str_or_config )
 * 
 * @description 重置
 */
Markdown.prototype.Reset = function(str_or_config) {

	if (typeof str_or_config === "string")
		this.source = str_or_config;
	else if (typeof str_or_config === "function")
		str_or_config.call(this);
	else
		throw new Error("Unexpected param");

	public_attr.call(this);
};

/** toHtmlTree()
 * 
 * @descript	将markdown文本转换为`HTML TREE`，并连接相邻字符串
 * @this Markdown
 * 
 */
function toHtmlTree() {

	this.is_debug && this.debug("SOURCE:\n\n" + this.source, "\n\ntoHtmlTree()\t::" + "arguments:\n", arguments);

	try {
		// 进行语法分析 String => MD Tree
		var md_tree = this.toMDTree(this.source);

		// 根节点
		if (md_tree[0] === "markdown" && this.options.root) {
			md_tree[0] = this.options.root.slice(0);
			var attr = clone_attr(this.options.rootAttr);
			if (getAttrOfJsonML(md_tree))
				md_tree[1] = attr;
			else
				md_tree.splice(1, 0, attr);
		}

		var html = convert_md_tree_to_html_tree.call(this, md_tree);
		merge_text_nodes(html);

		return html;
	} finally {
		if (this.options.deleteSource)
			this.source = '';
		if (this.options.deleteTree)
			this.tree = null;
	}
}


/** toHtmlTree( [ string = this.source [, options = {} ]])
 * 
 * @descript	将markdown文本转换为`HTML TREE`，并连接相邻字符串
 * 
 * @param string 同时修改markdown源文本
 * @param options
 */
Markdown.prototype.toTree = function() {
	var options;
	if (typeof arguments[0] === "string") {
		this.Reset(arguments[0]);
		options = arguments[1];
	}
	else {
		options = arguments[0];
	}

	options = this.buildOptions(options);

	var html = toHtmlTree.call(this, options);

	this.trigger("toTree", [html]);

	return html;
};

/** convert_md_tree_to_html_tree( tree , references [, options = {} ])
 * 
 * @descript 处理 MD Tree 使之适合生成 HTML Tree	*递归
 * 
 * @param tree 处理的节点
 * @param references 字符集，检索相应的已定义的变量名
 * @param options
 */
function convert_md_tree_to_html_tree(tree) {

	this.is_debug && this.debug("convert_md_tree_to_html_tree()\t::tree:\n", tree);

	var i;
	var options = this.options;

	// clone
	var jsonml = tree;

	if (typeof jsonml === "string")
		return jsonml;

	// clone attr
	var attrs = getAttrOfJsonML(jsonml);
	// if( attrs )
	// 	attrs = jsonml[ 1 ] = clone_attr( attrs );

	var str = options.dialect.__convert_tree__.call(this, jsonml);
	if (typeof str === "string")
		return str;

	// 选择所有子节点
	i = 1;
	// 如果节点存在属性
	if (attrs) {
		// 跳过属性节点
		for (var key in jsonml[1]) {
			i = 2;
			break;
		}
		// 如果没有有意义的属性则删除属性节点
		if (i === 1)
			jsonml.splice(i, 1);
	}

	// NODE H1~H6
	if (jsonml[0].match(/[hH][1-6]/)) {
		var level = jsonml[0].charAt(1);

		if (!isArray(this.Header))
			this.Header = [];
		if (!isArray(this.Header[level]))
			this.Header[level] = [];


		this.Header[level].push(jsonml);

		if (level === "1" && this.options.deleteH1)
			return "";
	}

	// 递归子节点 MD Tree => HTML Tree
	for (; i < jsonml.length; ++i) {
		jsonml[i] = convert_md_tree_to_html_tree.call(this, jsonml[i]);
	}

	return jsonml;
}

/** renderJsonML( jsonml [,options])
 * 
 * @descript 将JsonML Tree渲染成HTML5标签输出
 * 
 * @param jsonml        Array   需要渲染的jsonML Tree
 * 
 */
Markdown.prototype.renderJsonML = function renderJsonML(jsonml, options) {

	this.id_debug && this.debug("renderJsonML\t::arguments:\n", arguments);

	options = this.buildOptions(options);

	var content = [];


	if (options.root) {
		content.push(render_tree(jsonml));	// 渲染节点
	}
	else {

		var len = jsonml.length,
			pNode = getAttrOfJsonML(jsonml) ? 2 : 1;

		for (; pNode < len; pNode++) {
			content.push(render_tree(jsonml[pNode]));
		}
	}

	if (this.options.deleteHTML) {
		this.html = '';
		return content.join("");
	}
	else {
		this.html = content.join("");
		return this.html;
	}
};


/** render_tree( jsonml )
 * 
 * @descript 渲染JsonML Tree，输出HTML标签 *递归
 * 
 * @param jsonml array 用于渲染的JsonML树
 * 
 */
function render_tree(jsonml) {
	// basic case
	if (typeof jsonml === "string")
		return escapeHTML(jsonml);

	var tag = jsonml[0],
		attributes = getAttrOfJsonML(jsonml),
		content = [],
		pNode = attributes ? 2 : 1,
		len = jsonml.length;

	// 递归渲染
	for (; pNode < len; pNode++) {
		content.push(render_tree(jsonml[pNode]));
	}

	// 添加属性标签
	var tag_attrs = "";
	for (var a in attributes)
		tag_attrs += " " + a + '="' + escapeHTML(attributes[a]) + '"';

	// 注意添加的元素img/br/hr都是单行元素
	if (tag === "img" || tag === "br" || tag === "hr")
		return "<" + tag + tag_attrs + "/>";
	else
		return "<" + tag + tag_attrs + ">" + content.join("") + "</" + tag + ">";
}

/** escapeHtml( text )
 * 
 * @descript 将文本中的转移字符替换成 HTML转移字符
 * 			 目前支持:	/& => &amp;
 * 						/< => &lt;
 * 						/> => &gt;
 * 						/" => &quot;
 * 						/' => &#39;
 * 
 * @param text String 被检查替换的字符串
 */
function escapeHTML(text) {
	return text.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/** merge_text_nodes( jsonml )
 * 
 * @description 合并JsonML中相邻的字符串节点 
 * 				删除空字符串
 */
function merge_text_nodes(jsonml) {
	var i = getAttrOfJsonML(jsonml) ? 2 : 1;

	while (i < jsonml.length) {
		if (typeof jsonml[i] === "string") {
			if (i + 1 < jsonml.length && typeof jsonml[i + 1] === "string")
				jsonml[i] += jsonml.splice(i + 1, 1)[0];
			else if (jsonml[i] === "")
				jsonml.splice(i, 1);
			else
				++i;
		} else {
			merge_text_nodes(jsonml[i]);
			++i;
		}
	}
}

/** toHTML([ source [, options ]])
 * 
 * @description 将文本转成html
 * 
 * @param source  String 重置源文本
 * @param options Object 运行时状态
 * 
 * @return html
 */
Markdown.prototype.toHTML = function(source_or_options) {

	this.is_debug && this.debug("toHTML(" + argToArray(arguments).join(' , ') + ")");

	var options;

	if (typeof source_or_options === "string") {
		// source
		this.Reset(source_or_options);
		this.buildOptions(arguments[1]);
	} else {
		// maybe options
		options = this.buildOptions(source_or_options);
	}

	// source => html tree
	var tree = toHtmlTree.call(this, options);

	// FIXME 与渲染树分离 导致重复渲染 效率降低
	// 渲染H1~H6记录属性
	if (this.Header) {
		forEach(this.Header, function(val, index, arr) {
			forEach(val, function(_val, _index, _arr) {
				_arr[_index] = render_tree(_val);
			});
		});
	}

	var html = this.renderJsonML(tree, options);

	this.trigger("toHTML", [html]);

	return html;
};


/** buldBlockOrder( dialect_block )
 * 
 * @descript 为dialect_block对象构建 block索引  d.__order__
 * 
 * @param dialect_block Object dialect.block
 */
Markdown.buildBlockOrder = function(dialect_block) {

	if (typeof dialect_block !== "object")
		throw new TypeError("Unexpected param at Markdown.buildBlockOrder");

	var ord = [];
	for (var key in dialect_block) {
		if (key.match(/^__.*__$/) && !dialect_block.hasOwnProperty(key))
			continue;

		ord.push(key);
	}

	dialect_block.__order__ = ord;
};

/** buildInlineRegExp( dialect_inline )
 *
 * @descript 为dialect_inline构建inline匹配reg
 * 
 * @param dialect_inline Object dialect.inline
 */
Markdown.buildInlineRegExp = function(dialect_inline) {

	if (typeof dialect_inline !== "object")
		throw new TypeError("Unexpected param at Markdown.buildInlineRegExp");

	var regExps = [];

	for (var key in dialect_inline) {
		// __foo__ 这种形式的为特殊功能函数，略过
		if (key.match(/^__.*__$/) || !dialect_inline.hasOwnProperty(key))
			continue;

		var l = key.replace(/([\\.*+?|\()\[\]{}])/g, "\\$1")
			.replace(/\n/, "\\n");
		regExps.push(key.length === 1 ? l : "(?:" + l + ")");
	}

	regExps = regExps.join("|");
	dialect_inline.__regExp__ = regExps;

	if (dialect_inline.__call__) {
		var fn = dialect_inline.__call__;
		dialect_inline.__call__ = function(text, regExp) {
			if (regExp !== undefined)
				return fn.call(this, text, regExp);
			else
				return fn.call(this, text, regExps);
		};
	}
};

/** addDialect
 * 
 * @description 添加dialect
 * 
 * @param dialect Object
 */
Markdown.addDialect = function(dialect) {
	if (typeof dialect !== "object")
		throw new TypeError("Unexpected param at Markdown.addDialect");

	if (!Markdown.dialects[dialect.name])
		Markdown.dialects[dialect.name] = dialect;
	else
		throw new Error("`" + dialect.name + "` has already exist!");
};


/** removeDialect
 * 
 * @description 删除存在的dialect
 * 
 * @param dialect Object/String   *String效率更高
 */
Markdown.removeDialect = function(dialect) {
	if (typeof dialect === "object") {
		var dialects = Markdown.dialects;
		for (var key in dialects) {
			if (dialects[key] === dialect)
				delete dialects[key];
		}
	} else if (typeof dialect === "string") {
		delete Markdown.dialects[dialect];
	} else {
		throw new TypeError("Unexpected param at Markdown.removeDialect()");
	}
};

global.Markdown = Markdown;