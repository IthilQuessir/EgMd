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
