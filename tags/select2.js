(function(win) {
	var doc = win.document;
	var allEl = [];
	var objs = [];

	// document监控器
	var docWatch = function() {
		if("complete"!=doc.readyState) return ;
		getAllEl();
		for(var i=0, len=allEl.length; i<len; i++) {
			CE(allEl[i]);
		}
	};

	var getAllEl = function() {
		var _els = doc.all || doc.getElementsByTagName("*");
		for(var i=0, len=_els.length; i<len; i++) {
			if(_els[i].nodeType==1) {
				allEl.push(_els[i]);
			}
		}
	};

	var CE = function(el) {
		if(!el) return ;
		switch (el.tagName) {
			case "CODYY-SELECT":
				var obj = new CSelect(el);
				objs.push(obj);
		}
	};

	var CSelect = function(el) {
		var self = this;
		self.element = el;
		var opts = {};
		opts.dataList = eval(el.getAttribute("list") || []);
		el.removeAttribute("list");
		opts.name = el.getAttribute("name");
		el.removeAttribute("name");
		opts.classname = el.className;
		el.removeAttribute("className");
		opts._id = el.id;
		el.removeAttribute("id");
		opts.showParam = el.getAttribute("showParam");
		el.removeAttribute("showParam");
		opts.val = el.getAttribute("val");
		el.removeAttribute("val");
		opts.placeholder = el.getAttribute("placeholder");
		el.removeAttribute("placeholder");
		opts._value = el.getAttribute("value") || "";
		el.removeAttribute("value");
		self.opts = opts;
		_CSelect(self);
	};

	CSelect.prototype = {
		"constructor": this,
		"setOptions": function(dataList, type) {
			if(!dataList) return;
			var self = this;
			var select = self.select;
			var opts = self.opts;
			if("NEW"==type) select.innerHTML = "";
			var option = doc.createElement("OPTION");
			option.setAttribute("value", "");
			option.appendChild(doc.createTextNode(opts.placeholder || "请选择"));
			select.appendChild(option);
			for(var i=0,len=dataList.length; i<len; i++) {
				var option = doc.createElement("OPTION");
				option.setAttribute("value", dataList[i][opts.val]);
				option.appendChild(doc.createTextNode(dataList[i][opts.showParam]));
				select.appendChild(option);
			}
		}
	};

	var _CSelect = function(obj) {
		var el = obj.element;
		var opts = obj.opts;
		var wrap = doc.createElement("DIV");
		wrap.className = "codyy_select_wrap";
		el.appendChild(wrap);
		var input = doc.createElement("INPUT");
		input.className = "cur_selected"
		if(opts._value.replace(/(^\s*)|(\s*$)/g, "")) {
			for(var i=0,len=opts.dataList.length; i<len; i++) {
				if(opts.dataList[i][opts.val]==opts._value) {
					input.value = opts.dataList[i][opts.showParam];
					break;
				}
			}
		} else {
			input.value = opts.placeholder.replace(/(^\s*)|(\s*$)/g, "") || "请选择";
		}
		wrap.appendChild(input);
		var select = doc.createElement("select");
		select.id = opts._id;
		select.className = "codyy_select";
		select.setAttribute("name", opts.name);
		if(opts._value) select.value = opts._value;
		select.onchange = function() {
			if(!this.value) {
				input.value = opts.placeholder.replace(/(^\s*)|(\s*$)/g, "") || "请选择";
				return ;
			}
			for(var i=0,len=opts.dataList.length; i<len; i++) {
				if(opts.dataList[i][opts.val]==this.value) {
					input.value = opts.dataList[i][opts.showParam];
					break;
				}
			}
		};
		wrap.appendChild(select);
		obj.select = select;
		obj.setOptions(opts.dataList, "NEW");
	};

	doc.onreadystatechange = docWatch;
})(window)