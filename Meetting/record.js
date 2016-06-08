(function(global) {
	"use strict"
	var dataContainer = global.vm.module["dataContainer"],
		tool = global.vm.module["tool"],
		doc = window.document;

	function Record() {
		var self = this;
		this.name = "Record";
		this.recordHint = doc.getElementsByClassName("record-hint")[0];
		this.triggerBtn = doc.getElementsByClassName("more-reocrd-list-itme")[0];
		this.stopBtn = doc.getElementsByClassName("stop-record-btn")[0];

		tool.addEvent(this.triggerBtn, "click", function() {
			var _record = dataContainer.get('record');
			if(_record) {
				self.stop();
			} else {
				self.start();
			}
		});

		tool.addEvent(this.stopBtn, "click", function() {
			self.stop();
		});
	};

	Record.prototype = {
		constructor: Record,
		start: function() {
			tool.removeClass(this.recordHint, "hidden");
			this.triggerBtn.innerHTML = "停止录制";
			dataContainer.set("record", true);
		},
		stop: function() {
			tool.addClass(this.recordHint, "hidden");
			this.triggerBtn.innerHTML = "开始录制";
			dataContainer.set("record", false);
		}
	};

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["record"] = new Record();
})(window)