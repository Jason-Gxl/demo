(function(fn) {
	"use strict"
	var win = window,
		doc = document,
		msList = [],
		msMap = {},
		pName = "multi-",
		number = 0,
		duang = fn.call(null);
	
	function MultiSelect() {
		this.name = "MultiSelect";
	}
	
	MultiSelect.prototype = {
		getDoms: function() {},
		getResult: function() {}
	};
	
	function multiSelect() {
		return {
			init: function(opts) {
				if(!opts.wrap) return ;
				opts.name = opts.name || (pName+number++);
				var _ms = new _MultiSelect(opts);
				msList.push(_ms);
				msMap[opts.name] = _ms;
				return _ms;
			},
			getByIndex: function(index) {
				if(void 0===index) return ;
				return msList[index];
			},
			getByName: function(name) {
				if(void 0===name) return ;
				return msMap[name];
			}
		}
	}
	
	duang?duang.module("ex-component", []).directive("multiSelect", [], multiSelect):win.multiSelect=multiSelect.call(null);
}(function() {
	return window.duang||null;
}, undefined))