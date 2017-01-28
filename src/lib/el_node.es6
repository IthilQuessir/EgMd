/*jshint esversion: 6 */
import Attr from "./attr";

class ElNode {
    constructor(tag_name, flag) {
        this.tagName = tag_name || "";
        this.flag = flag || this.tagName;
        this.__attr__ = new Attr();
        this.children = [];
    }

    attr(name, val) {
        if (typeof val === "undefined") {
            return this.__attr__.get(name);
        } else {
            this.__attr__.add(name, val);
        }

        return this;
    }

    rmAttr(name) {
        this.__attr__.rm(name);
        return this;
    }

    appendChild(child) {
        this.children.push(child);
        return this;
    }

    replaceChild(index, child) {
        var old = this.children[index];
        this.children.splice(index, 1, child);
        return old;
    }

    toElement() {

        var el = null,
            name = this.tagName;

        if (name === "") {
            el = document.createDocumentFragment();
        } else {
            el = document.createElement(name);

            this.__attr__.forEach(function(key, value) {
                el.setAttribute(key, value);
            });
        }

        for (let child of this.children) {
            el.appendChild(child.toElement());
        }

        return el;

    }

    toHTML() {
        var str = "",
            name = this.tagName;

        for (let child of this.children) {
            str += child.toHTML();
        }

        if (name !== "") {
            str = "<" + name + ">" + str +"</" + name + ">";
        }

        return str;

    }

    forEach(cb) {
        var children = this.children,
            i = 0,
            len = children.length;

        for (; i < len; i++) {
            cb(i, children[i]);
        }

    }

    getChild(i) {
        return this.children[i];
    }
}

module.exports = ElNode;
