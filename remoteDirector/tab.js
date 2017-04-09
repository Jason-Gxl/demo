;(function(fn) {
	"use strict";
	var uuid = 0,
		win = window,
		doc = document,
		tool = win.tool,
		duang = fn.call(null),
		ul = doc.createElement("UL"),
		li = doc.createElement("LI"),
		toString = Object.prototype.toString;

	function Tab(params) {
		var self = this,
			i = 0,
			lis = [],
			list = params.list,
			selectedIndex = params.selectedIndex||0,
			_ul = ul.cloneNode(true),
			selectedNode = null,
			showContainer = null;

		var buildItem = function(d, index) {
			if("[object Object]"!==toString.call(d)) return false;
			var _li = li.cloneNode(true), label = d.label, container = doc.getElementById(d.linkId);
			_li.innerHTML = label;
			tool.addClass(_li, "tab-item");

			tool.addEvent(_li, "click", function() {
				if(selectedIndex===index) return ;
				tool.removeClass(selectedNode, "selected");
				tool.addClass(this, "selected");
				tool.removeClass(container, "tab-hide");
				tool.addClass(showContainer, "tab-hide");
				showContainer = container;
				selectedNode = this;
				selectedIndex = index;

				if(d.url) {
					$.post(d.url, d.params||{}, function() {
						params.select && params.select.call(self, [].slice.call(arguments, 0)[0], d, index);
					});
				} else {
					params.select && params.select.call(self, d, index);
				}
			});

			if(void(0)!==selectedIndex) {
				if(Number(selectedIndex)===index) {
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
			return true;
		};

		var len = list.length;
		while(i<len) {
			buildItem(list[i], i) && i++;
		}
		tool.addClass(_ul, "tab tab-"+uuid++);
		params.wrap.appendChild(_ul);

		this.addItems = function() {
			var args = [].slice.call(arguments, 0), arg1 = args.shift();
			if(!arg1) return ;
			if("[object Object]"===toString.call(arg1)) {
				buildItem(arg1, i) && i++;
				[].push.call(list, arg1);
			}

			if("[object Array]"===toString.call(arg1)) {
				var j = 0, l = arg1.length;
				while(j<l) {
					buildItem(arg1[j], i) && i++;
					"[object Object]"===toString.call(arg1) && [].push.call(list, arg1[j]);
				}
			}
		};

		this.removeItemsByIndex = function() {
			var args = [].slice.call(arguments, 0), arg1 = args.shift(), _selectedIndex = selectedIndex, removeList=[];
			if(!arg1) return ;

			if(!isNaN(arg1)) {
				var index = +arg1, li = lis[index];
				if(li) {
					removeList.push(li);
					_ul.removeChild(li);
					index===_selectedIndex && (_selectedIndex=index+1>0?index-1:index-1);
				}
			}

			if("[object Array]"===toString.call(arg1)) {
				var j = 0, l = arg1.length;

				while(j<l) {
					if(!isNaN(arg1[j])) {
						var index = +arg1[j], li = lis[index];
						if(li) {
							removeList.push(li);
							_ul.removeChild(li);
							index===_selectedIndex && (_selectedIndex=index+1>0?index-1:index-1);
						}
					}

					j++;
				}
			}

			_selectedIndex!==selectedIndex && lis[_selectedIndex].click();
			var j = 0, l = removeList.length;
			while(j<l) {
				var index = lis.indexOf(removeList[j]);
				lis.splice(index, 1);
				list.splice(index, 1);
				j++;
			}
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
