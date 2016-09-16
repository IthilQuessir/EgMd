// @codekit-prepend "../dialects/min/before-min.js"

function Md(str, options) {

    var dialect = new Dialect(),
        nodeTree = dialect.parse(str),
        domTree = nodeTree.toHtml();

    this.options = options;

    return domTree;

}


return Md;
