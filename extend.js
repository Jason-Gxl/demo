var UA = (function() {
	var ua = navigator.userAgent,
		isIE = /msie|Trident/i.test(ua),
		isIElt9 = (!-[1, ]),
		isIE6 = /msie 6/i.test(ua),
		isFF = /firefox/i.test(ua),
		isMobile = /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i.test(ua);
	return {
		'ua': ua,
		'isIE': isIE,
		'isIElt9': isIElt9,
		'isIE6': isIE6,
		'isFF': isFF,
		'isMobile': isMobile
	};
})();

(function(win){

	//入口
	win.$$ = function(obj) {
		return _$$(obj);
	};

	//如果用户传入的是dom对象时创建些对象
	var _$$ = function(obj) {
		//元素选择器
		if(isDOM(obj)) {
			return new _$(obj);
		}

		//id选择器
		if(!isDOM(obj) && obj.trim().startWith("#")) {
			return new _$(_$id(obj.trim().substring(1, obj.length)));
		}

		//class选择器
		if(!isDOM(obj) && obj.trim().startWith("\\.")) {
			var eles = [];
			var elList = _$class(obj.trim().substring(1, obj.length));

			for(var i=0,len=elList.length; i<len; i++) {
				eles.push(elList[i]);
			}

			return eles.length>0?new _$(eles):eles;
		}

		//标签名选择器
		if(!isDOM(obj) && !obj.trim().startWith("\\[") && !obj.trim().endWith("\\]")) {
			var eles = [];

			var elList = _$tagName(obj.trim());

			if(0==elList.length) {
				elList = _$name(obj.trim());
			}

			for(var i=0, len=elList.length; i<len; i++) {
				eles.push(elList[i]);
			}

			return eles.length>0?new _$(eles):eles;
		}

		if(!isDOM(obj) && obj.trim().startWith("\\[") && obj.trim().endWith("\\]")) {
			var eles = [];
			var subObj = obj.substring(1, obj.length-1);
			var subObjArr = subObj.split(/=/);
			var elList = _$attr(subObjArr[0], subObjArr[1]);

			for(var i=0, len=elList.length; i<len; i++) {
				eles.push(elList[i]);
			}

			return eles.length>0?new _$(eles):eles;
		}
	};

	var _$ = function() {
		this.element = arguments[0];
	};

	_$.prototype = {
		"constructor": this,
		"next": function() {  //获取下一个同级元素
			var _eles = this.element;

			if(_eles.constructor===Array) {
				var nextList = [];

				for(var i=0, len=_eles.length; i<len; i++) {
					var el = _eles[i];
					var nextEl = el.nextElementSibling || ((el.nextSibling && el.nextSibling.nodeType==1)?el.nextSibling:null);

					if(nextEl) nextList.push(nextEl);
				}

				for(var i=0; len=nextList.length,i<len; ) {
					var count = 0;
					for(var j=i+1, l=len; j<l; j++) {
						if(nextList[i]==nextList[j]) {
							count++;
							nextList.splice(i, 1);
							break;
						}
					}
					if(0==count) {
						i++;
					}
				}

				return nextList.length>0?new _$(nextList):null;
			}

			var el = _eles;
			var nextEl = el.nextElementSibling || ((el.nextSibling && el.nextSibling.nodeType==1)?el.nextSibling:null);
			return nextEl!=null?new _$(nextEl):null;
		},
		"pre": function() {  //获取上一个同级元素
			var _eles = this.element;

			if(_eles.constructor===Array) {
				var preList = [];

				for(var i=0, len=_eles.length; i<len; i++) {
					var el = _eles[i];
					var preEl = el.previousElementSibling || ((el.previousSibling && el.previousSibling.nodeType==1)?el.previousSibling:null);

					if(preEl) preList.push(preEl);
				}

				for(var i=0; len=preList.length,i<len; ) {
					var count = 0;
					for(var j=i+1, l=len; j<l; j++) {
						if(preList[i]==preList[j]) {
							preList.splice(i, 1);
							count++;
							break;
						}
					}
					if(0==count) {
						i++;
					}
				}

				return preList.length>0?new _$(preList):null;
			}

			var el = _eles;
			var preEl = el.previousElementSibling || ((el.previousSibling && el.previousSibling.nodeType==1)?el.previousSibling:null);
			return preEl!=null?new _$(preEl):null;
		},
		"nextAll": function() {  //获取后面所有同级元素
			var _eles = this.element;
			var nextList = [];

			var _next = function(ele) {
				var nextEl = ele.nextElementSibling || ((ele.nextSibling && ele.nextSibling.nodeType==1)?ele.nextSibling:null);

				if(nextEl) {
					nextList.push(nextEl);
					_next(nextEl);
				}
			};

			if(_eles.constructor===Array) {
				for(var i=0, len=_eles.length; i<len; i++) {
					_next(_eles[i]);
				}
			} else {
				_next(_eles);
			}

			for(var i=0; len=nextList.length,i<len; ) {
				var count = 0;
				for(var j=i+1, l=len; j<l; j++) {
					if(nextList[i]==nextList[j]) {
						count++;
						nextList.splice(i, 1);
						break;
					}
				}
				if(0==count) {
					i++;
				}
			}

			return nextList.length>0?new _$(nextList):nextList;
		},
		"preAll": function() {  //获取前面所有同级元素
			var _eles = this.element;
			var preList = [];

			var _pre = function(ele) {
				var preEl = ele.previousElementSibling || ((ele.previousSibling && ele.previousSibling.nodeType==1)?ele.previousSibling:null);

				if(preEl) {
					preList.push(preEl);
					_pre(preEl);
				}
			};

			if(_eles.constructor===Array) {
				for(var i=0, len=_eles.length; i<len; i++) {
					_pre(_eles[i]);
				}
			} else {
				_pre(_eles);
			}
			
			for(var i=0; len=preList.length,i<len; ) {
				var count = 0;
				for(var j=i+1, l=len; j<l; j++) {
					if(preList[i]==preList[j]) {
						preList.splice(i, 1);
						count++;
						break;
					}
				}
				if(0==count) {
					i++;
				}
			}

			return preList.length>0?new _$(preList):preList;
		},
		"hasClass": function(str) {  //判断当前元素是否有某个class
			if(!str) return ;

			var _eles = this.element;
			var el = null;

			if(_eles.constructor===Array && _eles.length>1) return ;
			else if(_eles.constructor===Array && _eles.length==1) el = _eles[0];
			else el = _eles;

			var classNameStr = el.className.trim();
			var classNameList = classNameStr.split(/\s+/);
			return classNameList.has(str.trim());
		},
		"html": function(str) {
			var _eles = this.element;

			if(str) {
				if(_eles.constructor===Array) {
					for(var i=0, len=_eles.length; i<len; i++) {
						_eles[i].innerHTML = str;
					}
				} else {
					_eles.innerHTML = str;
				}
				return this;
			} else {
				if(_eles.constructor===Array && _eles.length>1) return "";
				else if(_eles.constructor===Array && 1==_eles.length) return _eles[0].innerHTML;
				else return _eles.innerHTML;
			}
		},
		"on": function(type, fn, capture) {  //为元素绑定事件
			var _eles = this.element;
			var types = type.trim().split(/\s+/);

			var _bind = function(el) {
				for(var i=0, len=types.length; i<len; i++) {
					el.addEventListener(types[i], function(e) {
						fn.call(this, e);
					}, capture);
				}
			};

			var _attach = function(el) {
				for(var i=0, len=types.length; i<len; i++) {
					el.attachEvent("on"+types[i], function(e) {
						fn.call(this, e);
					});
				}
			};

			if(window.addEventListener) {
				if(_eles.constructor===Array) {
					for(var j=0, l=_eles.length; j<l; j++) {
						var el = _eles[j];
						_bind(el);
					}
				} else {
					var el = _eles;
					_bind(el);
				}
				
			} else if(window.attachEvent) {
				if(_eles.constructor===Array) {
					for(var j=0, l=_eles.length; j<l; j++) {
						var el = _eles[j];
						_attach(el);
					}
				} else {
					var el = _eles;
					_attach(el);
				}
			}
		},
		"onMore": function(type, fn, time, capture) {  //为元素绑定固定次数的事件
			var _eles = this.element;
			var types = type.trim().split(/\s+/);
			var t = time || 1;

			var _handler = function(e) {
				fn.call(this, e);
				this[e.type+"Count"] ++;

				if(this[e.type+"Count"]>=t) {
					if(window.addEventListener) {
						this.removeEventListener(e.type, _handler);
					} else {
						this.detachEvent("on"+e.type, _handler);
					}
				}
			};

			var _bind = function(el) {
				el[types[i]+"Count"] = 0;
				el.addEventListener(types[i], _handler, capture);
			};

			var _attach = function(el) {
				el[types[i]+"Count"] = 0;
				el.attachEvent("on"+types[i], _handler);
			};

			if(window.addEventListener) {
				if(_eles.constructor===Array) {
					for(var j=0, l=_eles.length; j<l; j++) {
						var el = _eles[j];

						for(var i=0, len=types.length; i<len; i++) {
							_bind(el);
						}

					}
				} else {
					var el = _eles;
					_bind(el);
				}
				
			} else {
				if(_eles.constructor===Array) {
					for(var j=0, l=_eles.length; j<l; j++) {
						var el = _eles[j];

						for(var i=0, len=types.length; i<len; i++) {
							_attach(el);
						}

					}
				} else {
					var el = _eles;
					_attach(el);
				}
			}
		},
		"attr": function(attrName, attrValue) {
			var _eles = this.element;

			if(attrValue) {
				if(_eles.constructor===Array) {
					for(var i=0, len=_eles.length; i<len; i++) {
						var el = _eles[i];
						el.setAttribute(attrName, attrValue);
					}
				} else {
					var el = _eles;
					el.setAttribute(attrName, attrValue);
				}
			} else {
				if(_eles.constructor===Array) {
					var attrs = [];
					for(var i=0, len=_eles.length; i<len; i++) {
						var el = _eles[i];
						attrs.push(el.getAttribute(attrName));
					}
					return attrs;
				}

				var el = _eles;
				return el.getAttribute(attrName);
			}
		},
		"css": function(styleName, styleValue) {
			var _eles = this.element;

			if(styleValue) {
				if(!isNaN(styleValue)) styleValue += "px";

				if(_eles.constructor===Array) {
					for(var i=0, len=_eles.length; i<len; i++) {
						var el = _eles[i];
						el.style[styleName] = styleValue;
					}
				} else {
					var el = _eles;
					el.style[styleName] = styleValue;
				}
				
			} else {
				var el = null;

				if(_eles.constructor===Array && _eles.length>1) return ;
				else if(_eles.constructor===Array && 1==_eles.length) el = _eles[0];
				else el = _eles;

				switch(styleName) {
					case "width":
						return el.offsetWidth;
					case "height":
						return el.offsetHeight;
					case "top":
						return el.offsetTop;
					case "left":
						return el.offsetLeft;
					default:
						return el.style[styleName];
				}
			}
		},
		"addClass": function(className) {
			if(!className) return ;
			var _eles = this.element;
			var addClassNameList = className.trim().split(/\s+/);
			
			var _addClass = function(el) {
				var oldClassNameList = el.className.trim().split(/\s+/);
				oldClassNameList.combine(addClassNameList);
				var newClassName = oldClassNameList.unique().join(" ");
				el.className = newClassName;
			}

			if(_eles.constructor===Array) {
				for(var i=0, len=_eles.length; i<len; i++) {
					var el = _eles[i];
					_addClass(el);
				}
			} else {
				var el = _eles;
				_addClass(el);
			}
		},
		"removeClass": function(className) {
			if(!className) return ;
			var _eles = this.element;
			var removeClassNameList = className.trim().split(/\s+/);

			var _removeClass = function(el) {
				var oldClassNameList = el.className.trim().split(/\s+/);

				for(var i=0; len=oldClassNameList.length, i<len; ) {
					var count = 0;

					for(var j=0, l=removeClassNameList.length; j<l; j++) {
						if(oldClassNameList[i].trim()==removeClassNameList[j].trim()) {
							oldClassNameList.splice(i, 1);
							count++;
							break;
						}
					}

					if(0==count) {
						i++;
					}
				}

				el.className = oldClassNameList.join(" ");
			};

			if(_eles.constructor===Array) {
				for(var i=0, l=_eles.length; i<l; i++) {
					var el = _eles[i];
					_removeClass(el);
				}
			} else {
				var el = _eles;
				_removeClass(el);
			}

		},
		"sibling": function() {
			var nextAll = this.nextAll().element || [];
			var preAll = this.preAll().element || [];
			preAll.combine(nextAll);
			return preAll.length>0?new _$(preAll):preAll;
		},
		"each": function(fn) {
			var _eles = this.element;
			if(_eles.constructor==Array) {
				for(var i=0,len=_eles.length; i<len; i++) {
					fn.call(this, i, _eles[i]);
				}
			} else {
				fn.call(this, 0, _eles);
			}
		},
		"val": function(obj) {
			var _eles = this.element;
			
			var _val = function(el) {
				if(el.nodeType==1 && (el.tagName=="INPUT" || el.tagName=="textarea")) {
					el.value = obj;
				}
			};
			
			if(_eles.constructor==Array) {
				var result = [];
				for(var i=0,len=_eles.length; i<len; i++) {
					var el = _eles[i];
					
					if(obj) {
						_val(el);
					}
					
					if(!obj) {
						result.push(el.value);
					}
				}
			} else {
				if(obj) {
					_val(_eles);
				}
				
				if(!obj) {
					return _eles.value || "";
				}
			}
		},
		"eq": function(indexs) {
			var _eles = this.element;
			var eles = [];
			
			if(!indexs) return _eles;
			
			if(!_eles || (indexs.constructor==Array && _eles.length<=0)) return eles;
			
			if(indexs.constructor==Array && indexs.length>0) {
				for(var i=0, len=indexs.length; i<len; i++) {
					eles.push(_eles[indexs[i]]);
				}
			} else {
				eles.push(_eles[indexs]);
			}
			
			return eles;
		},
		"length": function() {
			var _eles = this.element;
			return _eles.constructor==Array?_eles.length:1;
		}
	};

	//id选择器
	var _$id = function(_id) {
		return _id ? document.getElementById(_id):null;
	}

	//class选择器
	var _$class = function(_class) {
		var eles = [];
		
		if(!_class) {
			return eles;
		}
		
		var _p = arguments[1] || document;

		if(document.getElementsByClassName) {
			eles = _p.getElementsByClassName(_class);
		} else {
			var nodes = [];

			if(arguments[1] && _p.hasChildNodes()) {
				nodes = _p.children || _p.childNodes;
			} else {
				nodes = _p.getElementsByTagName("*") || _p.all;
			}

			for(var i in nodes) {
				var classNameStr = nodes[i].className || "";
				classNameStr = classNameStr.trim();
				var classNames = classNameStr.split("/\s+/");

				if(classNames.has(_class)) {
					eles.push(nodes[i]);
				}

			}
		}
		
		return eles;
	};

	//控件名称选择器，例如：input
	var _$tagName = function(_tagName) {
		var eles = [];
		
		if(!_tagName) {
			return eles;
		}
		
		var _p = arguments[1] || document;
		eles = _p.getElementsByTagName(_tagName);
		return eles;
	};

	//name属性选择器
	var _$name = function(_name) {
		var eles = [];
		
		if(!_name) {
			return eles;
		}
		
		var _p = arguments[1] || document;
		
		var _getChild = function(_p) {
			if(_p.hasChildNodes()) {
				var nodes = _p.children || _p.childNodes;

				for(var i=0, len=nodes.length; i<len; i++) {
					if(nodes[i].nodeType==1 && (nodes[i].name || "")==_name) {
						eles.push(nodes[i]);
					}

					_getChild(nodes[i]);
				}

			}
		};

		if(arguments[1]) {
			_getChild(_p);
		} else {
			eles = _p.getElementsByName(_name)
		}
		
		return eles;
	};

	//任意属性选择器
	var _$attr = function(attrName, attrValue) {
		var eles = [];
		
		if(!attrName || !attrValue) {
			return eles;
		}
		
		var _p = arguments[2] || document;

		var _getChild = function(_p) {
			if(_p.hasChildNodes()) {
				var nodes = _p.children || _p.childNodes;

				for(var i=0, len=nodes.length; i<len; i++) {
					var attrVal = nodes[i].getAttribute(attrName);
					var attrVals = (attrVal || "").split(/\s+/);

					if(nodes[i].nodeType==1 && attrVals.has(attrValue)) {
						eles.push(nodes[i]);
					}

					_getChild(nodes[i]);
				}
				
			}
		};

		_getChild(_p);
		
		return eles;
	};

	//深拷贝，将oldVal中的数据拷贝到newVal中
	win.$dcopy = function(newVal, oldVal) {
		var newVal = newVal || {};
		
		for(var i in oldVal) {
			if(typeof oldVal[i]==="object") {
				
				if(null===oldVal[i]) {
					newVal[i] = null;
					continue;
				}
				
				if(undefined===oldVal[i]) {
					newVal[i] = undefined;
					continue;
				}
				
				newVal[i] = (oldVal[i].constructor===Array)?[]:{};
				$dcopy(newVal[i], oldVal[i]);
			} else {
				newVal[i] = oldVal[i];
			}
		}

		return newVal;
	};

	//浅拷贝, 将oldVal中的数据拷贝到newVal中
	win.$lcopy = function(newVal, oldVal) {
		var newVal = newVal || {};

		for(var i in oldVal) {
			newVal[i] = oldVal[i];
		}

		return newVal;
	};

	//设置cookie
	win.setCookie = function(cname, cvalue, exdays) {
		var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	//获取cookie
	win.getCookie = function(cname) {
		var name = cname + "=";
	    var ca = document.cookie.split(';');
	    
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);

	        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
	    }
	    
	    return "";
	}
	
	//清除cookie  
	win.clearCookie = function(cname) {
		this.setCookie(cname, "", -1);
	}
	
	//判断当前对象是否是DOM对象
	win.isDOM = function() {
		var flag = (typeof HTMLElement === 'object') ?
				function() {
					return arguments[0] instanceof HTMLElement;
				}:
				function() {
					return arguments[0] && typeof arguments[0] === 'object' && arguments[0].nodeType == 1 && typeof arguments[0].nodeName === 'string';
				};
		return flag(arguments[0]);
	};

	//获取鼠标当前坐标
	win.mouseCoords = function(ev) {
		if(ev.pageX || ev.pageY){ 
			return {x:ev.pageX, y:ev.pageY}; 
		}

		return { 
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
			y:ev.clientY + document.body.scrollTop - document.body.clientTop
		}; 
	};

})(window);

