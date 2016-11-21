!function(t,n){"use strict";function e(t){for(var n=t.split("/"),e=0,i=n.length,r=l;e<i;e++){if(!(n[e]in r))throw new Error("[Md require] Cannot find module: "+t);r=r[n[e]]}return r}function i(t,n){for(var i=t.split("/"),r=0,s=i.length-1,a=l,o=null;r<s;r++)i[r]in a||(a[i[r]]={}),a=a[i[r]];if(i[r]in a)throw new Error("[Md extend] Module had existed;\nThe Url is "+t);if(o=n.call(a,e),!o)throw new Error('[Md extend] Unexpected return of the module "'+i[r]+'"');a[i[r]]=o}function r(t,n){var i,r=e("dialects"),l=null;if(n=n||{},n.dialect&&n.dialect in r)l=r[n.dialect];else for(i in r){l=r[i];break}if(!l)throw new Error("[Md] Plese use full_version or include dialect module\n请使用完整版或者 Md-seed.js + dialect模块配合使用。仅单独使用Md-seed.js是无法运行的");return t=t.replace(/^\s*\n/,"").replace(/\s*$/,""),l.parse(t).toHtml()}var l={};r.extend=i,t.Md=r}(this),Md.extend("attr",function(t){function n(){this.list={}}return n.prototype.add=function(t,n){this.list[t]=n},n.prototype.rm=function(t){delete this.list[t]},n.prototype.get=function(t){return this.list[t]||null},n.prototype.forEach=function(t){var n,e=this.list;for(n in e)e.hasOwnProperty(n)&&t.call(this,n,e[n])},n.prototype.clone=function(){},n}),Md.extend("dialect-builder",function(t){function n(){this.syntaxLib={}}function e(){this.list=[]}return n.prototype.parse=function(t){if("block"in this.syntaxLib)return this.syntaxLib.block.parse(t);throw new Error("[Dialect parse] Dialect must has extend block module")},n.prototype.extend=function(t,n){this.syntaxLib[t]=new n(this)},n.prototype.getSyntax=function(t){if(t in this.syntaxLib)return this.syntaxLib[t];throw new Error("[Dialect getSyntax] This dialect hasn't syntax named "+t)},e.prototype.setSyntax=function(t){return this.list.push.apply(this.list,t),this},e.prototype.build=function(){for(var e=0,i=this.list.length,r=null,l=new n;e<i;e++)r=t("syntax/"+this.list[e]),l.extend(this.list[e],r);return l},e}),Md.extend("node",function(t){function n(t){this.__tag__=t?t:"",this.__attr__=new e,this.children=[]}var e=t("attr");return n.prototype.attr=function(t,n){return"undefined"==typeof n?this.__attr__.get(t):(this.__attr__.add(t,n),this)},n.prototype.rmAttr=function(t){return this.__attr__.rm(t),this},n.prototype.appendChild=function(t){return this.children.push(t),this},n.prototype.toHtml=function(){var t=null,n=this.children,e=-1,i=n.length;for(""===this.__tag__?t=document.createDocumentFragment():(t=document.createElement(this.__tag__),this.__attr__.forEach(function(n,e){t.setAttribute(n,e)}));++e<i;)t.appendChild(n[e].toHtml());return t},n}),Md.extend("text-node",function(t){function n(t){this.text=t}return n.prototype.toHtml=function(){return document.createTextNode(this.text)},n}),Md.extend("syntax/block",function(t){function n(){this.lib=[]}var e=t("node");return n.prototype.extend=function(t){this.lib.push(t)},n.prototype.parse=function(t){var n,i=[t],r=null,l=this.lib.length,s=null,a=new e;do for(t=i.pop(),n=0;n<l;n++){if(r=[],s=this.lib[n].parse(t,r),r.length&&(r.reverse(),i.push.apply(i,r)),s){a.appendChild(s);break}r.length&&(t=i.pop())}while(i.length);return a},n.expend=function(t){expendGrammars.push(t)},n}),Md.extend("syntax/inline",function(t){function n(){this.lib=[]}var e=t("node");return n.prototype.extend=function(t){this.lib.push(t)},n.prototype.parse=function(t){var n,i=[t],r=null,l=this.lib.length,s=null,a=new e;do for(t=i.pop(),n=0;n<l;n++){if(r=[],s=this.lib[n].parse(t,r),r.length&&(r.reverse(),i.push.apply(i,r)),s){a.appendChild(s);break}r.length&&(t=i.pop())}while(i.length);return a},n}),Md.extend("syntax/combin-block",function(t){function n(t){this.block=t.getSyntax("block"),this.block.extend(this)}var e=t("node");return n.prototype.parse=function(t){var n=t.split(/(?:^\s*\n)/m),i=this;return n.length>1?function(){for(var t=new e,r=0,l=n.length;r<l;r++)t.appendChild(i.block.parse(n[r]));return t}():null},n}),Md.extend("syntax/blockquote",function(t){function n(t){this.block=t.getSyntax("block"),this.block.extend(this)}var e=t("node");return n.prototype.parse=function(t,n){var i=t.match(/^(?:>\s*.*[\n$])+/m),r=null;return i?i.index?(n.push(t.substring(0,i.index)),n.push(i[0]),n.push(t.substr(i.index+i[0].length)),null):(i[0].length<t.length&&n.push(t.substr(i[0].length)),r=i[0].replace(/^>[ \f\r\t\v]*/gm,""),new e("blockquote").appendChild(this.block.parse(r))):null},n}),Md.extend("syntax/atx-header",function(t){function n(t){var n=t.getSyntax("block");n.extend(this),this.inline=t.getSyntax("inline")}var e=t("node"),i=/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/;return n.prototype.parse=function(t,n){if(!i.test(t))return null;var r=t.match(i),l=new e("h"+r[1].length);return l.appendChild(this.inline.parse(r[2])),r[0].length<t.length&&n.push(t.substr(r[0].length)),l},n}),Md.extend("syntax/setext-header",function(t){function n(t){block=t.getSyntax("block"),block.extend(this),this.inline=t.getSyntax("inline")}var e=t("node");return n.prototype.parse=function(t,n){var i=/^(.*)\n([-=])\2\2+(?:\n|$)/,r=null,l="",s=null;return i.test(t)?(r=t.match(i),l="="===r[2]?"h1":"h2",s=new e(l),s.appendChild(this.inline.parse(r[1])),r[0].length<t.length&&n.push(t.substr(r[0].length)),s):null},n}),Md.extend("syntax/table",function(t){function n(t){var n=t.getSyntax("block");n.extend(this),this.inline=t.getSyntax("inline")}function e(t,n,e){var s=new l("table");return s.appendChild(i.call(this,t,n)).appendChild(r.call(this,e,n)),s}function i(t,n){var e=new l("tr"),i=null;return t.forEach(function(t,r){i=this.inline.parse(t),i=new l("th").appendChild(i),i.attr("align",n[r]),n[r]&&i.attr("align",n[r]),e.appendChild(i)},this),new l("thead").appendChild(e)}function r(t,n){var e=new l("tr"),i=null,r=new l("tbody");return t.forEach(function(t){e=new l("tr"),t.forEach(function(t,r){i=new l("td").appendChild(this.inline.parse(t)),n[r]&&i.attr("align",n[r]),e.appendChild(i)},this),r.appendChild(e)},this),r}var l=t("node");return n.prototype.parse=function(t,n){function i(t){return t.replace(/^\s*\|/,"").replace(/\s*$/,"").replace(/\|$/,"")}var r,l,s,a=/^ {0,3}((?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))\n {0,3}((?:(?:\|\s*(?::\s*)?-[-\s]*(?::\s*)?)+\|?)|(?:(?:\|\s*)?(?::\s*)?-[-\s]*(?::\s*)?(?:(?:\|(?::\s*)?-[-\s]*(?::\s*)?)+\|?|\|)))\n((?: {0,3}(?:(?:(?:\|\s*\S[^\|\n]*)+\|?)|(?:(?:\|\s*)?\S[^\|\n]*(?:(?:\|[^\|\n]+)+\|?|\|)))(?:\n|$))+)/,o=t.match(a);return o?(r=i(o[1]).split("|"),l=i(o[2]).split("|").map(function(t){var n=t.match(/\s*(:)?[-\s]+(:)?/);return n[1]&&n[2]?"center":n[1]?"left":n[2]?"right":null}),s=i(o[3]).split("\n").map(function(t){return i(t).split("|")}),e.call(this,r,l,s)):null},n}),Md.extend("syntax/list",function(t){function n(t){var n=t.getSyntax("block");n.extend(this),this.inline=t.getSyntax("inline")}function e(t,n){return t.replace(/(?: {0,3}\\t| {4})/,"\t").length}function i(t,n,l,s){function a(t,e){c=new r("li").appendChild(t),n=e}for(var o,u=t.length,h=new r("ul"),p=/^(\s*)([*+-]|\\d+\\.)[ \t]+(.*)/,d=null,c=null;n<u;n++){if(d=t[n].match(p),o=e(d[1]),o>l)i.call(this,t,n,l+1,a);else{if(o<l)break;c=this.inline.parse(d[3]),c=new r("li").appendChild(c)}h.appendChild(c)}s(h,n)}var r=t("node");return n.prototype.parse=function(t,n){var e,r=t.match(/^(?: *(?:[*+-]|\\d+\\.)[ \t]+.*(\n|$))+/),l=null;return r?(r[0].length<t.length&&n.push(t.substr(r[0].length)),l=r[0].split("\n"),""===l[l.length-1]&&l.pop(),i.call(this,l,0,0,function(t){e=t}),e):null},n}),Md.extend("syntax/code",function(t){function n(t){var n=t.getSyntax("block");n.extend(this)}var e=t("node"),i=t("text-node");return n.prototype.parse=function(t,n){var r=/^(?: {0,3}\t| {4})(.*)\n?/gm,l=/\s*\[(.*?)\](?:\s*\[(.*?)\])?[ \t]*/,s=[],a=null,o={language:null,lineNum:0},u=null,h=0;if(!/^(?: {0,3}\t| {4})(.*)/.test(t))return null;for(a=r.exec(t);a;a=r.exec(t))s.push(a[1]),h=r.lastIndex;return h<t.length&&n.push(t.substr(h)),a=l.exec(s[0]),a&&(s.shift(),a[1]&&(o.language=a[1]),a[2]&&(o.lineNum=a[2])),u=new e("pre").appendChild(new e("code").appendChild(new i(s.join("\n"))))},n}),Md.extend("syntax/horiz-line",function(t){function n(t){var n=t.getSyntax("block");n.extend(this)}var e=t("node"),i={dash:"dash",underline:"underline",asterisk:"asterisk"};return n.prototype.parse=function(t,n){var r=/^(?:([\s\S]*?)\n)?[ \t]*(([-_*])(?:[ \t]*\3){2,})[ \t]*(?:\n([\s\S]*))?$/,l=t.match(r),s=null;if(!l)return null;if(l[1])return n.push(l[1]),n.push(l[2]),l[4]&&n.push(l[4]),null;switch(s=new e("hr"),l[3]){case"-":s.attr("class",i.dash);break;case"_":s.attr("class",i.underline);break;case"*":s.attr("class",i.asteris)}return l[4]&&n.push(l[4]),s},n}),Md.extend("syntax/paragraph",function(t){function n(t){block=t.getSyntax("block"),block.extend(this),this.inline=t.getSyntax("inline")}var e=t("node");return n.prototype.parse=function(t){var n=new e("p");return n.appendChild(this.inline.parse(t)),n},n}),Md.extend("syntax/image",function(t){function n(t){var n=t.getSyntax("inline");n.extend(this)}var e=t("node");return n.prototype.parse=function(t,n){var i=/!\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,r=t.match(i),l=null;return r?r.index?(n.push(t.substring(0,r.index)),n.push(r[0]),n.push(t.substr(r.index+r[0].length)),null):(r[0].length<t.length&&n.push(t.substr(r[0].length)),l=new e("img"),l.attr("alt",r[1]).attr("src",r[2]),r[4]&&l.attr("title","reg[4]"),l):null},n}),Md.extend("syntax/hyperlink",function(t){function n(t){var n=t.getSyntax("inline");n.extend(this)}var e=t("node"),i=t("text-node");return n.prototype.parse=function(t,n){var r=/\[\s*(\S*)\s*\]\(\s*(\S*)\s*(?:(["'])(\S*)\3)?\)/,l=t.match(r),s=null;return l?l.index?(n.push(t.substring(0,l.index)),n.push(l[0]),n.push(t.substr(l.index+l[0].length)),null):(l[0].length<t.length&&n.push(t.substr(l[0].length)),s=new e("a"),s.appendChild(new i(l[1])),s.attr("href",l[2]),l[4]&&s.attr("title",l[4]),s):null},n}),Md.extend("syntax/escaped",function(t){function n(t){var n=t.getSyntax("inline");n.extend(this)}var e=t("text-node");return n.prototype.parse=function(t,n){var i=/\\([\\`\*_{}\[\]()#\+.!\-])/,r=i.exec(t);return i.test(t)?0===r.index?(n.push(t.substr(r[0].length)),new e(r[1])):(n.push(t.substring(0,r.index)),n.push(t.substr(r.index)),null):null},n}),Md.extend("syntax/inline-plain-text",function(t){function n(t){var n=t.getSyntax("inline");n.extend(this)}var e=t("text-node");return n.prototype.parse=function(t){return new e(t)},n}),Md.extend("dialects/office",function(t){var n=t("dialect-builder");return(new n).setSyntax(["block","inline","combin-block","blockquote","atx-header","setext-header","table","list","code","horiz-line","paragraph","image","hyperlink","escaped","inline-plain-text"]).build()});