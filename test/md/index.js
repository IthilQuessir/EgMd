// @codekit-prepend "../../src/md/min/before-min.js"

var textarea = document.getElementById("editor");
var article = document.getElementById("article");
var str = textarea.value;


function translate(str) {
    article.appendChild(new Md(str));
}

textarea.onekeydown = function() {
    str = textarea.value;
    translate(str);
};

translate(str);
