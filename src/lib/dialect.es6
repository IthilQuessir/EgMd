/*jshint esversion: 6 */
import ElNode from "./el_node";
import TxtNode from "./txt_node";


class Dialect {
    constructor(name, syntaxs) {
        if (syntaxs.length === 0) {
            throw new Error("[Dialect mast init with a syntaxs arr]");
        }

        this.name = name;
        this.syntaxs = syntaxs;
    }

    parse(str, op) {

        var node = new TxtNode(str, "blocks"),
            nodes = new ElNode();

        nodes.appendChild(node);

        this.parseNodes(nodes);

        return nodes;

    }

    parseNodes(nodes) {

        if (nodes instanceof TxtNode) {
            return;
        }

        var newNode = null;

        nodes.forEach(function(i, child) {

            newNode = this.parseNode(child);

            if (newNode) {
                this.parseNodes(newNode);
                nodes.replaceChild(i, newNode);
            } else {
                this.parseNodes(child);
            }

        }.bind(this));

        return nodes;
    }

    parseNode(node) {

        var newNode = node,
            rs = null;

        do {

            if (!newNode.flag) {
                break;
            }

            newNode = this.syntaxParse(newNode);

            if (newNode) {
                rs = newNode;
            }

        } while (newNode);

        return rs;

    }

    syntaxParse(node) {

        var pNode = null;

        for (let syntax of this.syntaxs) {

            pNode = syntax.parse(node);

            if (pNode) {
                return pNode;
            }

        }

        return null;
    }


}

module.exports = Dialect;
