var textarea = document.getElementById("editor");
var article = document.getElementById("article");
var str = textarea.value;


function translate(str) {
    article.innerHTML = "";
    article.appendChild(new Md(str));
}

textarea.addEventListener("input", function() {
    str = textarea.value;
    translate(str);
});

translate(str);
