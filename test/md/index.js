var str = document.getElementById("editor").value;
var md = new Md();
var container = document.getElementById("article");

var dateStar = new Date().getTime();
var tree = md.parse(str);
// console.log("Tree", tree);
console.log("HTML", tree.toHTML());
var dateEnd = new Date().getTime();
container.append(tree.toElement());
console.log("TIME:" + dateStar + ";" +  dateEnd + ";" + (dateEnd - dateStar));
