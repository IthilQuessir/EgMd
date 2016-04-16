
(function (global, undefined) {

	var res = document.getElementById("res");
	
	var md = document.getElementById("md").value;
	
	var analysis = new Markdown({is_debug: true});
	
	res.innerHTML = analysis.toHTML(md);
} (this));

