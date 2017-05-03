/**
*
*MVC
*@Author Jason
*@Date 2017-4-27
*
*/
;(function() {
	"use strict";
	var win = window,
		doc = document,
		modules = {},
		controllers = {},
		services = {},
		directives = {};

	function Module(name, deps) {
		if(!this instanceof Module) {
			return new Module()
		}

		this.name = name;

		this.getDepends = function() {
			return deps;
		};
	}

	win.duang = {
		module: function() {},
		getModule: function() {},
		element: function() {}
	};
}(void(0)));