(function(Array) {
	//判断数组是否为空
	Array.prototype.isEmpty = function() {
		var flag = false;

		if(this.length<=0) {
			flag = true;
		}

		return flag;
	};
	
	//获取数组中最大值
	Array.prototype.max = function() {
		return Math.max.apply(null, this);
	};
	
	//获取数组中最小值
	Array.prototype.min = function() {
		return Math.min.apply(null, this);
	};
	
	//合并两个数组
	Array.prototype.combine = function() {
		return Array.prototype.push.apply(this, arguments[0]);
	}

	//判断数组中是否有某个元素
	Array.prototype.has = function(obj) {
		var count = 0;

		for(var i=0, len=this.length; i<len; i++) {
			if(obj===this[i]) count++;
		}

		return count>0?true:false;
	};

	//去除数组中的重复元素
	Array.prototype.unique = function() {
		var res = [];
		var json = {};

		for(var i=0, len=this.length; i<len; i++) {
			if(!json[this[i]]) {
				res.push(this[i]);
				json[this[i]] = 1;
			}
		}

		return res;
	};
})(Array);

(function(Math) {
	//获取随机数
	//min最小数
	//max最大数
	//exact间隔
	var nativeRandom = Math.random;
	Math.random = function(min, max, exact) {
		if(0===arguments.length) {
			return nativeRandom();
		} else if(1===arguments.length){
			max = min;
			min = 0;
		}
		
		var range = min + (nativeRandom()*(max - min));
		return exact === void(0) ? Math.round(range) : range.toFixed(exact);
	};
	
	//计算绝对值
	Math.abs = function(number) {
		var y = number>>31;
		return (number^y)-y;
	};
})(Math);

(function(String) {
	//判断字符串是否以另一个字符串开头
	String.prototype.startWith = function(str) {
		var reg = new RegExp("^"+str);
		return reg.test(this);
	};

	//判断字符串是否以另一个字符串结尾
	String.prototype.endWith = function(str) {
		var reg = new RegExp(str+"$");
		return reg.test(this);
	}

	//去除两端空格
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
})(String);