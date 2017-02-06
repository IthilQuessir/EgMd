/*jshint esversion: 6 */
import templateString from "./template_string";

var increasingNum = 1;

function getId() {
    return increasingNum++;
}

function attrToString() {

    var str = "";

    for (var variable in this) {
        if (this.hasOwnProperty(variable) && variable !== "toString") {
            str += (" " + variable + "=" + "\"" + this[variable] + "\"");
        }
    }

    return str;
}

var templateLib = {
    h2: "<{tagName} {attr}><a name='{id}'>{children}</a></{tagName}>",
    default: "<{tagName} {attr}>{children}</{tagName}>"
};

class ElNode {

    constructor(tag_name, flag) {

        // ElNode唯一标识
        this.__id__ = getId();

        this.tagName = tag_name ? tag_name.toLowerCase() : "";
        this.flag = flag ? flag.toLowerCase() : this.tagName;
        this.__attr__ = {
            toString: attrToString
        };
        this.__children__ = [];

    }

    attr(name, val) {

        if (typeof val === "undefined") {
            return this.__attr__[name] || null;
        } else {
            this.__attr__[name] = val;
        }

        return this;
    }

    rmAttr(name) {
        delete this.__attr__[name];
        return this;
    }

    appendChild(child) {
        this.__children__.push(child);
        return this;
    }

    replaceChild(index, child) {
        var old = this.__children__[index];
        this.__children__.splice(index, 1, child);
        return old;
    }

    forEach(cb) {
        var children = this.__children__,
            i = 0,
            len = children.length;

        for (; i < len; i++) {
            cb(i, children[i]);
        }

    }

    getChild(i) {
        return this.__children__[i];
    }

    toElement(template) {

        var el = document.createElement("div"),
            df = document.createDocumentFragment(),
            children, i, len;

        el.innerHTML = this.toHTML(template);
        children = el.childNodes;

        while (children.length) {
            df.appendChild(children[0]);
        }　
        return df;

    }

    toHTML(template) {

        var childrenString = "",
            currentTemplate;

        template = template || {};

        for (let child of this.__children__) {
            childrenString += child.toHTML();
        }

        if (this.tagName) {

            currentTemplate = template[this.tagName] ||
                templateLib[this.tagName] ||
                templateLib.default;

            return templateString.render(currentTemplate, {

                id: this.__id__,
                tagName: this.tagName,

                attr: this.__attr__,
                children: childrenString,

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
    toStanderMd() {}

    /**
     * XXX  如果在解析过程中统计数据
     *      会造成多余的增删操作，而且每一个节点增删的操作都会从叶节点冒泡到根节点
     *      以便全部清除
     *
     *      其功能完整实现意义依赖渲染模板
     *      因此首先完成渲染模板
     *
     * @param {String} tagName 标签名
     */
    getNodes(tagName) {

        var children = this.__children__,
            nodes = [],
            rs, i, len, child, childChildren;

        if(typeof tagName !== "string") {
            throw new Error("[Md getNodes] param mast be string");
        }

        tagName = tagName.toLowerCase();

        for (i = 0, len = children.length; i < len; i++) {

            child = children[i];

            if (child.tagName === tagName) {
                nodes.push(child);
            }

            if (child.getNodes) {
                childChildren = child.getNodes(tagName);
            }

            if (childChildren) {
                nodes.push(childChildren);
            }

            childChildren = null;
        }

        if (nodes.length === 0) {
            return null;


        } else if (nodes.length === 1) {
            return nodes[0];
        } else {
            rs = new ElNode();
            rs.__children__ = nodes;
            return rs;
        }

    }

}

module.exports = ElNode;
