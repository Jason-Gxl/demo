(function(global) {
	"use strict"

	var CustomerEvent = function() {
		this.name = "CustomerEvent";
		this.handles = [];
	};

	CustomerEvent.prototype = {
		addCustEvent: function(type, fn) {
			var self = this,
				_handles = self.handles,
				len = _handles.length,
				count = 0;

			while(len--) {
				var _handle = _handles[len],
					_target = _handle.target;

				if(_target && _target==self) {
					_handle.events = _handle.events || {};
					_handle.events[type] = _handle.events[type] || [];
					_handle.events[type].push(fn);
					count++;
				}
			}
			
			if(0===count) {
				var _handle = {
						target: self,
						events: {}
				};
				_handle.events[type] = [];
				_handle.events[type].push(fn);
				_handles.push(_handle);
			}

			return events;
		},
		removeCustEvent: function(type) {
			var self = this,
				_handles = self.handles,
				len = _handles.length;

			while(len--) {
				var _handle = _handles[len],
					_target = _handle.target;

				if(_target && _target==self) {
					var _evs = _handle.events;

					for(var key in _evs) {
						if(key===type) {
							delete _evs[key];
						}
					}
				}
			}
		},
		fire: function(obj) {
			var self = this,
				_handles = self.handles,
				len = _handles.length;

			while(len--) {
				var _handle = _handles[len],
					_target = _handle.target;

				if(_target==self) {
					var _events = _handle.events,
						_fns = _events[obj.type],
						len = _fns.length,
						i = 0;
					while(i++<len) {
						_fns[i].call(self, obj.message||"");
					}
				}
			}
		}
	};

	var Tool = function() {
		this.name = "Tool";
	};
	
	Tool.CustomerEvent = CustomerEvent;

	Tool.prototype = new CustomerEvent();
	
	Tool.prototype.constructor = Tool;

	Tool.prototype.deepCopy = function(newObj, oldObj) {
		if(!newObj) return ;

		var toString = Object.prototype.toString,
			oldObj = oldObj || ("[object Object]"===toString.call(newObj)?{}:[]);

		if(toString.call(oldObj)!==toString.call(newObj)) {
			throw "类型不匹配！";
		}

		for(var key in newObj) {
			var val = newObj[key],
				type = toString.call(val);

			if("[object Object]"===type || "[object Array]"===type) {
				var _target = "[object Object]"===type?{}:[];
				oldObj[key] = _target;
				this.deepCopy(val, _target);
			} else {
				oldObj[key] = val;
			}

		}

		return oldObj;
	};

	Tool.prototype.random = function() {
		return Math.floor(Math.random()*100000000);
	};

	Tool.prototype.addEvent = function(target, type, fn, use) {
		var self = this;
		var toString = Object.prototype.toString;

		var addEvent = function(item) {
			if(window.addEventListener) {
				item.addEventListener(type, function() {
					var ev = arguments[0] || window.event;
					fn.call(this, ev);
				}, use||false);
			} else {
				item.attachEvent(type, function() {
					var ev = arguments[0] || window.event;
					fn.call(this, ev);
				});
			}
		}

		var getElement = function(selector) {
			if("string"!==typeof(selector)) return ;

			var _selector = selector.trim();

			if(_selector.startsWith("#")) {
				addEvent(global.document.getElementById(_selector.substring(1, _selector.length)));
			} else if(_selector.startsWith(".")) {
				var eles = global.document.getElementsByClassName(_selector.substring(1, _selector.length));
				var l = eles.length;

				while(l--) {
					addEvent(eles[l]);
				}
			} else {
				var eles = global.document.getElementsByTagName(_selector);
				var l = eles.length;

				while(l--) {
					addEvent(eles[l]);
				}
			}

		}

		if("[object Array]"===toString.call(target)) {
			var len = target.len;

			while(len--) {
				var _target = target[len];

				if(self.isDom(_target)) {
					addEvent(_target);
				} else {
					getElement(_target);
				}
			}
		} else {
			if(self.isDom(target)) {
				addEvent(target);
			} else {
				getElement(target);
			}
		}
	};

	Tool.prototype.delEvent = function(target, type, fn, use) {
		if(window.removeEventListener) {
			target.removeEventListener(type, fn, use||false);
		} else {
			target.detachEvent(type, fn);
		}
	};

	Tool.prototype.setCookie = function(name, val, time) {
		if(!name || !val || isNaN(time)) return;
		var time = time || 1,
			exp = new Date();
		exp.setTime(exp.getTime() + time);
		global.document.cookie = name + "=" + escape(val) + ";expires=" + exp.toGMTString();
	};

	Tool.prototype.getCookie = function(name) {
		if(!name) return;
		var arr = "",
			reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=global.document.cookie.match(reg)) {
			return unescape(arr);
		} else {
			return "";
		}
	};

	Tool.prototype.delCookie = function(name) {
		if(!name) return;
		var val = this.getCookie(name);
		if(!val) return ;
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		global.document.cookie = name + "=" + escape(val) + ";expires=" + exp.toGMTString();
	};

	Tool.prototype.isDom = ("object"===typeof(HTMLElement))?
							function(obj) {
								return obj instanceof HTMLElement;
							}:
							function (obj) {
								return obj && "object"===typeof(obj) && ((1===obj.nodeType && "string"===typeof(obj.nodeName)) || (9===obj.nodeType && "#document"===obj.nodeName) || "Window"===obj.constructor.name);
							}

	Tool.prototype.addClass = function(ele, classname) {
		ele.className = ele.className.trim() + " " + classname;
		return ele;
	};

	Tool.prototype.removeClass = function(ele, classname) {
		ele.className = ele.className.replace(classname, "").trim();
		return ele;
	};

	Tool.prototype.replaceClass = function(ele, oldClass, newClass) {
		this.removeClass(ele, oldClass);
		this.addClass(ele, newClass);
		return ele;
	};

	Tool.prototype.insertHTML = function(el, where, html) {
		if (!el) {
			return false;
		}
		
		where = where.toLowerCase();
		
		if (el.insertAdjacentHTML) {//IE
			el.insertAdjacentHTML(where, html);
		} else {
			var range = el.ownerDocument.createRange(),
				frag = null;
			
			switch (where) {
				case "beforebegin":
					range.setStartBefore(el);
					frag = range.createContextualFragment(html);
					el.parentNode.insertBefore(frag, el);
					return el.previousSibling;
				case "afterbegin":
					if (el.firstChild) {
						range.setStartBefore(el.firstChild);
						frag = range.createContextualFragment(html);
						el.insertBefore(frag, el.firstChild);
					} else {
						el.innerHTML = html;
					}
					return el.firstChild;
				case "beforeend":
					if (el.lastChild) {
						range.setStartAfter(el.lastChild);
						frag = range.createContextualFragment(html);
						el.appendChild(frag);
					} else {
						el.innerHTML = html;
					}
					return el.lastChild;
				case "afterend":
					range.setStartAfter(el);
					frag = range.createContextualFragment(html);
					el.parentNode.insertBefore(frag, el.nextSibling);
					return el.nextSibling;
			}
		}
	};

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["tool"] = new Tool();

	String.prototype.trim = String.prototype.trim || function() {
		this.replace(/(^\s*)|(\s*$)/g, "");
	}
})(window)