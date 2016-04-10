/** Config
	 * 
	 * @description 默认配置
	 */
	function Config(){
		this.dialect		= 'Complex';	// 默认渲染引擎
		this.is_debug		= true;
		this.debug_indent	= '';
		this.deleteSource	= true;	// 删除源文本
		this.deleteTree		= true;	// 删除中间转换产生的JsonML树
		this.deleteHTML		= true;	// 删除转换的html结果
		this.root			= "";	// 根节点
		this.rootAttr		= {};	// 根节点属性
		this.deleteH1		= true;	// 删除H1 (仍然会记录到 this.Header.H1)
	}
	
	
	/** Markdown.prototype.buildOptions( options )
	 * 
	 * @description 运行时配置生成
	 */
	function buildOptions ( options ) {
		
		this.is_debug && this.debug( "buildOptions()\t::arguments:\n" , arguments );
		
		options = options || {};
		
		if( typeof options !== "object" || isArray(options) )
			throw new TypeError("Unexpert param(options) at buildOptions(" + options + ")");
		
		if( !options.isset )
		{
			options.isset = true;
			options.deleteSource	= options.deleteSource || this.deleteSource;
			options.deleteTree		= options.deleteTree || this.deleteTree;
			options.deleteHTML      = options.deleteHTML || this.deleteHTML;
			options.deleteH1		= options.deleteH1 || this.deleteH1;
			
			options.root     = options.root || typeof options.root === "string" ? options.root : this.root;
			options.rootAttr = options.rootAttr || this.rootAttr || {};
			options.dialect  = getDialect( options.dialect || this.dialect );
			
			this.options = options;
		}
		return options;
	}