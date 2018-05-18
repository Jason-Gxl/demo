;(function(undefined) {
	"use strict";

	var selectSkinNode = null,
		selectTempleteNode = null,
		skinListNode = document.getElementsByClassName("skin-list")[0],
		templeteListNode = document.getElementsByClassName("templete-list")[0];

	skinListNode.addEventListener("click", function(e) {
		var ev = e || window.event, target = ev.target || ev.srcElement;

		ev.preventDefault();
		ev.stopPropagation();

		if(!/\bskin-choose-box\b/.test(target.className)) return ;
		selectSkinNode && selectSkinNode.classList.add("hide");
		target.classList.remove("hide");
		selectSkinNode = target;
		document.body.className = (document.body.className.replace(/\bbkg\d\b\s*/, "") + " " + selectSkinNode.getAttribute("bkg")).replace(/^\s*|\s*$/g, "");
	});

	templeteListNode.addEventListener("click", function(e) {
		var ev = e || window.event, target = ev.target || ev.srcElement;

		ev.preventDefault();
		ev.stopPropagation();

		if(!/\btemplete-choose-box\b/.test(target.className)) return ;
		selectTempleteNode && selectTempleteNode.classList.add("hide");
		target.classList.remove("hide");
		selectTempleteNode = target;
		document.body.className = (document.body.className.replace(/\btpl\d\b\s*/, "") + " " + selectTempleteNode.getAttribute("tpl")).replace(/^\s*|\s*$/g, "");
	});

	document.getElementById("edit").addEventListener("click", function() {
		document.body.classList.add("show-edit-pad");
	});

	selectTempleteNode = templeteListNode.getElementsByClassName("templete-choose-box")[0];
	selectTempleteNode.classList.remove("hide");
	document.body.className = (document.body.className.replace(/\btpl\d\b\s*/, "") + " " + selectTempleteNode.getAttribute("tpl")).replace(/^\s*|\s*$/g, "");
}());