;(function() {
	"use strict";
	var win = window,
		doc = document,
		toString = Object.prototype.toString;
	
	var ele = {
		addEvent: win.addEventListener?function(target, type, fn, use) {
			target.addEventListener(type, fn, use||false);
		}:function(target, type, fn) {
			target.attachEvent("on"+type, fn);
		},
		addClass: function(el, classname) {
			el.className = el.className.replace(/(^\s*)|(\s*$)/g, "") + " " + classname;
		},
		removeClass: function(el, classname) {
			el.className = el.className.replace(classname, "").replace(/(^\s*)|(\s*$)/g, "");
		},
		replaceClass: function(els, oldClassname, newClassname) {
			var self = this;
			if(els.map) {
				els.map(function(el) {
					self.removeClass(el, oldClassname);
					self.addClass(el, newClassname);
				});
			} else {
				var i = 0, len = els.length;
				while(i<len) {
					var el = els[i];
					self.removeClass(el, oldClassname);
					self.addClass(el, newClassname);
					i++;
				}
			}
		},
		siblings: function(el) {
			return [].concat.apply(el.previousElementSibling, el.nextElementSibling);
		}
	};
	
	var data = {
		group: function(data, count) {
			var i = 0,
				len = data.length,
				groupArr = [],
				_group = [];

			if(len<=i) return groupArr;

			do {
				_group.push(data[i]);

				if(0===(i+1)%count) {
					groupArr.push([].concat.apply([], _group));
					_group = [];
				} else {
					if(1+i===len) {
						groupArr.push([].concat.apply([], _group));
					}
				}
			} while(++i<len);
			return groupArr;
		},
		load: function(url, params, fn) {
			$.post(url, params, function(result) {
				fn.call(null, result);
			});
		}
	};
	
	function PageSplit() {
		this.name = "PageSplit";
		this.init = function() {};
	}
	
	PageSplit.prototype = {
		pre: function() {
			var self = this,
				opts = self.option,
				itemList = self.items,
				oldSelectedItem = self.selected,
				newSelectedItem = itemList[itemList.indexOf(oldSelectedItem)-1],
				newSelectedItem = (newSelectedItem || itemList[opts.itemCount-1]),
				pageNumber = opts.pageNumber-1>=1?opts.pageNumber-1:opts.totalPage;
			self.go(pageNumber);
			ele.removeClass(oldSelectedItem, "selected");
			ele.addClass(newSelectedItem, "selected");
			self.selected = newSelectedItem;
		},
		next: function() {
			var self = this,
				opts = self.option,
				itemList = self.items,
				oldSelectedItem = self.selected,
				newSelectedItem = itemList[itemList.indexOf(oldSelectedItem)+1],
				newSelectedItem = (newSelectedItem || itemList[0]),
				pageNumber = opts.pageNumber+1>opts.totalPage?1:opts.pageNumber+1;
			self.go(pageNumber);
			ele.removeClass(oldSelectedItem, "selected");
			ele.addClass(newSelectedItem, "selected");
			self.selected = newSelectedItem;
		},
		go: function(_pageNumber, fn) {
			var self = this,
				items = self.items,
				opts = self.option,
				params = opts.searchParams,
				pageNumber = _pageNumber || opts.pageNumber;
			if(0>pageNumber) return;
			if(opts.totalPage && opts.totalPage<pageNumber) return ;
			if(opts.data) {
				var d = opts.data[pageNumber-1];
				fn && fn.call(null, d);
				opts.success && opts.success.call(null, d);
				opts.pageNumber = pageNumber;
			} else {
				params.pageNumber = pageNumber;
				opts.searchParams.start = (pageNumber-1)*opts.count;
				opts.searchParams.end = pageNumber*opts.count-1;
				data.load(opts.url, params, function(result) {
					result && (opts.totalPage = Math.ceil(result.total/opts.count));
					fn && fn.call(null, result);
					!fn && (opts.success && opts.success.call(null, result));
					opts.pageNumber = pageNumber;
				});
			}

			self.render && self.render();
		},
		refresh: function() {
			this.go(this.option.pageNumber);
		},
		setParams: function(params, type) {
			var self = this, opts = self.option;
			if(opts.data) return;
			if("append"===type) {
				for(var key in params) {
					opts.searchParams[key] = params[key];
				}
			} else {
				opts.searchParams = params;
			}
			if(opts.auto) {
				opts.pageNumber = 1;
				opts.searchParams.start = (opts.pageNumber-1)*opts.count;
				opts.searchParams.end = opts.pageNumber*opts.count-1;
				data.load(opts.searchParams, function() {
					opts.success && opts.success.call(null, [].splice.call(arguments, 0)[0]);
				});
			}
		},
		getPageNumber: function() {
			var self = this, opts = self.option;
			return opts.pageNumber;
		},
		getCount: function() {
			var self = this, opts = self.option;
			return opts.count;
		}
	};
	
	function PageSplitDot(opts) {
		this.name = "PageSplitDot";
		this.option = opts;
		this.items = [];
		
		this.init = function() {
			opts.pageNumber = 1;
			opts.wrap && (opts.wrap.innerHTML = "");
			var i = 0, self = this, ul = doc.createElement("UL");
			
			self.go(1, function(_data) {
				var totalPage = opts.totalPage;
				opts.itemCount = opts.itemCount<totalPage?opts.itemCount:totalPage;
				
				do {
					var li = doc.createElement("LI"), span = doc.createElement("SPAN");
					li.appendChild(span);
					ul.appendChild(li);
					ele.addClass(li, "split-item-wrap");
					ele.addClass(span, "split-item"+(0===i?" selected":""));
					self.items.push(span);
					0===i && (self.selected = span);
					
					ele.addEvent(span, "click", function() {
						var oldSelectedItem = self.selected, itemList = self.items;
						ele.removeClass(oldSelectedItem, "selected");
						ele.addClass(this, "selected");
						opts.pageNumber = opts.pageNumber+(itemList.indexOf(this)-itemList.indexOf(oldSelectedItem));
						self.go(opts.pageNumber);				
						self.selected = this;
					});
				} while(++i<opts.itemCount);
					
				ele.addClass(ul, "split-items-wrap");
				opts.wrap && opts.wrap.appendChild(ul);
			});
		};
		
		this.init();
	}
	
	PageSplitDot.prototype = new PageSplit();

	function PageSplitNumber(opts) {
		this.name = "PageSplitNumber";
		this.option = opts;
		this.items = [];

		this.render = function() {
			var totalPage = opts.totalPage,
				oldSelectedItem = this.selected, 
				itemList = this.items, 
				len = itemList.length;
			oldSelectedItem && ele.removeClass(oldSelectedItem, "selected");

			if(8===len) {
				if(5>opts.pageNumber) {
					itemList[1].innerHTML = 2;
					itemList[len-2].innerHTML = "...";
				} else {
					itemList[1].innerHTML = "...";
					itemList[len-2].innerHTML = len-1;
				}
			}

			if(9<=len) {
				var num = opts.pageNumber- 3, num2 = opts.pageNumber+ 3, j=1;

				switch(true) {
				case 1>=num:
					do{
						itemList[j].innerHTML = j+1;
						if(j===len-2) itemList[j].innerHTML = "...";
					}while(++j<len-1);
					break;
				case num>1 && num2<totalPage:
					do {
						if(1===j || j===len-2) {
							itemList[j].innerHTML = "...";
						} else {
							itemList[j].innerHTML = opts.pageNumber - (3-(j-1));
						}
					}while(++j<len-1);
					break;
				default:
					do {
						if(1===j) {
							itemList[j].innerHTML = "...";
						} else {
							itemList[9-j].innerHTML = totalPage-(j-1);
						}
					}while(++j<len-1);
				}
			}

			var i = 0;
			do {
				if(opts.pageNumber===+itemList[i].innerHTML) {
					ele.addClass(itemList[i], "selected");
					this.selected = itemList[i];
				}
			} while(++i<len)
		};

		this.init = function() {
			opts.pageNumber = 1;
			opts.wrap && (opts.wrap.innerHTML = "");
			var i = 0, self = this, ul = doc.createElement("UL");

			self.go(1, function(_data) {
				var totalPage = opts.totalPage;
				opts.itemCount = 9>=totalPage?totalPage:9;

				do {
					var li = doc.createElement("LI"), span = doc.createElement("SPAN");
					li.appendChild(span);
					ul.appendChild(li);
					ele.addClass(li, "split-item-wrap");
					ele.addClass(span, "split-item");
					self.items.push(span);

					if(0===i) {
						span.innerHTML = 1;
					} else if(i+1===opts.itemCount) {
						span.innerHTML=totalPage;
					} else {
						span.innerHTML=1+i;
					}

					ele.addEvent(span, "click", function() {
						if(isNaN(this.innerHTML)) return ;
						opts.pageNumber = +this.innerHTML;
						self.go(opts.pageNumber);
					});
				} while(++i<opts.itemCount);

				var li = doc.createElement("LI"), span = doc.createElement("SPAN");
				li.appendChild(span);
				ul.appendChild(li);
				ele.addClass(li, "split-item-wrap");
				ele.addClass(span, "page-number-wrap");
				span.innerHTML = "去第<input type='text' class='page-number-input'/>页";

				ele.addEvent(span.getElementsByClassName("page-number-input")[0], "keypress", function() {
					var e = arguments[0] || win.event;
					if(13===e.which) {
						if(isNaN(this.value) || !this.value || +this.value===opts.pageNumber) return ;
						this.value = this.value<0?1:(this.value>totalPage?totalPage:this.value);
						self.go(+this.value);
					}
				});

				ele.addClass(ul, "split-items-wrap");
				opts.wrap && opts.wrap.appendChild(ul);
			});
		};

		this.init();
	}

	PageSplitNumber.prototype = new PageSplit();
	
	win.pageSplit = {
		init: function(opts) {
			if(!opts || (!opts.url && (!opts.data || 0===opts.data.length))) return ;
			if(opts.data && "[object Array]"!==toString.call(opts.data)) return ;
			if(0>=data.length) return;
			opts.count = opts.count || 20;
			opts.itemCount = opts.itemCount || 5;
			var searchParams = opts.searchParams || {};
			opts.searchParams = searchParams;
			searchParams.count = opts.count;

			if(opts.data) {
				opts.data = data.group(opts.data, opts.count);
				opts.totalPage = opts.data.length;
			}
			return "number"===opts.itemType?new PageSplitNumber(opts):new PageSplitDot(opts);
		}
	};
	
	/*var params = {
		wrap: document.getElementXXX(""),
		data: [],
		url: "",
		count: 10,
		itemCount: 5,
		searchParams: {}
	};*/
}(undefined));