/*jshint esversion: 6 */

class Attr {

    constructor() {
        this.list = {};
    }

    add(name, val) {
        this.list[name] = val;
    }

    rm(name) {
        delete this.list[name];
        return this;
    }

    get(name) {
        return this.list[name] || null;
    }

    getAll() {
        return this.list;
    }

    forEach(cb) {
        var list = this.list;

        for (let key in list) {
            if (list.hasOwnProperty(key)) {
                cb.call(this, key, list[key]);
            }
        }
    }

    clone() {
        // TODO 深复制代码
    }

    toString() {

    }


}

module.exports = Attr;
