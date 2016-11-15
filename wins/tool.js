(function(global) {
	"use strict"
	var turnBox = null;

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

			return _handles;
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
						_len = _fns.length,
						i = 0;
					while(i<_len) {
						_fns[i].call(self, obj.message||"");
						i++;
					}
				}
			}
		}
	};

	var Tool = function() {
		this.name = "Tool";
		turnBox = document.createElement("DIV");
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
			if(!item) return ;
			
			if(window.addEventListener) {
				item.addEventListener(type, fn, use||false);
			} else {
				item.attachEvent(type, fn);
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
		var self = this;
		var toString = Object.prototype.toString;
		
		var delEvent = function(item) {
			if(!item) return ;
			
			if(window.removeEventListener) {
				item.removeEventListener(type, fn, use||false);
			} else {
				item.detachEvent(type, fn);
			}
		}
		
		var getElement = function(selector) {
			if("string"!==typeof(selector)) return ;

			var _selector = selector.trim();

			if(_selector.startsWith("#")) {
				delEvent(global.document.getElementById(_selector.substring(1, _selector.length)));
			} else if(_selector.startsWith(".")) {
				var eles = global.document.getElementsByClassName(_selector.substring(1, _selector.length));
				var l = eles.length;

				while(l--) {
					delEvent(eles[l]);
				}
			} else {
				var eles = global.document.getElementsByTagName(_selector);
				var l = eles.length;

				while(l--) {
					delEvent(eles[l]);
				}
			}

		}

		if("[object Array]"===toString.call(target)) {
			var len = target.len;

			while(len--) {
				var _target = target[len];

				if(self.isDom(_target)) {
					delEvent(_target);
				} else {
					getElement(_target);
				}
			}
		} else {
			if(self.isDom(target)) {
				delEvent(target);
			} else {
				getElement(target);
			}
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
			return unescape(arr[2]);
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
		if(!ele) return ;
		var classes = ele.className.split(/\s+/);
		if(-1!==classes.indexOf(classname)) return ;
		ele.className = ele.className.trim() + " " + classname;
		return ele;
	};

	Tool.prototype.removeClass = function(ele, classname) {
		if(!ele) return ;
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
	
	Tool.prototype.turnStringToDom = function(str) {
		turnBox.innerHTML = str;
		var child = turnBox.children[0].cloneNode(true);
		turnBox.innerHTML = "";
		return child;
	};
	
	Tool.prototype.buildFlash = function(wrap, url, config) {
		var config = config || {},
			id = (config.id) ? config.id : "swf"+this.random(),
			wrapBox = wrap || document.body,
			f = (url.indexOf("?") > 0 ? url : url+"?").split("?"),
			u = [f.shift(), f.join("?")],
			wh = config.wh ? [config.wh[0]+"px", config.wh[1]+"px"] : ["100%", "100%"],
			wmode = config.wmode || "transparent";
	
		var e = '<embed src="' + u[0] + '" name="' + id + '" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"  type="application/x-shockwave-flash" allownetworking="all" allowfullscreen="true" allowFullscreenInteractive="true" allowscriptaccess="always" FlashVars="' + u[1] + '" wmode="' + wmode + '" width="' + wh[0] + '" height="' + wh[1] + '"></embed>';
			e = '<object class="FlashPlayer" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,0,0,0" width="' + wh[0] + '" height="' + wh[1] + '" id="' + id + '"><param name="wmode" value="' + wmode + '" ><param value="true" name="allowFullScreen"><param value="all" name="AllowNetworking"><param value="always" name="allowScriptAccess"><param name="AllowNetworking" value="all"><param value="true" name="allowFullscreenInteractive"><param name="movie" value="' + u[0] + '" ><param name="FlashVars" value="' + u[1] + '">' + e + '</object>';
		
		if (config.returnType == "string") {
			return e;
		}
	
		wrapBox.insertAdjacentHTML('afterBegin', e);
		return document[id];
	};
	
	Tool.prototype.numberToTime = function(num) {
		var format = "HH:mm:ss",
			num = num/1000;
		var hour = Math.floor(num/3600);
		var minute = Math.floor((num/60)%60);
		var second = Math.floor(num%3600);
		return format.replace("HH", hour>=10?hour:"0"+hour).replace("mm", minute>=10?minute:"0"+minute).replace("ss", second>=10?second:"0"+second);
	};
	
	Tool.prototype.xml2obj = function(xml, root) {
		var xml = xml.replace(/[<>/']/g, ""),
			keyValueStrs = xml.split(/\s+/),
			json = {},
			len = keyValueStrs.length,
			i = 0;
		
		json[root] = {};
		
		do {
			var keyValueStr = keyValueStrs[i];
			if(keyValueStr && root!==keyValueStr) {
				var _json = keyValueStr.split("=");
				json[root][_json[0]] = _json[1];
			}
		} while (++i<len)
			
		return json;
	};
	
	Tool.prototype.serialize = function(formName) {
		var form = document.forms[formName] || document.getElementsByName(formName)[0],
			names = [],
			elements = form.elements,
			i = 0,
			len = elements.length,
			obj = {};
		
		if(0>=len) return obj;
		
		do {
			var ele = elements[i],
				name = ele.name;
			
			if(-1===names.indexOf(name)) {
				names.push(name);
			}
		} while(++i<len)
			
		len = names.length;
		
		if(0>=len) return obj;
		
		i=0;
		do {
			obj[names[i]] = form[names[i]].value;
		} while(++i<len)
			
		return obj;
	};
	
	Tool.prototype.copy = function(boxId, btnId, fn) {
		var self = this;
		
		this.addEvent("#"+btnId, "click", function() {
			var box = document.getElementById(boxId);
			box.select();
			var text = document.execCommand("Copy");
			box.selectionEnd = 0;
			
			if(fn) {
				fn.call(self, text);
			}
		});
	};

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["tool"] = new Tool();

	String.prototype.trim = String.prototype.trim || function() {
		this.replace(/(^\s*)|(\s*$)/g, "");
	}
	
	Date.prototype.format = function (fmt) {
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	
	if (!global.$jsonp) {
		//jsonp的具体实现
		var sendScriptRequest = function(url, id) {
				//将请求地址以script标签形式插入到页面。（注定是GET请求）
				var head = document.getElementsByTagName("head")[0];
				var script = document.createElement("script");
				script.id = id;
				script.src = url;
				script.charset = 'utf-8';
				head.appendChild(script);
			},
			buildTempFunction = function(callback) {
				//创建一个全局方法，并将方法名当做请求地址的一个参数
				var callName = "jsonp" + Math.floor(Math.random()*100000000);
				window[callName] = function(data) {
					callback(data);
					window[callName] = undefined;
					try {
						delete window[callName];
						var jsNode = document.getElementById(callName);
					} catch (e) {}
				};
				return callName;
			};
		global.$jsonp = function(url, data, callback) {
			//生成GET请求地址
			if (!url) return false;
			callback = buildTempFunction(callback);
			url += (url.indexOf("?") > 0) ? "" : "?";
			for (var i in data)
				url += "&" + i + "=" + data[i];
			url += "&callback=" + callback;
			sendScriptRequest(url, callback);
		};
	};
})(window)