var Promise = (function() {
	var _Promise = function() {
		this.callbacks = [];
	};

	_Promise.prototype = {
		constructor: _Promise,
		solve: function(result) {
			this.complete("success", result);
		},
		reject: function(result) {
			this.complete("fail", result);
		},
		complete: function(type, result) {
			if(this.callbacks[0]) {
				this.callbacks.shift()[type](result);
			}
		},
		then: function(successHandle, failHandle) {
			this.callbacks.push({
				success: successHandle,
				fail: failHandle
			});
			return this;
		}
	};

	return {
		init: function() {
			return new _Promise();
		}
	};
})()