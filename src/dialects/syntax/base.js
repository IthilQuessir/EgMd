// @codekit-prepend "./blocks.js"
// @codekit-prepend "./block.js"
// @codekit-prepend "./atxHeader.js"
// @codekit-prepend "./paragraph.js"

function Dialect() {}

/**
 * 解析Block
 * @param   {Block_Object} block
 * @returns {Node_Object}  解析成功返回一个Node对象，否则返回 null
 */
Dialect.prototype.parse = function(str) {

    var blocks = new Blocks();

    return blocks.parse(strInit(str));
};

/**
 * 对输入的字符串进行格式化，统一换行符
 * @param {String} str 被格式化的字符串
 * @return {String}
 */
function strInit(str) {

    return str.replace(/(\r\n|\n|\r)/g, "\n"); // 把不同的换行符都替换成\n

}

return Dialect;
