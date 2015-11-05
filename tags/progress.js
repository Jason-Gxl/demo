(function(win) {
	var doc = win.document;

	var docWatch = function() {
		if("complete"!=doc.readyState) return ;
		var _eles = getAllEls();
		for(var i=0,len=_eles.length; i<len; i++) {
			new buildProgress(_eles[i]);
		}
	};

	var getAllEls = function() {
		var allEls = doc.all || doc.getElementsByTagName("*") || [];
		if(allEls.length==0) return ;
		var eles = [];
		for(var i=0,len=allEls.length; i<len; i++) {
			_el = allEls[i];
			if(_el.nodeType==1 && "CODYY-PROGRESS"==_el.tagName) {
				eles.push(_el);
			}
		}
		return eles;
	};

	var buildProgress = function(el) {
		var self = this;
		self._el = el;
	};

	buildProgress.prototype = {
		constructor: this,
		
	};

	doc.onreadystatechange = docWatch;
})(window)