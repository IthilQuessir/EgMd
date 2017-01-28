/*jshint esversion: 6 */

class TxtNode {
    constructor(str, flag ) {

        if (typeof str !== "string") {
            console.error("[Md] TextNode only accpet string");
        }

        this.flag = flag || "";
        this.text = str;
    }

    toElement () {
        return document.createTextNode(this.text);
    }

    toHTML () {
        return this.text;
    }
}

module.exports = TxtNode;
