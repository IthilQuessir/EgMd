	// ===========================
	// =     Complex语法分析引擎   
	// =
	// = 这是v 1.0.0 版本的遗留文件
	// = 用于以后扩充语法参考
	// = 将在之后版本中删除
	// ===========================

	var Complex = {
		name: "Complex",
		block: {

			// H1 ~ H6	|### STR
			atxHeader: function atxHeader( block, next ) {
				var m = block.match( /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/ );

				if ( !m )
					return undefined;

				var header = [ "header", { level: m[ 1 ].length } ];
				Array.prototype.push.apply(header, this.processInline(m[ 2 ]));

				if ( m[0].length < block.length )
					next.unshift( mkBlock( block.substr( m[0].length ), block.trailing, block.lineNum + 2 ) );

				return [ header ];
			},

			// H1 ~ H6	|STR
			//			|======
			setextHeader: function setextHeader( block, next ) {
				var m = block.match( /^(.*)\n([-=])\2\2+(?:\n|$)/ );

				if ( !m )
					return undefined;

				var level  = ( m[ 2 ] === "=" ) ? 1 : 2;
				var header = [ "header", { level : level } ];
				Array.prototype.push.apply(header, this.processInline(m[ 1 ]));

				if ( m[0].length < block.length )
					next.unshift( mkBlock( block.substr( m[0].length ), block.trailing, block.lineNum + 2 ) );

				return [ header ];
			},

			// pre	   |	[CODE TYPE] [LINE NUM]
			//		   |    STR
			//		   |	STR
			// * 自动合并相邻的Code Block 除非有不同的CODE TYPE
			code: function code( block, next ) {

				var ret = [];
				var re = /^(?: {0,3}\t| {4})(.*)\n?/;

				//	代码属性							 code stype		line num
				var codeType = /^(?: {0,3}\t| {4})\s*\[(.*?)\](?:\s*\[(.*?)\])?[ \t]*\n?/;
				var attr = null;

				function getAttr( block ){
					var b = block.valueOf();
					var m = null;

					if ( !!( m = b.match( codeType )) )
					{
						b = b.substr( m[0].length );
						attr = {};
						attr.codeType   = m[1] ? m[1] : 'cpp';
						attr.lineNumber = m[2] ? m[2] : null;
					}

					return b;
				}
				function pushRet( m ){
					ret.push( m[1] );
				}

				if ( !block.match( re ) )
					return undefined;

				var b = getAttr( block );

				block_search:
				do {
					// 安行分组
					b = Complex.loop_reg_over_block( re, b , pushRet );

					if ( b.length ) {
						// 将剩余的放到next
						next.unshift( mkBlock(b, block.trailing) );
						break block_search;
					}
					else if ( next.length ) {
						// 检查next是否也是code block
						if ( next[0].match( codeType ) || !next[0].match( re ) )
							break block_search;

						// 两个code block的间隔
						ret.push ( block.trail.replace(/[^\n]/g, "").substring(2) );

						b = next.shift().valueOf();
					}
					else {
						break block_search;
					}
				} while ( true );


				var code_block = [ "code_block" ];
				if( attr )
					code_block.push( attr );
				code_block.push( ret.join("\n") );

				return [ code_block ];
			},

			// hr		:	*********
			horizRule: function horizRule( block, next ) {
				// 查找block中的hr标记
				var m = block.match( /^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/ );

				if ( !m )
					return undefined;

				var classes = '';
				// 给hr添加class标签
				switch( m[2] )
				{
				case '-':
					classes = 'dec';
					break;
				case '_':
					classes = 'dash';
					break;
				case '*':
					classes = 'star';
					break;
				default:
					classes = '';
				}
				var jsonml = [ [ "hr" , { "class" : classes } ] ];

				// 在hr之前的block
				if ( m[ 1 ] ) {
					var contained = mkBlock( m[ 1 ], "", block.lineNum );
					jsonml.unshift.apply( jsonml, this.toMDTree( contained, [] ) );
				}

				// hr之后的block
				if ( m[ 3 ] )
					next.unshift( mkBlock( m[ 3 ], block.trailing, block.lineNum + 1 ) );

				return jsonml;
			},

			// ul		:	*  STR
			// ol		:	1. STR
			lists: (function() {
				var any_list = "[*+-]|\\d+(?:\\.)",
				bullet_list = /[*+-]/,

				is_list_re = new RegExp( "^( {0,3})(" + any_list + ")[ \t]+" ),
				indent_re = "(?: {0,3}\\t| {4})";

				function regex_for_depth( depth ) {
					return new RegExp(
						// m[1] = indent, m[2] = list_type
						"(?:^(" + indent_re + "{0," + depth + "} {0,3})(" + any_list + ")\\s+)|" +
						// m[3] = cont
						"(^" + indent_re + "{0," + (depth-1) + "}[ ]{0,4})"
					);
				}
				function expand_tab( input ) {
					return input.replace( / {0,3}\t/g, "    " );
				}

				// Add inline content `inline` to `li`. inline comes from processInline
				// so is an array of content
				function add(li, loose, inline, nl) {
					if ( loose ) {
						li.push( [ "para" ].concat(inline) );
						return;
					}
					// console.log('IIII',inline);
					// Hmmm, should this be any block level element or just paras?
					var add_to = li[li.length -1] instanceof Array && li[li.length - 1][0] === "para"
					? li[li.length -1]
					: li;

					// If there is already some content in this list, add the new line in
					if ( nl && li.length > 1 )
						inline.unshift(nl);

					for ( var i = 0; i < inline.length; i++ ) {
						var what = inline[i],
						is_str = typeof what === "string";
						if ( is_str && add_to.length > 1 && typeof add_to[add_to.length-1] === "string" )
							add_to[ add_to.length-1 ] += what;
						else
							add_to.push( what );
					}
				}

				// contained means have an indent greater than the current one. On
				// *every* line in the block
				function get_contained_blocks( depth, blocks ) {

					var re = new RegExp( "^(" + indent_re + "{" + depth + "}.*?\\n?)*$" ),
					replace = new RegExp("^" + indent_re + "{" + depth + "}", "gm"),
					ret = [];
					// console.log('BBB',blocks);
					while ( blocks.length > 0 ) {
						if ( re.exec( blocks[0] ) ) {
							var b = blocks.shift(),
							// 删除匹配的深度部分
							x = b.replace( replace, "");

							ret.push( mkBlock( x, b.trailing, b.lineNum ) );
						}
						else
							break;
					}
					return ret;
				}

				// passed to stack.forEach to turn list items up the stack into paras
				function paragraphify(s, i, stack) {

					var list = s.list;
					var last_li = list[list.length-1];


					if ( last_li[1] instanceof Array && last_li[1][0] === "para" )
						return;
					if ( i + 1 === stack.length ) {
						// 列表最后一项
						// 将内容字符串替换为para
						// 避免想attr写入para

						i = 1;
						if( last_li instanceof Object )
							i = 2;

						last_li.push( ["para"].concat( last_li.splice(i, last_li.length - 1) ) );
					}
					else {
						var sublist = last_li.pop();
						last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ), sublist );
					}
				}

				// The matcher function
				return function( block, next ) {
					var m = block.match( is_list_re );
					if ( !m )
						return undefined;

					function make_list( m ) {
						var list = bullet_list.exec( m[2] )
						? ["bulletlist"]
						: ["numberlist"];

						// list.push({"class":m[2]});

						stack.push( { list: list, indent: m[1] } );
						return list;
					}

					function make_li( header ){
						var li = ["listitem"];

						switch( header )
						{
						case "+":
							header = 'add';
							break;
						case "-":
							header = "dec";
							break;
						case "*":
							header = "star";
							break;
						default:
							header = header.replace(/\.$/g,"");
						}

						li.push( { "class" : header } );

						return li;
					}


					var stack = [], // 列表的层叠栈
					list = make_list( m ),
					last_li,
					loose = false,
					ret = [ stack[0].list ],
					i,
					li_accumulate = "",
					nl = "",
					lines;


					function getNL(n){
						nl = n; return "";
					}

					// 将block按行分开，循环查找li
					loose_search:
					while ( true ) {
						// 分行
						lines = block.split( /(?=\n)/ );

						// 对每一个li进行processInline()
						li_accumulate = "";
						nl = "";

						// 在当前block中搜索相邻的li
						tight_search:
						for ( var line_no = 0; line_no < lines.length; line_no++ ) {
							nl = "";
							var l = lines[line_no].replace(/^\n/, getNL );

							var line_re = regex_for_depth( stack.length );
							m = l.match( line_re );

							// 存在一个li
							if ( m[1] !== undefined ) {
								// 应该先对之前的li进行processInline并添加
								if ( li_accumulate.length ) {
									add( last_li, loose, this.processInline( li_accumulate ), nl );
									// 处理后将loose置false
									loose = false;
									li_accumulate = "";
								}

								m[1] = expand_tab( m[1] );
								var wanted_depth = Math.floor(m[1].length/4)+1;

								if ( wanted_depth > stack.length ) {
									// Deep enough for a nested list outright
									//print ( "new nested list" );
									list = make_list( m );
									last_li.push( list );
									last_li = list[1] = make_li( m[2] );
								}
								else {
									var found = false;
									for ( i = 0; i < stack.length; i++ ) {
										if ( stack[ i ].indent !== m[1] )
											continue;

										list = stack[ i ].list;
										stack.splice( i+1, stack.length - (i+1) );
										found = true;
										break;
									}

									if (!found) {
										//print("not found. l:", uneval(l));
										wanted_depth++;
										if ( wanted_depth <= stack.length ) {

											stack.splice(wanted_depth, stack.length - wanted_depth);
											//print("Desired depth now", wanted_depth, "stack:", stack.length);
											list = stack[wanted_depth-1].list;
											//print("list:", uneval(list) );
										}
										else {
											//print ("made new stack for messy indent");
											list = make_list(m);

											last_li.push(list);
										}
									}

									last_li =  make_li( m[2] );
									list.push(last_li);
								} // end depth of shenegains
								nl = "";
							}

							// Add content
							if ( l.length > m[0].length )
								li_accumulate += nl + l.substr( m[0].length );
						} // tight_search

						// 处理并添加最后一次得到的li
						if ( li_accumulate.length ) {
							add( last_li, loose, this.processInline( li_accumulate ), nl );
							// Loose mode will have been dealt with. Reset it
							loose = false;
							li_accumulate = "";
						}

						// 查看下一个block，是否有可以链接的li或者链接在上一个li之后的必要内容
						var contained = get_contained_blocks( stack.length, next );
						// Deal with code blocks or properly nested lists
						if ( contained.length > 0 ) {
							// Make sure all listitems up the stack are paragraphs
							// 将最后listitem都变成para
							forEach( stack, paragraphify, this);

							last_li.push.apply( last_li, this.toMDTree( contained, [] ) );
						}

						var next_block = next[0] && next[0].valueOf() || "";


						if ( next_block.match(is_list_re) || next_block.match( /^ / ) ) {
							block = next.shift();

							// Check for an HR following a list: features/lists/hr_abutting
							var hr = this.options.dialect.block.horizRule( block, next );

							if ( hr ) {
								ret.push.apply(ret, hr);
								break;
							}

							// Make sure all listitems up the stack are paragraphs
							forEach( stack, paragraphify, this);

							loose = true;
							continue loose_search;
						}
						break;
					} // loose_search

					return ret;
				};
			})(),

			// blockquote	:	>BLOCK
			//				:	>BLOCK
			blockquote: function blockquote( block, next ) {
				if ( !block.match( /^>/m ) )
					return undefined;

				var jsonml = [];

				// separate out the leading abutting block, if any. I.e. in this case:
				//
				//  a
				//  > b
				//
				if ( block[ 0 ] !== ">" ) {
					var lines = block.split( /\n/ ),
					prev = [],
					line_no = block.lineNum;

					// keep shifting lines until you find a crotchet
					while ( lines.length && lines[ 0 ][ 0 ] !== ">" ) {
						prev.push( lines.shift() );
						line_no++;
					}

					var abutting = mkBlock( prev.join( "\n" ), "\n", block.lineNum );
					jsonml.push.apply( jsonml, this.processBlock( abutting, [] ) );
					// reassemble new block of just block quotes!
					block = mkBlock( lines.join( "\n" ), block.trailing, line_no );
				}


				// if the next block is also a blockquote merge it in
				while ( next.length && next[ 0 ][ 0 ] === ">" ) {
					var b = next.shift();
					block = mkBlock( block + block.trailing + b, b.trailing, block.lineNum );
				}

				// Strip off the leading "> " and re-process as a block.
				var input = block.replace( /^> ?/gm, "" ),
				old_tree = this.tree,
				processedBlock = this.toMDTree( input, [ "blockquote" ] ),
				attr = getAttrOfJsonML( processedBlock );

				// If any link references were found get rid of them
				if ( attr && attr.references ) {
					delete attr.references;
					// And then remove the attribute object if it's empty
					if ( isEmpty( attr ) )
						processedBlock.splice( 1, 1 );
				}

				jsonml.push( processedBlock );
				return jsonml;
			},

			// this.reference
			// 忽略大小写
			referenceDefn: function referenceDefn( block, next) {
				var re = /^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;
				// interesting matches are [ , ref_id, url, , title, title ]

				if ( !block.match(re) )
					return undefined;

				// 变量表
				if ( !this.references )
					this.references = {};
				var refs = this.references;

				var b = Complex.loop_reg_over_block(re, block, function( m ) {

					if ( m[2] && m[2][0] === "<" && m[2][m[2].length-1] === ">" )
						m[2] = m[2].substring( 1, m[2].length - 1 );

					var ref = refs[ m[1].toLowerCase() ] = {
						href: m[2]
					};

					if ( m[4] !== undefined )
						ref.title = m[4];
					else if ( m[5] !== undefined )
						ref.title = m[5];

				});

				if ( b.length )
					next.unshift( mkBlock( b, block.trailing ) );

				return [];
			},

			// table		| Header_1 | Header_2 |
			//				|:--------:|:--------:|
			//				|   Row_1  |   Row_2  |
			table: function tabled ( block ) {

				var _split_on_unescaped = function( s, ch ) {
					ch = ch || '\\s';
					if ( ch.match(/^[\\|\[\]{}?*.+^$]$/) )
						ch = '\\' + ch;
					var res = [ ],
					r = new RegExp('^((?:\\\\.|[^\\\\' + ch + '])*)' + ch + '(.*)'),
					m;
					while ( ( m = s.match( r ) ) ) {
						res.push( m[1] );
						s = m[2];
					}
					res.push(s);
					return res;
				};

				var leading_pipe = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,
				// find at least an unescaped pipe in each line
				no_leading_pipe = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/,
				i,
				m;
				if ( ( m = block.match( leading_pipe ) ) ) {
					// remove leading pipes in contents
					// (header and horizontal rule already have the leading pipe left out)
					m[3] = m[3].replace(/^\s*\|/gm, '');
				} else if ( ! ( m = block.match( no_leading_pipe ) ) ) {
					return undefined;
				}

				var table = [ "table", [ "thead", [ "tr" ] ], [ "tbody" ] ];

				// remove trailing pipes, then split on pipes
				// (no escaped pipes are allowed in horizontal rule)
				m[2] = m[2].replace(/\|\s*$/, '').split('|');

				// process alignment
				var html_attrs = [ ];
				forEach (m[2], function (s) {
					if (s.match(/^\s*-+:\s*$/))
						html_attrs.push({align: "right"});
					else if (s.match(/^\s*:-+\s*$/))
						html_attrs.push({align: "left"});
					else if (s.match(/^\s*:-+:\s*$/))
						html_attrs.push({align: "center"});
					else
						html_attrs.push({});
				});

				// now for the header, avoid escaped pipes
				m[1] = _split_on_unescaped(m[1].replace(/\|\s*$/, ''), '|');
				for (i = 0; i < m[1].length; i++) {
					table[1][1].push(['th', html_attrs[i] || {}]
					.concat( this.processInline(m[1][i].trim())));
				}

				// now for body contents
				forEach (m[3].replace(/\|\s*$/mg, '').split('\n'), function (row) {
					var html_row = ['tr'];
					row = _split_on_unescaped(row, '|');
					for (i = 0; i < row.length; i++)
						html_row.push(['td', html_attrs[i] || {}].concat(this.processInline(row[i].trim())));
					table[2].push(html_row);
				}, this);

				return [table];
			},

			// p
			para: function para( block ) {
				// 其它都算是para
				return [ ["para"].concat( this.processInline( block ) ) ];
			}
		},
		inline: {

			__oneElement__: function oneElement( text, patterns_or_reg, previous_nodes ) {
				var m,res,re;
				var dialect = this.options.dialect;

				patterns_or_reg = patterns_or_reg || dialect.inline.__regExp__;

				re = new RegExp( "([\\s\\S]*?)(" + (patterns_or_reg.source || patterns_or_reg) + ")" );

				m = re.exec( text );
				if (!m) {
					// Just boring text
					return [ text.length, text ];
				}
				else if ( m[1] ) {
					// Some un-interesting text matched. Return that first
					return [ m[1].length, m[1] ];
				}

				if ( m[2] in dialect.inline ) {
					res = dialect.inline[ m[2] ].call(
						this,
						text.substr( m.index ), m, previous_nodes || []
					);
				}
				// Default for now to make dev easier. just slurp special and output it.
				res = res || [ m[2].length, m[2] ];
				return res;
			},

			__call__: function inline( text, patterns ) {

				this.is_debug && this.debug( "inline.__call__()\t::arguments\n",arguments);

				var out = [] , res;
				var dialect = this.options.dialect;
				function add(x) {
					if ( typeof x === "string" && typeof out[out.length-1] === "string" )
						out[ out.length-1 ] += x;
					else
						out.push(x);
				}

				while ( text.length > 0 ) {
					res  = dialect.inline.__oneElement__.call( this, text, patterns, out );
					text = text.substr( res.shift() );
					forEach(res, add );
				}

				return out;
			},

			// These characters are intersting elsewhere, so have rules for them so that
			// chunks of plain text blocks don't include them
			"]": function () {},
			"}": function () {},

			__escape__ : /^\\[\\`\*_{}\[\]()#\+.!\-]/,

			"\\": function escaped( text ) {
				// [ length of input processed, node/children to add... ]
				// Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
				if ( this.options.dialect.inline.__escape__.exec( text ) )
					return [ 2, text.charAt( 1 ) ];
				else
					// Not an esacpe
					return [ 1, "\\" ];
			},

			"![": function image( text ) {

				// Unlike images, alt text is plain text only. no other elements are
				// allowed in there

				// ![Alt text](/path/to/img.jpg "Optional title")
				//      1          2            3       4         <--- captures
				var m = text.match( /^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/ );

				if ( m ) {
					if ( m[2] && m[2][0] === "<" && m[2][m[2].length-1] === ">" )
						m[2] = m[2].substring( 1, m[2].length - 1 );

					m[2] = this.options.dialect.inline.__call__.call( this, m[2], /\\/ )[0];

					var attrs = { alt: m[1], href: m[2] || "" };
					if ( m[4] !== undefined)
						attrs.title = m[4];

					return [ m[0].length, [ "img", attrs ] ];
				}

				// ![Alt text][id]
				m = text.match( /^!\[(.*?)\][ \t]*\[(.*?)\]/ );

				if ( m ) {
					// We can't check if the reference is known here as it likely wont be
					// found till after. Check it in md tree->hmtl tree conversion
					return [ m[0].length, [ "img_ref", { alt: m[1], ref: m[2].toLowerCase(), original: m[0] } ] ];
				}

				// Just consume the '!['
				return [ 2, "![" ];
			},

			"[": function links( text ) {

				var orig = String(text);

				// Inline content is possible inside `link text`
				var res = Complex.inline_until_char.call( this, text.substr(1), "]" );

				// No closing ']' found. Just consume the [
				if ( !res )
					return [ 1, "[" ];

				var consumed = 1 + res[ 0 ],
				children = res[ 1 ],
				link,
				attrs;

				// At this point the first [...] has been parsed. See what follows to find
				// out which kind of link we are (reference or direct url)
				text = text.substr( consumed );

				// [link text](/path/to/img.jpg "Optional title")
				//                 1            2       3         <--- captures
				// This will capture up to the last paren in the block. We then pull
				// back based on if there a matching ones in the url
				//    ([here](/url/(test))
				// The parens have to be balanced
				var m = text.match( /^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/ );
				if ( m ) {
					var url = m[1];
					consumed += m[0].length;

					if ( url && url[0] === "<" && url[url.length-1] === ">" )
						url = url.substring( 1, url.length - 1 );

					// If there is a title we don't have to worry about parens in the url
					if ( !m[3] ) {
						var open_parens = 1; // One open that isn't in the capture
						for ( var len = 0; len < url.length; len++ ) {
							switch ( url[len] ) {
							case "(":
								open_parens++;
								break;
							case ")":
								if ( --open_parens === 0) {
									consumed -= url.length - len;
									url = url.substring(0, len);
								}
								break;
							}
						}
					}

					// Process escapes only
					url = this.options.dialect.inline.__call__.call( this, url, /\\/ )[0];

					attrs = { href: url || "" };
					if ( m[3] !== undefined)
						attrs.title = m[3];

					link = [ "link", attrs ].concat( children );
					return [ consumed, link ];
				}

				// [Alt text][id]
				// [Alt text] [id]
				m = text.match( /^\s*\[(.*?)\]/ );

				if ( m ) {

					consumed += m[ 0 ].length;

					// [links][] uses links as its reference
					attrs = { ref: ( m[ 1 ] || String(children) ).toLowerCase(),  original: orig.substr( 0, consumed ) };

					link = [ "link_ref", attrs ].concat( children );

					// We can't check if the reference is known here as it likely wont be
					// found till after. Check it in md tree->hmtl tree conversion.
					// Store the original so that conversion can revert if the ref isn't found.
					return [ consumed, link ];
				}

				// [id]
				// Only if id is plain (no formatting.)
				if ( children.length === 1 && typeof children[0] === "string" ) {

					attrs = { ref: children[0].toLowerCase(),  original: orig.substr( 0, consumed ) };
					link = [ "link_ref", attrs, children[0] ];
					return [ consumed, link ];
				}

				// Just consume the "["
				return [ 1, "[" ];
			},

			"<": function autoLink( text ) {
				var m;

				if ( ( m = text.match( /^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/ ) ) !== null ) {
					if ( m[3] )
						return [ m[0].length, [ "link", { href: "mailto:" + m[3] }, m[3] ] ];
					else if ( m[2] === "mailto" )
						return [ m[0].length, [ "link", { href: m[1] }, m[1].substr("mailto:".length ) ] ];
					else
						return [ m[0].length, [ "link", { href: m[1] }, m[1] ] ];
				}

				return [ 1, "<" ];
			},

			"`": function inlineCode( text ) {
				// 行内元素可以前后由相等数量的任意多个`来包含
				var m = text.match( /(`+)(([\s\S]*?)\1)/ );

				if ( m && m[2] )
					return [ m[1].length + m[2].length, [ "inlinecode", { "class" : 'code' + m[1].length.toString() } , m[3] ] ];
				else {
					// TODO: No matching end code found - warn!
					return [ 1, "`" ];
				}
			},

			"  \n": function lineBreak() {
				return [ 3, [ "linebreak" ] ];
			}

		},

		// MD Tree Tag/Attr  => HTML Tree Tag/Attr
		__convert_tree__: function( jsonml ){

			// 如果想递归，则用 convert_md_tree_to_html_tree.call(this)

			var attrs = getAttrOfJsonML( jsonml );
			var references = this.references;

			switch ( jsonml[ 0 ] ) {
			case "header":
				jsonml[ 0 ] = "h" + jsonml[ 1 ].level;
				delete jsonml[ 1 ].level;
				break;
			case "bulletlist":
				jsonml[ 0 ] = "ul";
				break;
			case "numberlist":
				jsonml[ 0 ] = "ol";
				break;
			case "listitem":
				jsonml[ 0 ] = "li";
				break;
			case "para":
				jsonml[ 0 ] = "p";
				break;
			case "markdown":
				jsonml[ 0 ] = "html";
				break;
			case "code_block":
				jsonml[ 0 ] = "pre";
				var code = [ "code" ];
				var j = 1;

				if( attrs )
				{
					j = 2;

					if ( jsonml[1].lineNumber )
						jsonml[1].class = jsonml[1].lineNumber;

					if (jsonml[1].codeType)
						code.push( { "class": jsonml[1].codeType } );

					delete jsonml[1].lineNumber;
					delete jsonml[1].codeType;
				}

				code.push.apply( code, jsonml.splice( j , jsonml.length - j ) );
				jsonml[ j ] = code;
				break;
			case "inlinecode":
				jsonml[ 0 ] = "code";
				break;
			case "img":
				jsonml[ 1 ].src = jsonml[ 1 ].href;
				delete jsonml[ 1 ].href;
				break;
			case "linebreak":
				jsonml[ 0 ] = "br";
				break;
			case "link":
				jsonml[ 0 ] = "a";
				break;
			case "link_ref":
				jsonml[ 0 ] = "a";

				var ref = references[ attrs.ref ];

				// 如果变量存在
				if ( ref ) {
					delete attrs.ref;

					attrs.href = ref.href;
					if ( ref.title )
						attrs.title = ref.title;

					// 删除节点复原信息
					delete attrs.original;
				}
				else {
					return attrs.original;
				}
				break;
			case "img_ref":
				jsonml[ 0 ] = "img";

				// 获取属性
				var ref = references[ attrs.ref ];

				// 如果变量存在 转化成link
				if ( ref ) {
					delete attrs.ref;

					attrs.src = ref.href;
					if ( ref.title )
						attrs.title = ref.title;

					// 删除节点复原信息
					delete attrs.original;
				}
				else {
					return attrs.original;
				}
				break;
			}
		}
	};


	// strong和em标签
	function strong_em( tag, md ) {

		var state_slot = tag + "_state",
		other_slot = tag === "strong" ? "em_state" : "strong_state";

		function CloseTag(len) {
			this.len_after = len;
			this.name = "close_" + md;
		}


		return function ( text ) {
			if ( this[state_slot][0] === md ) {

				this[state_slot].shift();

				// "Consume" everything to go back to the recrusion in the else-block below
				return[ text.length, new CloseTag(text.length-md.length) ];
			}
			else {
				// Store a clone of the em/strong states
				var other = this[other_slot].slice(),
				state = this[state_slot].slice();


				this[state_slot].unshift(md);

				var res = this.processInline( text.substr( md.length ) );

				var last = res[res.length - 1];

				var check = this[state_slot].shift();
				if ( last instanceof CloseTag ) {
					res.pop();
					// We matched! Huzzah.
					var consumed = text.length - last.len_after;
					return [ consumed, [ tag ].concat(res) ];
				}
				else {
					// Restore the state of the other kind. We might have mistakenly closed it.


					this[other_slot] = other;
					this[state_slot] = state;

					// We can't reuse the processed result as it could have wrong parsing contexts in it.
					return [ md.length, md ];
				}
			}
		}; // End returned function
	}

	Complex.inline["**"] = strong_em("strong", "**");
	Complex.inline["__"] = strong_em("strong", "__");
	Complex.inline["*"]  = strong_em("em", "*");
	Complex.inline["_"]  = strong_em("em", "_");


	Complex.inline_until_char = function( text, want ) {
		var consumed = 0 , nodes = [];

		while ( true ) {
			if ( text.charAt( consumed ) === want ) {
				// 搜索下一个我们期望的字符串
				consumed++;
				return [ consumed, nodes ];
			}

			if ( consumed >= text.length ) {
				// No closing char found.
				return null;
			}

			var res = this.options.dialect.inline.__oneElement__.call(this, text.substr( consumed ) );
			consumed += res[ 0 ];

			// 将分析完的字符串存入nodes
			nodes.push.apply( nodes, res.slice( 1 ) );
		}
	};

	/** loop_reg_over_block
	 *
	 * @description block中的所有符合re正则的式子逐个执行cb函数
	 *
	 * @param re		用于匹配的正则 不要使用/g
	 * @param block		被匹配的块
	 * @param cb(m)		回调函数 对匹配到的内容之行 m是匹配结果
	 *
	 * @return 剩余的未成功匹配的字符串
	 */
	Complex.loop_reg_over_block = function ( re , block , cb ) {

		var m,
		b = block.valueOf();

		while ( b.length && !!(m = re.exec(b) ) ) {
			b = b.substr( m[0].length );
			cb.call(this, m);
		}

		return b;
	};

	Markdown.buildBlockOrder( Complex.block );
	Markdown.buildInlineRegExp( Complex.inline );
	Markdown.addDialect( Complex );
