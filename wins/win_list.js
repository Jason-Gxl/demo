(function(global) {
	"use strict"
	var tool = global.vm.module["tool"],
		baseConfig = {
			id: "",
			header: true,
			footer: true,
			title: "提示",
			width: 350,
			height: "auto",
			auto: false,
			time: 3000,
			content: "",
			position: 4,
			mask: false,
			isShow: false,
			closeBtn: false,
			sureBtn: true,
			beforeClose: function() {},
			sure: function() {}
		};

	var alertCount = 0,
		confirmCount = 0,
		noticeCount = 0,
		mask = null,
		maskCount = 0,
		doc = window.document;

	var baseHtml = "\
			<div id='$DIALOGID$' class='dialog-wrap dialog-hide'>\
				$HEADER$\
				<div class='dialog-content-wrap'>$CONTENT$</div>\
				$FOOTER$\
			</div>";

	var headerHtml = "<div class='dialog-title-wrap'><h2 class='dialog-title'>$TITLE$</h2></div>",
		footerHtml = "<div class='btn-wrap'>$BTNS$</div>";

	var Win = function() {
		this.name = "Win";

		this.init = function() {
			
		};
	};

	Win.prototype = {
		constructor: Win,
		open: function(content) {},
		close: function() {}
	};

	var Alert = function(opts) {
		Win.call(this);
		this.name = "Alert";
		this.options = tool.deepCopy(baseConfig, {});
		this.options = tool.deepCopy(opts, this.options);
		this.init();
	};
	Alert.prototype = new Win();

	var Confirm = function(opts) {
		Win.call(this);
		this.name = "Confirm";
		this.options = tool.deepCopy(baseConfig, {});
		this.options.closeBtn = true;
		this.options = tool.deepCopy(opts, this.options);
		this.init();
	};
	Confirm.prototype = new Win();

	var Notice = function(opts) {
		Win.call(this);
		this.name = "Notice";
		this.options = tool.deepCopy(baseConfig, {});
		this.options.footer = false;
		this.options = tool.deepCopy(opts, this.options);
		this.init();
	};
	Notice.prototype = new Win();

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["win"] = {
		alert: function(opts) {
			return new Alert(opts);
		},
		confirm: function(opts) {
			return new Confirm(opts);
		},
		notice: function(opts) {
			return new Notice(opts);
		}
	};
})(window)