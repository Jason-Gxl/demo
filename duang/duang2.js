/**
*
*MVC
*@Author Jason
*@Date 2017-4-27
*
*/
;(function() {
	"use strict";
	var toString = Object.prototype.toString;
	var	modules = {},
		controllers = {},
		directives = {},
		services = {};

	var addEvent = window.addEventListener?function(item, type, fn, use) {
		if(!item) return ;
		item.addEventListener(type, fn, use||false);
	}:function(item, type, fn) {
		if(!item) return ;
		item.attachEvent("on"+type, fn);
	};

	var removeEvent = window.removeEventListener?function(item, type, fn, use) {
		if(!item) return ;
		item.removeEventListener(type, fn, use||false);
	}:fucntion(item, type, fn) {
		if(!item) return ;
		item.detachEvent(type, fn);
	};

	function Module(name, _deps) {
		if(!this instanceof Module) return new Module(name, _deps);
		this.name = name;
		var i = 0,
			deps = [],
			len = _deps.length;

		if(len>i) {
			do {
				var _dep = _deps[i];
				modules[_dep] && deps.push(modules[_dep]);
			} while(++i<len)
		}

		this.getDepends = function() { return deps; };
	}

	function Service() {
		var callbacks = [];

		this.then = function(fn) {
			callbacks.push(fn||null);
			return this;
		};

		this.fire = function(result) {
			var callback = callbacks.shift();

			if(void(0)!==callback) {
				var result = callback.call(this, result, this.fire);
			}
			if(callbacks.length>0 && result) {
				this.fire(result);
			}
		}
	}

	function Impl(impl, deps) {
		var i = 0, len = deps.length;

		if(len>i) {
			do {
				var dep = deps[i];
				var d = this.getService(dep) || this.getDirective(dep) || this.getController(dep);

				if(!d) {
					var depModules = this.getDepends(), j = 0, l = depModules.length;
					if(l>j) {
						do {
							var depModule = depModules[j];
							d = depModule.getService(dep) || depModule.getDirective(dep) || depModule.getController(dep);
							if(d) break;
						} while(++j<l)
					}
				}

				deps.splice(i, 1, d);
			} while(++i<len)
		}

		return impl.apply(this, deps);
	}

	Module.prototype = {
		constructor: Module,
		getController: function(name) {
			if(!name) return ;
			var ctrls = controllers[this.name] || {};
			return ctrls[name];
		},
		getDirective: function(name) {
			if(!name) return ;
			var dircts = directives[this.name] || {};
			return dircts[name];
		},
		getService: function(name) {
			if(!name) return ;
			var servs = services[this.name] || {};
			return servs[name];
		},
		controller: function() {
			var args = [].slice.call(arguments, 0),
				controllerName = args.shift();
			if(!controllerName || "[object String]"!==toString.call(controllerName)) return ;

			try {
				if(this.getController(controllerName)) throw new Error("controller named "+controllerName+" is exist");
			} catch (e) {
				console.error(e.message);
				return ;
			}

			var impl = args.pop();
			if(!impl || "[object Function]"!==toString.call(impl)) return;
			var deps = args.shift();
			deps = !deps?[]:("[object Array]"!==toString.call(deps)?[deps]:deps);
			var obj = Impl.call(this, impl, deps);
			controllers[this.name] = controllers[this.name] || {};
			controllers[this.name][controllerName] = obj;
			return this;
		},
		directive: function() {
			var args = [].slice.call(arguments, 0),
				directiveName = args.shift();
			if(!directiveName || "[object String]"!==toString.call(directiveName)) return ;

			try {
				if(this.getController(directiveName)) throw new Error("controller named "+directiveName+" is exist");
			} catch (e) {
				console.error(e.message);
				return ;
			}

			var impl = args.pop();
			if(!impl || "[object Function]"!==toString.call(impl)) return;
			var deps = args.shift();
			deps = !deps?[]:("[object Array]"!==toString.call(deps)?[deps]:deps);
			var obj = Impl.call(this, impl, deps);
			directives[this.name] = directives[this.name] || {};
			directives[this.name][directiveName] = obj;
			return this;
		},
		service: function() {
			var args = [].slice.call(arguments, 0),
				serviceName = args.shift();
			if(!serviceName || "[object String]"!==toString.call(serviceName)) return ;

			try {
				if(this.getController(serviceName)) throw new Error("controller named "+serviceName+" is exist");
			} catch (e) {
				console.error(e.message);
				return ;
			}

			var impl = args.pop();
			if(!impl || "[object Function]"!==toString.call(impl)) return;
			var deps = args.shift();
			deps = !deps?[]:("[object Array]"!==toString.call(deps)?[deps]:deps);

			try {
				var obj = Impl.call(this, impl, deps);
				if("[object Object]"!==toString.call(obj)) throw new Error("return value type is wrroy");
			} catch(e) {
				console.error(e.message);
				return ;
			}

			var serviceObj = {};
			for(var key in obj) {
				serviceObj[key] = function() {
					var service = new Service(), args = [];
					arguments[0] && args.push(arguments[0]);
					args.push(service.fire);

					setTimeout(function() {
						var result = obj[key].apply(service, args);
						result && service.fire(result);
					}, 0);

					return service;
				};
			}
			
			services[this.name] = services[this.name] || {};
			services[this.name][serviceName] = serviceObj;
			return this;
		}
	};

	window.duang = {
		module: function() {
			var args = [].slice.call(arguments, 0),
				moduleName = args.shift();
			if(!moduleName || "[object String]"!==toString.call(moduleName)) return ;
			if(modules[moduleName]) return modules[moduleName];
			var deps = args.shift();
			deps = !deps?[]:("[object Array]"!==toString.call(deps)?[deps]:deps);
			var module = new Module(moduleName, deps);
			modules[moduleName] = module;
			return module;
		},
		getModule: function(name) {
			if(!name) return ;
			return modules[name];
		},
		element: function(selector) {
			if(!selector) return ;
			var ele = getElement(selector);
			if(ele) { return new Element(ele);}
		}
	};

	function Element(ele) { this.content = ele; }

	Element.prototype = {
		constructor: Element,
		addClass: function(classname) {
			if(void(0)===classname) return ;
			var content = this.content;

			if("[object Array]"===toString.call(content)) {
				var i = 0, len = content.length;
				if(len>i) {
					do {addClass(content[i], classname); } while(++i<len);
				}
			} else {
				addClass(content, classname);
			}

			function addClass(ele, classname) {
				var className = ele.className.replace(/^\s*|\s*$/, ""),
					reg = new RegExp("\\s+\\b"+classname+"\\b\\s?");
				if(!reg.test(className)) ele.className = className + " " + classname;
			}

			return this;
		},
		removeClass: function(classname) {
			if(void(0)===classname) return ;
			var content = this.content;

			if("[object Array]"===toString.call(content)) {
				for(var i=0,len=content.length; removeClass(content[i], classname); i++);
			} else {
				removeClass(content, classname);
			}

			function removeClass(ele, classname) {
				var className = ele.className,
					reg = new RegExp("\\s?\\b"+classname+"\\b");
				if(reg.test(className)) ele.className = className.replace(reg, "");
			}

			return this;
		},
		attr: function(name, value) {
			if(void(0)===name) return ;
			var content = this.content;

			if(!value) {
				if("[object Array]"===toString.call(content)) {
					if(content.length>1) return ;
					return content[0].getAttribute(name);
				} else {
					return content.getAttribute(name);
				}
			} else {
				if("[object Array]"===toString.call(content)) {
					for(var i=0,len=content.length; content[i].setAttribute(name, value); i++);
				} else {
					content.setAttribute(name, value);
				}
			}

			return this;
		},
		removeAttr: function(name) {
			if(void(0)===name) return ;
			var content = this.content;

			if("[object Array]"===toString.call(content)) {
				for(var i=0,len=content.length; content[i].removeAttribute(name); i++);
			} else {
				content.removeAttribute(name);
			}

			return this;
		},
		on: function(type, fn, use) {
			if(!type || !fn) return ;
			var content = this.content;

			if("[object Array]"===toString.call(content)) {
				for(var i=0,len=content.length; addEvent(content[i], type, fn, use); i++);
			} else {
				addEvent(content, type, fn);
			}

			return this;
		},
		delEvent: function(type, fn, use) {
			if(!type || !fn) return ;
			var content = this.content;

			if("[object Array]"===toString.call(content)) {
				for(var i=0,len=content.length; removeEvent(content[i], type, fn, use); i++);
			} else {
				removeEvent(content, type, fn);
			}

			return this;
		}
	};

	function getElement(selector) {
		var ele = null,
			reg1 = /^\s*(\.|#|\[name\s*=)/,
			reg2 = /^\s*(?:\.|#|\[name\s*=\s*)?(.+?)\]?$/;

		selector.match(reg1);
		switch(RegExp.$1) {
		case "#":
			selector.match(reg2);
			ele = document.getElementById(RegExp.$1);
			break;
		case ".":
			selector.match(reg2);
			ele = [].slice.call(document.getElementsByClassName(RegExp.$1), 0);
			break;
		case "":
			selector.match(reg2);
			ele = [].slice.call(document.getElementsByTagName(RegExp.$1), 0);
			break;
		default:
			selector.match(reg2);
			ele = [].slice.call(document.getElementsByName(RegExp.$1), 0);
		}

		return ele;
	}
}(void(0)));