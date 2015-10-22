(function(win) {
	var doc = win.document;
	var allEl = [];

	var getAllEl = function() {
		var _els = doc.all || doc.getElementsByTagName("*");
		for(var i=0, len=_els.length; i<len; i++) {
			if(_els[i].nodeType==1) {
				allEl.push(_els[i]);
			}
		}
	};

	var docWatcher = function() {
		if("complete"!=doc.readyState) return ;
		getAllEl();
		for(var i=0, len=allEl.length; i<len; i++) {
			new CE(allEl[i]);
		}
	};

	var CE = function(el) {
		if("CODYY-SELECT"!=el.tagName) return ;
 		var el = el || doc;
		this.el = el;
		this.dataList = eval(el.getAttribute("list") || []);
		var _cr = this.getCR();
		createSelect(this);
		this.bind();
	};

	CE.prototype = {
		"constructor": this,
		"getCR": function() {
			var self = this;
			var cr = self.el.getBoundingClientRect();
			return cr;
		},
		"bind": function() {
			// var self = this;
			// setInterval(function() {
			// 	var datas = eval(self.el.getAttribute("list") || []);
			// 	if(datas!=self.dataList) {
			// 		self.dataList = datas;
			// 		createSelect(self);
			// 	}
			// }, 1000);
		}
	};

	var createSelect = function(obj) {
		var el = obj.el;
		dataList = obj.dataList;
		el.innerHTML = "";
		var wrap = document.createElement("DIV");
		wrap.style.position = "relative";
		var input = document.createElement("INPUT");
		var hide = document.createElement("hidden");
		input.type = "text";
		if(el.getAttribute("name")) hide.setAttribute("name", el.getAttribute("name"));
		input.className = el.className;
		var _i = document.createElement("I");
		var slWrap = document.createElement("DIV");
		var ul = document.createElement("UL");
		for(var i=0,len=dataList.length; i<len; i++) {
			var li = document.createElement("LI");
			li.appendChild(document.createTextNode(dataList[i][el.getAttribute("showParam")]));
			(function(d, input) {

			})(dataList[i], input);
			ul.appendChild(li);
		}
		wrap.appendChild(hide);
		wrap.appendChild(input);
		wrap.appendChild(_i);
		wrap.appendChild(slWrap);
		slWrap.appendChild(ul);
		el.appendChild(wrap);
	};

	var select = function(d, input) {

	};

	doc.onreadystatechange = docWatcher;
})(window)