#Elegant Markdown 1.0.0

> author IthilQuessir
> email  itimecracker@gmail.com

*如有BUG感谢通过EMAIL交流*

####支持的语法

* block
	* 以#开头的标题
	* 以-=为下划线的标题
	* ul/ol
	* blockquote
	* code
	* hr
	* 变量定义url
	* table
	* p
* inline
	* \\[]`*_-{}[]()#+.! 转义
	* image
	* links
	* autoLink
	* inlineCode
	* br

#### 用法

1. 引入EgMd.js文件

2. 创建对象

	var markdownText = "###Markdown-Header\n\n* Line_1\n* Line_2";
	var markdown = new Markdown(markdownText);
	// 可以传入配置信息 否则使用默认配置
	markdown = new Markdown("",function(){
		this.dialect		= 'Complex';	// 默认渲染引擎
		this.is_debug		= true;
		this.debug_indent	= '';
		this.deleteSource	= true;	// 删除源文本
		this.deleteTree		= true;	// 删除中间转换产生的JsonML树
		this.deleteHTML		= true;	// 删除转换的html结果
		this.root			= "";	// 根节点
		this.rootAttr		= {};	// 根节点属性
		this.deleteH1		= true;	// 删除H1 (仍然会记录到 this.Header.H1)
	});
	
3. 使用方法

	// 如果想将MD ==> HTML
	var html = markdown.toHTML();
	$(ele).html(html);
	// 也可以传入MD文本 不过创建的时候的文本将会被覆盖
	html = markdown.toHTML(markdownText);
	
	// 如果想讲MD ==> JsonML
	// 默认使用创建对象传入的MD文本
	var tree = markdown.toTree();
	// 同样可以传入文本
	tree = markdown.toTree(markdownText);
	

4. 运行时状态

	// 修改此次运行时候的运行参数
	// 并不影响下次运行
	var options = {
		dialect			= 'Complex';
		is_debug		= true;
		debug_indent	= '';
		deleteSource	= true;
		deleteTree		= true;
		deleteHTML		= true;
		root			= "";
		rootAttr		= {};
		deleteH1		= true;
	};
	
	html = markdown.toHTML(markdownText,options);
	html = markdown.toHTML(options);
	tree = markdown.toTree(options);
	tree = markdown.toTree(markdownText,options);


5. Event

Markdown支持toHTML和toTREE两个默认事件
toHTML在调用toHTML()的时候触发
toTree在调用toTree()的时候触发

Markdown.prototype.trigger( eventName [, data ]) 主动触发事件
Markdown.prototype.off( eventName )     解绑事件
`Markdown.prototype.on( eventName [, data ] , fun(     html   ,  data  ) )`
-------------------------事件名-----额外参数---回调函数--html文本---额外参数

	function updateHTML(html){
		$(ele).html(html);
	}
	
	markdown.on('toHTML', updateHTML);
	markdown.off('toHTML');
	
	// 也可以绑定其他事件并触发
	function myFun( first_data , second_data , last_data ){
	}
	
	markdown.on('gogogo',last_data,myFun);
	markdown.trigger('gogogo',[first_data,second_data]);
	



> copyright © www.ithilquessir.com