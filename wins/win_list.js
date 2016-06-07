(function(global) {
	"use strict"
	var tool = global.vm.module["tool"],
		baseConfig = {
			id: "",
			header: true,
			footer: true,
			title: "提示",
			width: "auto",
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
		footerHtml = "<div class='btn-wrap'>$BTNS$</div>",
		closeBtnHtml = "<button class='btn btn-close ml10'>关闭</button>",
		sureBtnHtml = "<button class='btn btn-primary btn-sure ml10'>确定</button>";

	var Win = function() {
		this.name = "Win";
		var self = this;

		this.init = function() {
			var options = self.options,
				btns = "";

			if(options.sureBtn) btns += sureBtnHtml;
			if(options.closeBtn) btns += closeBtnHtml;

			var winHtml = baseHtml.replace("$DIALOGID$", options.winId)
					.replace("$HEADER$", options.header?headerHtml:"")
					.replace("$TITLE$", options.title)
					.replace("$CONTENT$", options.content || document.getElementById(options.id).innerHTML)
					.replace("$FOOTER$", options.footer?footerHtml:"")
					.replace("$BTNS$", btns);

			tool.insertHTML(doc.body, "BeforeEnd", winHtml);

			var winObj = doc.getElementById(options.winId),
				closeBtn = winObj.getElementsByClassName("btn-close")[0],
				sureBtn = winObj.getElementsByClassName("btn-sure")[0];
			self.contentObj = winObj.getElementsByClassName("dialog-content-wrap")[0];
			self.winObj = winObj;

			if(closeBtn) {
				tool.addEvent(closeBtn, "click", function() {
					options.beforeClose.call(self);
					self.close();
				});
			}

			if(sureBtn) {
				tool.addEvent(sureBtn, "click", function() {
					options.sure.call(self);
				});
			}

			if(options.mask && !mask) {
				mask = doc.createElement("DIV");
				mask.className = "dialog-mask hide";
				doc.body.appendChild(mask);
			}
		};
	};

	Win.prototype = {
		constructor: Win,
		open: function(content, type) {
			var self = this,
				options = self.options;

			if(options.isShow) return ;

			if(options.mask) {
				tool.replaceClass(mask, "hide", "show");
				maskCount++;
			}

			if(!isNaN(options.width)) {
				self.winObj.style.width = options.width + "px";
			}

			if(!isNaN(options.height)) {
				self.winObj.style.height = options.height + "px";
			}

			if(content) {
				if("append"===type) {
					tool.insertHTML(self.contentObj, "BeforeEnd", content);
				} else {
					self.contentObj.innerHTML = content;
				}
			}

			tool.replaceClass(self.winObj, "dialog-hide", "dialog-show");

			self.rePosition();

			if(options.auto) {
				setTimeout(function() {
					self.close();
				}, options.time);
			}

			tool.addEvent(window, "resize", function() {
				if(options.isShow) {
					self.rePosition();
				}
			});

			options.isShow = true;
		},
		close: function() {
			var self = this,
				options = self.options;

			if(!options.isShow) return ;

			tool.replaceClass(self.winObj, "dialog-show", "dialog-hide");
			self.winObj.style.cssText = "";

			if(options.mask && maskCount>0) {
				if(0===--maskCount) {
					tool.replaceClass(mask, "show", "hide");
				}
			}

			options.isShow = false;
		},
		rePosition: function() {
			var self = this,
				options = self.options,
				bodyWidth = doc.body.clientWidth,
				bodyHeight = doc.body.clientHeight,
				dialogWidth = self.winObj.offsetWidth,
				dialogHeight = self.winObj.offsetHeight,
				_left = 0,
				_top = 0;

			if("notice"!==self.name) {
				_left = (bodyWidth-dialogWidth)/2>=0?(bodyWidth-dialogWidth)/2:0;
				_top = (bodyHeight-dialogHeight)/2>=0?(bodyHeight-dialogHeight)/2:0;
			} else {
				switch(options.position) {
					case 1 :
						_left = 0, _top = bodyHeight - dialogHeight;
					break;
					case 2:
						_left = 0, _top = 0;
					break;
					case 3:
						_left = bodyWidth - dialogWidth, _top = 0;
					break;
					case 4:
						_left = bodyWidth - dialogWidth, _top = bodyHeight - dialogHeight;
				}
			}
			self.winObj.style.left = _left + "px";
			self.winObj.style.top = _top + "px";
		}
	};

	var Alert = function(opts) {
		Win.call(this);
		this.name = "Alert";
		this.options = tool.deepCopy(baseConfig, {});
		this.options = tool.deepCopy(opts, this.options);
		this.options.winId = "myAlert_" + alertCount++;
		this.init();
	};
	Alert.prototype = new Win();

	var Confirm = function(opts) {
		Win.call(this);
		this.name = "Confirm";
		this.options = tool.deepCopy(baseConfig, {});
		this.options.closeBtn = true;
		this.options = tool.deepCopy(opts, this.options);
		this.options.winId = "myConfirm_" + confirmCount++;
		this.init();
	};
	Confirm.prototype = new Win();

	var Notice = function(opts) {
		Win.call(this);
		this.name = "Notice";
		this.options = tool.deepCopy(baseConfig, {});
		this.options.footer = false;
		this.options = tool.deepCopy(opts, this.options);
		this.options.winId = "myNotice_" + noticeCount++;
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