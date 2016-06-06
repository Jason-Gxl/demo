(function(global){
	"use strict"

	var state = "on",
		time = 45*60,

	var Record = function() {
		this.name = "Record";
	};

	Record.prototype = {
		constructor: Record,
		setState: function(_state) {
			state = _state;
			return state;
		},
		getState: function() {
			return state;
		},
		start: function() {

		},
		stop: function() {

		},
		next: function() {

		}
	};

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["record"] = new Record();
})(window)