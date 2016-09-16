// @codekit-prepend "../../../src/dialects/min/before-min.js"

var dialect = new Dialect();
var textarea = document.getElementById("editor");
var article = document.getElementById("article");
var str = textarea.value;


function translate(str) {
    var node = dialect.parse(str);
    console.log(node);

    article.appendChild(node.toHtml());
}

textarea.onekeydown = function() {
    str = textarea.value;
    translate(str);
}

translate(str);
