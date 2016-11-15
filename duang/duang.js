(function() {
	"use strict"
	var win = window,
		doc = document,
		slice = Array.prototype.slice,
		toString = Object.prototype.toString;

	var Duang = (function() {
		var modules = {};

		var Module = (function() {
			var depModules = {},	//存放本模块依赖的其它模块，格式：{moduleName1:[depModuleName1, depModuleName2], moduleName2:[...]}
				controllers = {},	//存放各模块下定义的controller，格式：{moduleName:{controllerName1:controllerObj, controllerName2:...}}
				services = {},	//存放各模块下定义的service，格式：{moduleName:{serviceName1:serviceObj, serviceName2:...}}
				container = null;	//controllers，services的临时存放区

			function Module(name, deps) {
				this.name = name;
				depModules[name] = deps;
			}

			function checkParms(name, deps, impl, type) {
				var flag = true;

				try {
					if(!name) throw new Error(5008, type+"'s name is undefined");
				} catch(e) {
					console.error(e.message);
				}

				if("[object Function]"!==toString.call(deps) && "[object Function]"!==toString.call(impl)) flag = false ;
				return flag;
			}

			function getDepend(moduleName, depName) {
				var _controllers = controllers[moduleName],
					_services = services[moduleName],
					_depModules = depModules[moduleName],
					obj = (_services && _services[depName]) || (_controllers && _controllers[depName]);

				if(!obj) {
					var i = 0, len = _depModules.length;
					if(len>i) {
						do {
							_controllers = controllers[_depModules[i]];
							_services = services[_depModules[i]];
							obj = _services[depName] || _controllers[depName];
							if(obj) break;
						} while(++i<len)
					}
				}

				return obj;
			}

			function definedModule(moduleName, name, deps, impl) {
				var obj = container[moduleName];

				if(deps) {
					switch(true) {
					case "[object Function]"===toString.call(deps):
						obj[name] = deps.call(this);
						break;
					case "[object Array]"===toString.call(deps):
						var i = 0,
							len = deps.length;

						try {
							while(i<len) {
								var mObj = getDepend(moduleName, deps[i]);
								if(!mObj) throw new Error(5008, deps[i]+" is undefined");
								deps[i] = mObj;
								i++;
							}
						} catch(e) {
							console.error(e.message);
						}

						obj[name] = impl.apply(this, deps);
						break;
					default:
						obj[name] = impl.apply(this, getDepend(deps));
					}
				} else {
					obj[name] = impl.call(this);
				}
			}

			Module.prototype = {
				getModuleName: function() {
					return this.name;
				},
				controller: function(name, deps, impl) {
					if(checkParms(name, deps, impl, "controller")) {
						controllers[this.name] = controllers[this.name] || {};
						container = controllers;
						definedModule(this.name, name, deps, impl);
						return modules[this.name];
					}
				},
				service: function(name, deps, impl) {
					if(checkParms(name, deps, impl, "service")) {
						services[this.name] = services[this.name] || {};
						container = services;
						definedModule(this.name, name, deps, impl);
						return modules[this.name];
					}
				},
				getControllers: function() {
					return controllers[this.name];
				},
				getServices: function() {
					return services[this.name];
				}
			};

			return Module;
		}());

		function checkDepModule(deps) {
			try {
				if("[object Array]"===toString.call(deps)) {
					var i = 0, len = deps.length;
					while(i<len) {
						if(!modules[deps[i]]) throw new Error(5008, deps[i]+" is undefined");
						i++;
					}
				} else {
					if(!modules[deps]) throw new Error(5008, deps+" is undefined");
				}
			} catch(e) {
				console.log(e.message);
			}

			return 1;
		}

		function initModule(name, deps) {
			if(!name) return ;
			var deps = deps || [];
			if(checkDepModule(deps)) {
				var moduleObj = modules[name] || new Module(name, deps);
				modules[name] = moduleObj;
				return moduleObj;
			}
		}

		function getModule(name) {
			if(!name) return null;
			return modules[name];
		}

		return {
			module: initModule,
			getModule: getModule
		};
	}());

	win.duang = Duang;
}(undefined));