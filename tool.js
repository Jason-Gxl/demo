/**
 * 
 * 工具类
 * @Author Jason
 * @Date 2016-9-23
 * 
 */
(function(global, fn) {
	var turnBox = null,
		doc = document,
		toString = Object.prototype.toString,
		push = Array.prototype.push,
		slice = Array.prototype.slice,
		duang = fn.call(Object.create(null)),
		base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		hash = {  
	        'colgroup': 'table',  
	        'col': 'colgroup',  
	        'thead': 'table',  
	        'tfoot': 'table',  
	        'tbody': 'table',
	        'tr': 'tbody',  
	        'th': 'tr',  
	        'td': 'tr',  
	        'optgroup': 'select',  
	        'option': 'optgroup',  
	        'legend': 'fieldset'
	    },
	    base64DecodeChars = new Array(
    	    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    	    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    	    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    	    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    	    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    	    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    	    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    	    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

	//用户自定义事件构造器
	var CustomerEvent = function() {
		if(this instanceof CustomerEvent) {
			this.name = "CustomerEvent";
			this.handles = [];
		} else {
			return new CustomerEvent();
		}
	};

	CustomerEvent.prototype = {
		addCustEvent: function(type, fn) { //添加用户自定义事件，type：事件名称，fn：事件处理函数
			var self = this,
				count = 0,
				_handles = self.handles,
				len = _handles.length;

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
		removeCustEvent: function(type) { //删除自定义事件，type：事件名称
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
		fire: function(obj, fn) { //触发自定义事件，obj是对象类型参数，obj.type：事件名称，obj.message：传给处理函数的参数，此参数可以是任何类型的
			var self = this,
				_handles = self.handles,
				len = _handles.length;
			
			while(len--) {
				var _handle = _handles[len],
					_target = _handle.target;

				if(_target==self) {
					var _events = _handle.events,
						_fns = _events[obj.type];
					if(!_fns) return ;
					var	_len = _fns.length,
						i = 0;
					
					while(i<_len) {
						var _fn = _fns[i];
						
						if(fn) {
							if("[object Array]"===toString.call(fn)) {
								if(-1!==fn.indexOf(_fn)) {
									"function"===typeof _fn && _fn.call(self, obj.message||"");
								}
							} else {
								if("function"!==typeof fn) break ;
								fn===_fn && _fn.call(self, obj.message||"");
							}
						} else {
							"function"===typeof _fn && _fn.call(self, obj.message||"");
						}
						
						i++;
					}
				}
			}
		}
	};

	//工具类构造函数
	var Tool = function() {
		this.name = "Tool";
		turnBox = document.createElement("DIV");
	};
	
	Tool.CustomerEvent = CustomerEvent;
	Tool.prototype = new CustomerEvent();
	Tool.prototype.constructor = Tool;

	/**
	 * 深拷贝
	 * newObj 需要被拷贝的对象
	 * oldObj 接受被拷贝对象的对象
	 * return oldObj
	 */
	Tool.prototype.deepCopy = function(newObj, oldObj) {
		if(!newObj) return ;

		var oldObj = oldObj || ("[object Object]"===toString.call(newObj)?{}:[]);

		if(toString.call(oldObj)!==toString.call(newObj)) {
			throw "类型不匹配！";
		}
		
		if("[object Object]"===toString.call(newObj)) {
			for (var key in newObj) {
				var val = newObj[key],
					type = toString.call(val);
				
				if("[object Object]"===type || "[object Array]"===type) {
					var _target = "[object Object]"===type?{}:[];
					
					if("[object Array]"===toString.call(oldObj)) {
						oldObj.push(_target);
					} else {
						oldObj[key] = _target;
					}
					
					this.deepCopy(val, _target);
				} else {
					if("[object Array]"===toString.call(oldObj)) {
						oldObj.push(val);
					} else {
						oldObj[key] = val;
					}
				}
			}
		} else {
			var i = 0,
				len = newObj.length;
			
			if(len>i) {
				do {
					var val = newObj[i],
						type = toString.call(val);
					
					if("[object Object]"===type || "[object Array]"===type) {
						var _target = "[object Object]"===type?{}:[];
						
						if("[object Array]"===toString.call(oldObj)) {
							oldObj.push(_target);
						} else {
							oldObj[key] = _target;
						}
						
						this.deepCopy(val, _target);
					} else {
						if("[object Array]"===toString.call(oldObj)) {
							oldObj.push(val);
						} else {
							oldObj[key] = val;
						}
					}
				} while(++i<len)
			} else {
				if("[object Array]"===toString.call(oldObj)) {
					oldObj.push([]);
				} else {
					oldObj[key] = [];
				}
			}
		}
		
		return oldObj;
	};

	/**
	 * 生成任意长度的随机数
	 * num 随机数长度
	 * return 一个指定长度的随机数，如果没有指定长度，默认生成一个8位的随机数
	 */
	Tool.prototype.random = function(num) {
		var str = "",
			num = num || 8;
		for(; str.length<num; str+=(Math.random()+"").substr(2));
		return str.substr(0, num);
	};
	
	var addEvent = window.addEventListener?function(item, type, fn, use) {
		if(!item) return ;
		item.addEventListener(type, fn, use||false);
	}:function(item, type, fn) {
		if(!item) return ;
		item.attachEvent(type, fn);
	};
		
	/**
	 * 为元素添加事件
	 * target 需要添加事件的元素标识，可包含的类型（元素对象，id id要以#打头，class class要以.打头， 数组 数组中可包含元素对象 id class）
	 * type 事件名称
	 * fn 事件处理函数
	 * use 是否在扑捉时触发处理函数
	 */
	Tool.prototype.addEvent = function(target, type, fn, use, isDom) {
		var self = this;

		var getElement = function(selector) {
			if("string"!==typeof(selector)) return ;

			var _selector = selector.trim();

			if(_selector.startsWith("#")) {
				addEvent(doc.getElementById(_selector.substring(1, _selector.length)), type, fn, use);
			} else if(_selector.startsWith(".")) {
				var eles = doc.getElementsByClassName(_selector.substring(1, _selector.length));
				var l = eles.length;

				while(l--) {
					addEvent(eles[l], type, fn, use);
				}
			} else {
				var eles = doc.getElementsByTagName(_selector);
				var l = eles.length;

				while(l--) {
					addEvent(eles[l], type, fn, use);
				}
			}
		}

		if("[object Array]"===toString.call(target) || "[object HTMLCollection]"===toString.call(target)) {
			var len = target.length;

			while(len--) {
				var _target = target[len];

				if(self.isDom(_target)) {
					addEvent(_target, type, fn, use);
				} else {
					getElement(_target);
				}
			}
		} else {
			if(self.isDom(target)) {
				addEvent(target, type, fn, use);
			} else {
				getElement(target);
			}
		}
	};

	/**
	 * 删除元素事件
	 * 参数含义参考为元素添加事件
	 * 注意删除元素事件传入的参数要和为该元素添加事件传入的参数一至
	 */
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

	/**
	 * 向cookie里存储数据
	 * name cookie的名称
	 * val 存储的数据
	 * time 数据过期时间，单位：毫秒
	 */
	Tool.prototype.setCookie = function(name, val, time) {
		if(!name || !val || isNaN(time)) return;
		var time = time || 1,
			exp = new Date();
		exp.setTime(exp.getTime() + time);
		doc.cookie = name + "=" + escape(val) + ";expires=" + exp.toGMTString();
	};

	/**
	 * 从cookie中获取数据
	 * name cookie的名称
	 */
	Tool.prototype.getCookie = function(name) {
		if(!name) return;
		var arr = "",
			reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=doc.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return "";
		}
	};

	/**
	 * 删除cookie
	 * name cookie的名称
	 */
	Tool.prototype.delCookie = function(name) {
		if(!name) return;
		var val = this.getCookie(name);
		if(!val) return ;
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		doc.cookie = name + "=" + escape(val) + ";expires=" + exp.toGMTString();
	};

	/**
	 * 判断对象是否是dom元素
	 * obj 需要进行判断的对象
	 */
	Tool.prototype.isDom = ("object"===typeof(HTMLElement))?function(obj) {
		return obj instanceof HTMLElement;
	}:function (obj) {
		return obj && "object"===typeof(obj) && ((1===obj.nodeType && "string"===typeof(obj.nodeName)) || (9===obj.nodeType && "#document"===obj.nodeName) || "Window"===obj.constructor.name);
	};

	/**
	 * 给元素添加class
	 * ele 元素，可以是一个元素也可以是一个元素数组
	 * classname 要添加的class名称
	 */
	Tool.prototype.addClass = function(ele, classname) {
		if(!ele) return ;
		
		if("[object Array]"===toString.call(ele) || "[object HTMLCollection]"===toString.call(ele)) {
			var i = 0,
				len = ele.length;
			
			if(i>=len) return ;
			
			do {
				var el = ele[i];
				if(1===el.nodeType) {
					var classes = slice.call(el.classList, 0) || el.className.split(/\s+/);
					if(-1===classes.indexOf(classname)) {
						el.className = el.className.trim() + " " + classname;
					}
				}
			} while(++i<len)
		} else {
			if(1!==ele.nodeType) return;
			var classes = slice.call(ele.classList, 0) || ele.className.split(/\s+/);
			if(-1!==classes.indexOf(classname)) return ;
			ele.className = ele.className.trim() + " " + classname;
		}
		
		return ele;
	};

	/**
	 * 删除元素上的class
	 * 参数含义参考给元素添加class接口
	 */
	Tool.prototype.removeClass = function(ele, classname) {
		if(!ele) return ;
		
		if("[object Array]"===toString.call(ele) || "[object HTMLCollection]"===toString.call(ele)) {
			var i = 0,
				len = ele.length;
			
			if(i>=len) return;
			
			do {
				var el = ele[i];
				
				if(1===el.nodeType) {
					el.className = el.className.replace(classname, "").trim();
				}
			} while(++i<len)
		} else {
			if(1!==ele.nodeType) return;
			ele.className = ele.className.replace(classname, "").trim();
		}
		return ele;
	};

	/**
	 * 替换元素上的class
	 * oldClass 需要被替换的class
	 * newClass 新的class
	 */
	Tool.prototype.replaceClass = function(ele, oldClass, newClass) {
		this.removeClass(ele, oldClass);
		this.addClass(ele, newClass);
		return ele;
	};

	/**
	 * 在某元素的相对位位置插入新元素字符串
	 * el 新插入的元素相对的元素
	 * where (beforebegin, afterbegin, beforeend, afterend)
	 * html 新插入的元素字符串
	 */
	Tool.prototype.insertHTML = function(el, where, html) {
		if (!el) return false;
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
	
	//弃用，用createElement代替
	/*Tool.prototype.turnStringToDom = function(str) {
		turnBox.innerHTML = str;
		var child = turnBox.children[0].cloneNode(true);
		turnBox.innerHTML = "";
		return child;
	};*/
	
	/**
	 * 创建flash对象
	 * wrap 页面中的装载flash的容器对象
	 * url swf文件路径
	 * config 参数对象
	 * return flash对象
	 */
	Tool.prototype.buildFlash = function(wrap, url, config) {
		var config = config || {},
			id = (config.id) ? config.id : "swf"+this.random(),
			wrapBox = wrap || document.body,
			f = (url.indexOf("?") > 0 ? url : url+"?").split("?"),
			u = [f.shift(), f.join("?")],
			wh = config.wh ? [config.wh[0]+"px", config.wh[1]+"px"] : ["100%", "100%"],
			wmode = config.wmode || "transparent";
	
		var e = '<embed \
				src="'+ u[0] +'" \
				name="'+ id +'" \
				pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" \
				type="application/x-shockwave-flash" \
				allownetworking="all" \
				allowfullscreen="true" \
				allowFullscreenInteractive="true" \
				allowscriptaccess="always" \
				FlashVars="'+ u[1] +'" \
				wmode="'+ wmode +'" \
				width="'+ wh[0] +'" \
				height="'+ wh[1] +'">\
				</embed>';
		
		e = '<object class="FlashPlayer" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,0,0,0" width="'+ wh[0] +'" height="'+ wh[1] +'" id="'+ id +'">\
				<param name="wmode" value="'+ wmode +'">\
				<param name="allowFullScreen" value="true">\
				<param name="AllowNetworking" value="all">\
				<param name="allowScriptAccess" value="always">\
				<param name="allowFullscreenInteractive" value="true">\
				<param name="movie" value="'+ u[0] +'">\
				<param name="FlashVars" value="'+ u[1] +'">'+ e +'\
			</object>';
		
		if (config.returnType == "string") {
			return e;
		}
	
		wrapBox.insertAdjacentHTML('afterBegin', e);
		return document[id];
	};
	
	/**
	 * 将数字转换成时间字符串
	 * num 数字
	 */
	Tool.prototype.numberToTime = function(num) {
		var format = "HH:mm:ss",
			num = num/1000;
		var hour = Math.floor(num/3600);
		var minute = Math.floor(num%3600/60);
		var second = Math.floor(num%3600%60);
		return format.replace("HH", hour>=10?hour:"0"+hour).replace("mm", minute>=10?minute:"0"+minute).replace("ss", second>=10?second:"0"+second);
	};
	
	/**
	 * 将xml字符串转换成对象
	 * xml 需要转换的xml字符串
	 * root xml字符串的根元素名称
	 */
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
	
	/**
	 * 序列化form表单中的数据
	 * formName form表单名称
	 */
	Tool.prototype.serialize = function(formName) {
		var form = document.forms[formName] || document.getElementsByName(formName)[0],
			elements = form.elements,
			len = elements.length,
			names = [],
			obj = {},
			i = 0;
		
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
			var node = form[names[i]];
			
			if(!node.nodeType && node.length && 0<node.length && "checkbox"===node[0].type) {
				obj[names[i]] = "";
				
				for(var key in node) {
					if(node[key].checked) {
						if(obj[names[i]]) obj[names[i]] += ",";
						obj[names[i]] += node[key].value;
					}
				}
			} else {
				obj[names[i]] = node.value;
			}
		} while(++i<len)
			
		return obj;
	};
	
	/**
	 * 复制input元素中的数据
	 * boxId input元素的id
	 * btnId 复制按钮id
	 * 复制成功后的回调函数，会将复制的数据传入回调函数中
	 */
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
	
	/**
	 * 判断元素上是否有某个class
	 * ele 需要被判断的元素
	 * cls class名称
	 * return boolean值，如果有则为true，如果没有则为false
	 */
	Tool.prototype.hasClass = function(ele, cls) {
		var className = ele.className,
			flag = false;
		
		if(-1!==className.indexOf(cls)) {
			flag = true;
		}
		
		return flag;
	};
	
	/**
	 * 获取某个元素的前一个元素
	 * node 当前元素
	 * return 当前元素的前一个元素
	 */
	Tool.prototype.pre = function(node) {
		return node.previousElementSibling || node.previousSibling;
	};
	
	/**
	 * 获取某个元素的下一个元素
	 * node 当前元素
	 * return 当前元素的下一个元素
	 */
	Tool.prototype.next = function(node) {
		return node.nextElementSibling || node.nextSibling;
	};
	
	/**
	 * 获取某个元素前面的所有同级元素
	 * node 当前元素
	 * return 当前元素前面的所有同级元素集合
	 */
	Tool.prototype.preAll = function(node) {
		var list = [],
			pre = node;
		
		do {
			pre = this.pre(pre);
			
			if(pre) {
				list.push(pre);
			}
		} while(pre)
			
		return list;
	};
	
	/**
	 * 获取某个元素后面的所有同级元素
	 * node 当前元素
	 * return 当前元素后面的所有同级元素集合
	 */
	Tool.prototype.nextAll = function(node) {
		var list = [],
			next = node;
		
		do {
			next = this.next(next);
			
			if(next) {
				list.push(next);
			}
		} while(next)
			
		return list;
	};
	
	/**
	 * 获取某个元素的所有同级元素
	 * node 当前元素
	 * return 当前元素的所有同级元素集合
	 */
	Tool.prototype.siblings = function(node) {
		var preList = this.preAll(node),
			nextList = this.nextAll(node),
			push = Array.prototype.push;
		
		push.apply(preList, nextList);
		return preList;
	};
	
	Tool.prototype.encodeHTML = function(html) {
		var reg = /<([a-zA-Z]+)(?=\s|\/>|>)[\s\S]*>/;
		
		if(reg.test(html)) {
			html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}
		
		return html;
	};
	
	Tool.prototype.decodeHTML = function(html) {
		return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
	};
	
	Tool.prototype.createElement = function(html) {
		var recycled = document.createElement("DIV"),
			reg = /^<([a-zA-Z]+)(?=\s|\/>|>)[\s\S]*>$/,
			html = html.trim();
			
		var _createElement = function(html) {
			if(!reg.test(html)) {
				try {
					return doc.createElement(html);
				} catch(e) {
					console.log(e);
				}
			}
			
			var tagName = hash[RegExp.$1.toLowerCase()];
			
			if(!tagName) {
				recycled.innerHTML = html;
				return recycled.removeChild(recycled.firstChild);
			}
			
			var deep = 0,
				ele = recycled;
			
			do {
				html = "<" + tagName + ">" + html + "</" + tagName + ">";
				deep++;
			} while(tagName=hash[tagName])
			
			ele.innerHTML = html;
			
			do {
				ele = ele.removeChild(ele.firstChild);
			} while(--deep>-1)
				
			return ele;
		};
		
		return _createElement(html);
	};
	
	Tool.prototype.encodeBase64 = function(str) {
		var out, i, len;
	    var c1, c2, c3;

	    var len = str.length,
	    	i = 0,
	    	out = "";
	    	
	    while(i < len) {
		    c1 = str.charCodeAt(i++) & 0xff;
		    
		    if(i == len) {
		        out += base64EncodeChars.charAt(c1 >> 2);
		        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
		        out += "==";
		        break;
		    }
		    
		    c2 = str.charCodeAt(i++);
		    
		    if(i == len) {
		        out += base64EncodeChars.charAt(c1 >> 2);
		        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
		        out += "=";
		        break;
		    }
		    
		    c3 = str.charCodeAt(i++);
		    out += base64EncodeChars.charAt(c1 >> 2);
		    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
		    out += base64EncodeChars.charAt(c3 & 0x3F);
	    }
	    
	    return out;
	};
	
	Tool.prototype.decodeBase64 = function(str) {
		var c1, c2, c3, c4;
	    var i, len, out;

	    len = str.length;
	    i = 0;
	    out = "";
	    
	    while(i < len) {
		    /* c1 */
		    do {
		        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		    } while(i < len && c1 == -1);
		    
		    if(c1 == -1) break;
		
		    /* c2 */
		    do {
		        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		    } while(i < len && c2 == -1);
		    
		    if(c2 == -1) break;
		
		    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		
		    /* c3 */
		    do {
		        c3 = str.charCodeAt(i++) & 0xff;
		        if(c3 == 61) return utf8to16(out);
		        c3 = base64DecodeChars[c3];
		    } while(i < len && c3 == -1);
		    
		    if(c3 == -1) break;
		
		    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		
		    /* c4 */
		    do {
		        c4 = str.charCodeAt(i++) & 0xff;
		        if(c4 == 61) return utf8to16(out);
		        c4 = base64DecodeChars[c4];
		    } while(i < len && c4 == -1);
		    
		    if(c4 == -1) break;
		    
		    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	    }
	    
	    return utf8to16(out);
	};
	
	function utf8to16(str) {
		var out, i, len, c;
	    var char2, char3;

	    out = "";
	    len = str.length;
	    i = 0;
	    
	    while(i < len) {
		    c = str.charCodeAt(i++);
		    
		    switch(c >> 4) { 
		      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
		        // 0xxxxxxx
		        out += str.charAt(i-1);
		        break;
		      case 12: case 13:
		        // 110x xxxx   10xx xxxx
		        char2 = str.charCodeAt(i++);
		        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
		        break;
		      case 14:
		        // 1110 xxxx  10xx xxxx  10xx xxxx
		        char2 = str.charCodeAt(i++);
		        char3 = str.charCodeAt(i++);
		        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
		        break;
		    }
	    }

	    return out;
	}
	
	/**
	 * 获取最快的dms端口(不发送任何消息)
	 * @params arguments.data dms对象；
	 * 		   arguments.time socket连接超时时长；
	 * 		   callback 回调函数；
	 */
	Tool.prototype.getBestDmsWithoutMessage = function() {
		var args = [].slice.call(arguments, 0),
			params = args.shift();
		
		if("[object Object]"!==toString.call(params)) return ;
		if(!params.data) return ;
		
		var obj = params.data,
			inList = obj.internal,
			exList = obj.external,
			ini = 0, exi = 0,
			count = 0,
			inLen = inList.length,
			exLen = exList.length,
			timeMap = {},
			timeList = [],
			outTime = params.time || 30,
			outIt = null,
			callback = args.shift();
		
		outIt && clearTimeout(outIt);
		
		var testPort = function(port, index) {
			var start = Date.now(),
				it = null;
			
			var	cancelLink = function() {
				var end = Date.now(),
					during = end-start;
				timeList.push(during);
				timeMap[during] = port.rtmpUrl;
				global["ws_in_"+index].close();
				delete global["ws_in_"+index];
				count++;
				it && clearTimeout(it);
				
				if(inLen+exLen<=count) {
					callback && callback.call(Object.create(null), timeMap[Math.min.apply(Math, timeList)]);
					outIt && clearTimeout(outIt);
				}
			};
			
			global["ws_in_"+index] = new WebSocket(port.socketUrl);
			
			it = setTimeout(function() {
				cancelLink();
			}, outTime);
			
			global["ws_in_"+index].open = function() {
				outIt && cancelLink();
			};
		};
		
		if(inLen>ini) {
			do {
				(function(port, index) {
					testPort(port, index);
				}(inList[ini]), ini);
			} while(++ini<inLen)
		}
		
		if(exLen>exi) {
			do {
				(function(port, index) {
					testPort(port, index);
				}(exList[exi]), exi);
			} while(++exi<exLen)
		}
		
		outIt = setTimeout(function() {
			callback && callback.call(Object.create(null), timeMap[Math.min.apply(Math, timeList)]);
			outIt && clearTimeout(outIt);
		}, outTime);
	};
	
	/**
	 * 获取最快的dms端口(发送消息)
	 * @params arguments.obj dms数据,
	 *         arguments.time 超时时长
	 *         arguments.msgLen 发送的消息长度
	 *         arguments.times	发送消息的次数
	 *         callback 回调函数
	 */
	Tool.prototype.getBestDmsWithMessage = function() {
		var args = [].slice.call(arguments, 0),
			params = args.shift();
		
		if("[object Object]"!==toString.call(params)) return ;
		if(!params.data) return ;
		
		var obj = params.data,
			inList = obj.internal,
			exList = obj.external,
			ini = 0, exi = 0,
			count = 0,
			inLen = inList.length,
			exLen = exList.length,
			timeMap = {},
			timeList = [],
			outTime = params.time || 30,
			outIt = null,
			msg = JSON.stringify({method: "ping", data: this.random(params.msgLen||100)}),
			times = params.times || 1,
			callback = args.shift();
		
		outIt && clearTimeout(outIt);
		
		var testPort = function(port, index) {
			var start = Date.now(),
				it = null,
				msgCount = 0;
			
			var	cancelLink = function() {
				var end = Date.now(),
					during = end-start;
				timeList.push(during);
				timeMap[during] = port.rtmpUrl;
				global["ws_in_"+index].close();
				delete global["ws_in_"+index];
				count++;
				it && clearTimeout(it);
				
				if(inLen+exLen<=count) {
					callback && callback.call(Object.create(null), timeMap[Math.min.apply(Math, timeList)]);
					outIt && clearTimeout(outIt);
				}
			};
			
			global["ws_in_"+index] = new WebSocket(port.socketUrl);
			
			it = setTimeout(function() {
				cancelLink();
			}, outTime);
			
			global["ws_in_"+index].open = function() {
				global["ws_in_"+index].send(msg);
			};
			
			global["ws_in_"+index].onmessage = function(res) {
				var res = JSON.parse(res);
				if("pingResponse"===res.method) {
					msgCount++;
					if(times>msgCount) {
						global["ws_in_"+index].send(msg);
					} else {
						outIt && cancelLink();
					}
				}
			};
		};
		
		if(inLen>ini) {
			do {
				(function(port, index) {
					testPort(port, index);
				}(inList[ini]), ini);
			} while(++ini<inLen)
		}
		
		if(exLen>exi) {
			do {
				(function(port, index) {
					testPort(port, index);
				}(exList[exi]), exi);
			} while(++exi<exLen)
		}
		
		outIt = setTimeout(function() {
			callback && callback.call(Object.create(null), timeMap[Math.min.apply(Math, timeList)]);
			outIt && clearTimeout(outIt);
		}, outTime);
	};
	
	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["tool"] = new Tool();
	global["tool"] = global.vm.module["tool"];	

	String.prototype.trim = String.prototype.trim || function() {
		this.replace(/(^\s*)|(\s*$)/g, "");
	};
	
	Array.prototype.unique = Array.prototype.unique || function(param) {
		var arr = this, i = 0, len = arr.length, temp = {};
		if(0===len) return ;
		do {
			var data = arr[i];
			if(!temp[param?data[param]:data]) {
				temp[param?data[param]:data] = 1;
				i++;
			} else {
				arr.splice(i, 1);
				len = arr.length;
			}
		} while(i<len)
	};
	
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
					callback.call(this, data);
					window[callName] = undefined;
					try {
						delete window[callName];
						var jsNode = document.getElementById(callName);
						jsNode.parentNode.removeChild(jsNode);
					} catch (e) {}
				};
				
				return callName;
			};
		global.$jsonp = function(url, data, callback) {
			//生成GET请求地址
			if (!url) return false;
			callback = buildTempFunction(callback);
			url += (url.indexOf("?") > 0) ? "" : "?";
			
			for (var i in data) {
				url += "&" + i + "=" + data[i];
			}
			
			url += "&callback=" + callback;
			sendScriptRequest(url, callback);
		};
	};
})(window, function() {
	return window.duang || void 0;
})