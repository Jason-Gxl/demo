(function(global) {
	"use strict"
	var templete = "\
			<i class='icon icon-$TYPE$ fl mr5' id='$TYPE$_switch'></i> \
			<span class='sound-control-wrap' id='$TYPE$_control_wrap'>\
				<i class='icon icon-sound-control' id='control_$TYPE$'></i>\
				<span class='control-color' id='$TYPE$_control_color'></span>\
				<span class='control-bkg' id='$TYPE$_control_bkg'></span>\
			</span>";
		var tool = global.vm.module["tool"],
			dataContainer = global.vm.module["dataContainer"];

	var SoundControl = function() {
		this.name = "SoundControl";
		var self = this;
		self.controlWrapInfo = {},
		self.controlBtnInfo = {},
		self.distance = 0;

		var move = function() {
			var e = arguments[0] || window.event;
			var x = e.clientX - self.controlWrapInfo.x - self.distance;
			var _x = x<=0?0:(x>=self.controlWrapInfo.w-self.controlBtnInfo.w?self.controlWrapInfo.w-self.controlBtnInfo.w:x);
			var v = _x/(self.controlWrapInfo.w-self.controlBtnInfo.w)*100>>0;
			self.setSound(v, _x);
		};

		this.init = function() {
			var opts = self.options,
				tmpl = templete.replace(/\$TYPE\$/g, opts.type),
				wrap = global.document.getElementById(opts.id);

			wrap.insertAdjacentHTML("afterBegin", tmpl);
			self[opts.type+"Switch"] = document.getElementById(opts.type + "_switch");
			self["controlColor"] = document.getElementById(opts.type + "_control_color");
			self["controlBtn"] = document.getElementById("control_" + opts.type);
			var controlWrap = document.getElementById(opts.type + "_control_wrap");
			self.controlWrapInfo = {
				w: controlWrap.clientWidth,
				h: controlWrap.clientHeight,
				x: controlWrap.offsetLeft,
				y: controlWrap.offsetTop
			};
			self.controlBtnInfo = {
				w: self.controlBtn.offsetWidth,
				h: self.controlBtn.offsetHeight 
			};

			tool.addEvent(self[opts.type+"Switch"], "click", function() {
				if(dataContainer.getInterimData("hasDialogShow")) return ;
				var e = arguments[0] || window.event;
				var shut = dataContainer.getInterimData(opts.type + "Shut");
				if(opts.switchClick) {
					opts.switchClick.call(self, shut?dataContainer.getInterimData(opts.type):0);
				}
				if(!shut) {
					tool.replaceClass(this, "icon-"+opts.type, "icon-" + opts.type + "-shut");
				} else {
					tool.replaceClass(this, "icon-" + opts.type + "-shut", "icon-"+opts.type);
				}
				dataContainer.setInterimData(opts.type+"Shut", !shut);
			});

			tool.addEvent(self.controlBtn, "mousedown", function() {
				if(dataContainer.getInterimData("hasDialogShow")) return ;
				var e = arguments[0] || window.event;
				self.controlBtnInfo.x = this.offsetLeft;
				self.controlBtnInfo.y = this.offsetTop;
				self.distance = e.clientX - self.controlWrapInfo.x - self.controlBtnInfo.x;
				if(window.addEventListener) {
					window.document.addEventListener("mousemove", move, false);
				} else {
					window.document.attachEvent("mousemove", move);
				}
				e.preventDefault();
				e.stopPropagation();
			});

			tool.addEvent(window.document, "mouseup", function() {
				var e = arguments[0] || window.event;
				tool.delEvent(window.document, "mousemove", move);
				e.preventDefault();
				e.stopPropagation();
			});
		};
	};

	SoundControl.prototype = {
		constructor: SoundControl,
		setSound: function(v, _x) {
			var self = this,
				opts = self.options,
				controlBtn = self.controlBtn,
				controlColor = self.controlColor,
				controlBtnInfo = self.controlBtnInfo,
				controlWrapInfo = self.controlWrapInfo,
				_x = _x || v/100*(controlWrapInfo.w-controlBtnInfo.w);

			controlBtn.style.left = _x + "px";
			controlColor.style.width = _x + controlBtnInfo.w + "px";
			opts.drag.call(self, v);

			if(v<=0) {
				if(!dataContainer.getInterimData(opts.type+"Shut")) {
					tool.replaceClass(self[opts.type+"Switch"], "icon-"+opts.type, "icon-" + opts.type + "-shut");
					dataContainer.setInterimData(opts.type+"Shut", true);
				}
			} else {
				if(dataContainer.getInterimData(opts.type+"Shut")) {
					tool.replaceClass(self[opts.type+"Switch"], "icon-" + opts.type + "-shut", "icon-"+opts.type);
					dataContainer.setInterimData(opts.type+"Shut", false);
				}
			}

			dataContainer.setInterimData(opts.type, v);
		}
	};

	var Microphone = function(opts) {
		SoundControl.call(this);
		this.name = "Microphone";
		this.options = opts;

		this.init();
	};

	Microphone.prototype = new SoundControl();

	var Earphone = function(opts) {
		SoundControl.call(this);
		this.name = "Earphone";
		this.options = opts;

		this.init();
	};

	Earphone.prototype = new SoundControl();

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["soundControl"] = {
		init: function(opts) {
			if(!opts.id || !opts.type) return ;
			return "microphone"===opts.type?new Microphone(opts):new Earphone(opts);
		}
	};
})(window)