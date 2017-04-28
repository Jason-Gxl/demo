/**
*
*MVC
*@Author Jason
*@Date 2017-4-27
*
*/
;(function() {
	"use strict";
	var toString = Object.prototype.toString, modules = {}

	function Module(name, deps) {
		if(!this instanceof Module) {
			return new Module(name, deps);
		}
		var self = this;

		this.name = name;

		this.getDepends = function() {
			return deps||[];
		};
	}

	Module.prototype = {
		constructor: Module,
		controller: function() {
			var args = [].slice.call(arguments, 0),
				name = args.shift(),
				fn = args.pop(),
				deps = args.shift();
		},
		director: function() {},
		service: function() {}
	};

	function checkDeps(_deps) {
		return _deps.filter(function(x) {
			return !!x && "[object String]"===toString.call(x);
		}).unique();
	}

	window.duang = {
		module: function() {
			var args = [].slice.call(arguments, 0),
				arg1 = args.shift(),
				arg2 = args.shift() || [],
				moduleObj = null;

			if((!arg1 && 0!==arg1) || "[object String]"!==toString.call(arg1)) return ;
			arg2 = "[object Array]"!==toString.call(arg2)?[arg2]:arg2;
			arg2 = checkDeps(arg2);

			if(modules[arg1]) {
				moduleObj = modules[arg1];

				if(0<arg2.length) {
					var i = 0, len = arg2.length, deps = moduleObj.getDepends();
					do {
						-1===deps.indexOf(arg2[i]) && deps.push(arg2[i]);
					} while(++i<len);
				}
			} else {
				moduleObj = new Module(arg1, arg2);
				modules[arg1] = moduleObj;
			}

			return moduleObj;
		},
		element: function() {

		},
		getModuleByName: function(name) {
			return modules[name] || null;
		}
	};

	Array.prototype.filter = Array.prototype.filter || function() {
		var args = [].slice.call(arguments, 0), 
			fn = args.shift(), 
			list = [], 
			arr = this, 
			len = arr.length, 
			i = 0;

		if(i>len) return ;

		do {
			var x = arr[i];

			if(fn) {
				fn.call(this, x) && list.push(x);
			} else {
				list.push(x);
			}
		} while(++i<len)

		return list;
	};

	Array.prototype.unique = function() {
		var args = [].slice.call(arguments, 0),
			fn = args.shift(),
			set = new Set(),
			list = [],
			arr = this,
			len=  arr.length,
			i = 0;

		if(i>len) return ;

		do {
			var x = arr[i];
			if(fn) {
				fn.call(list, x) && list.push(x);
			} else {
				set.add(x);
			}
		} while(++i<len)

		return !fn?Array.from(set):list;
	};
}());