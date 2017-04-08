;(function(fn) {
	"use strict";
	var uuid = 0,
		win = window,
		doc = document,
		tool = win.tool,
		duang = fn.call(this),
		ul = doc.createElement("UL"),
		li = doc.createElement("LI"),
		toString = Object.prototype.toString;

	function Tab(params) {
		var list = params.list,
			len = list.length,
			self = this,
			_ul = ul.cloneNode(true),
			selectedNode = null,
			showContainer = null,
			i = 0;

		var buildItem = function(d, index) {
			var _li = li.cloneNode(true),
				label = d.label,
				lis = [],
				container = doc.getElementById(d.linkId);

			_li.innerHTML = label;
			tool.addClass(_li, "tab-item tab-item-"+i);

			tool.addEvent(_li, "click", function() {
				if(d.url) {
					$.post(d.url, d.params||{}, function() {
						params.select && params.select.call(self, [].slice.call(arguments, 0)[0], d, index);
					});
				} else {
					params.select && params.select.call(self, d, index);
				}
				
				tool.removeClass(selectedNode, "selected");
				tool.addClass(this, "selected");
				tool.removeClass(container, "tab-hide");
				tool.addClass(showContainer, "tab-hide");
				showContainer = container;
				selectedNode = this;
			});

			if(void(0)!==params.selectedIndex) {
				if(Number(params.selectedIndex)===i) {
					tool.addClass(_li, "selected");
					tool.removeClass(container, "tab-hide");
					showContainer = container;
					selectedNode = _li;
				} else {
					tool.addClass(container, "tab-hide");
				}
			} else {
				if(0!==index) {
					tool.addClass(container, "tab-hide");
				}else {
					tool.addClass(_li, "selected");
					showContainer = container;
					selectedNode = _li;
				}
			}
			
			_ul.appendChild(_li);
			lis.push(_li);
		};

		while(i<len) {
			buildItem(list[i], i);
			i++;
		}

		tool.addClass(_ul, "tab tab-"+uuid++);
		params.wrap.appendChild(_ul);

		this.addItem = function() {
			var args = [].slice.call(arguments, 0),
				arg1 = args.shift();
			if("[object Object]"!==toString.call(arg1)) return ;
			buildItem(arg1, i);
			i++;
		};

		this.removeItemByIndex = function() {
			var args = [].slice.call(arguments, 0),
				arg = args.shift();
			if(isNaN(arg)) return ;
			var li = lis[Number(arg)];
			li && li.parentNode.removeChild(li);
			lis.splice(Number(arg), 1);
		};
	}

	var tab = {
		init: function(params) {
			if(!params || !params.wrap || !params.list || 0===params.list.length) return ;
			return new Tab(params);
		}
	};

	duang?duang.module("Component", ["Tool"]).directive("tab", ["tool"], function(_tool) {_tool && (tool=_tool); return tab}):win.tab=tab;
}(function() {
	return window.duang || null;
}, void(0)));