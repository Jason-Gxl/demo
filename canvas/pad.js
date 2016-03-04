!function(win) {
	var config = {
		canvasId: "myCanvas",
		classname: "myCanvas",
		width: 500,
		height: 500,
		lineWidth: 1,
		content: "您的浏览器不支持canvas"
	};
	var sCanvas = "<div class='pad_wrap'><ul class='pad_bar'><li class='pad_bar_item hide' item='pen'>pen</li><li class='pad_bar_item hide' item='try'>try</li></ul><canvas id='&CANVASID&' width='&CANVASWIDTH&' height='&CANVASHEIGHT&' class='&CANVASCLASS&'>&CONTENT&</canvas></div>"

	var copy = function(oldVal, newVal) {
		var toString = Object.prototype.toString;
		for(var key in newVal) {
			if("[object Array]"==toString.call(newVal[key])) {
				oldVal[key] = [];
				copy(oldVal[key], newVal[key]);
			} else if("[object Object]"==toString.call(newVal[key])) {
				oldVal[key] = {};
				copy(oldVal[key], newVal[key]);
			} else {
				if("undefined"!=typeof newVal[key]) {
					oldVal[key] = newVal[key];
				}
			}
		}
	};

	var ele = {
		addEvent: function(target, type, fn, useCapturn) {
			if(win.addEventListener) {
				target.addEventListener(type, function() {
					var ev = arguments[0] || win.event;
					fn.call(this, ev);
				}, useCapturn||false);
			} else {
				target.attachEvent("on"+type, function() {
					var ev = arguments[0] || win.event;
					fn.call(this, ev);
				});
			}
		},
		delEvent: function(target, type, fn, useCapturn) {
			if(win.addEventListener) {
				target.removeEventListener(type, fn, useCapturn||false);
			} else {
				target.detachEvent("on"+type, fn);
			}
		},
		getRect: function(target) {
			var rect = target.getBoundingClientRect();
			if(!rect.height) rect.height = target.offetHeight;
			return rect;
		}
	};

	var pad = (function() {
		var _config = {}, wrap = {}, cursor = "default";

		var toolBar = {
			init: function(obj) {
				var config = obj.config;
				var bars = obj.wrap.getElementsByClassName("pad_bar_item");
				var _bars = config.bars;
				obj.bars = obj.bars || [];
				var len = bars.length;
				while(len--) {
					if(_bars.indexOf(bars[len].getAttribute("item"))!=-1) {
						bars[len].className = bars[len].className.replace("hide", "").replace(/(^\s*)|(\s*$)/g, "");
						obj.bars.push(bars[len]);
					}
				}
				this.bind(obj);
			},
			bind: function(obj) {
				var bars = obj.bars;
				var pad = obj.canvasObj;
				var len = bars.length;
				while(len--) {
					ele.addEvent(bars[len], "click", function() {
						if(-1==this.className.indexOf("on")) {
							this.className = this.className.replace(/(^\s*)|(\s*$)/g, "") + " on";
						}
						var l = bars.length;
						while(l--) {
							if(bars[l]!=this) {
								bars[l].className = bars[l].className.replace("on", "").replace(/(^\s*)|(\s*$)/g, "");
							}
						}
						cursor = this.getAttribute("item");
						obj.cursor = cursor;
						if(-1==pad.className.indexOf(cursor) && "default"!=cursor) {
							pad.className = config.classname + " " + cursor;
						}
					});
				}
			}
		};

		var _pad = function(opt) {
			var self = this;
			wrap = document.querySelector("#"+opt.id) || document.getElementById(opt.id);
			if(!wrap) return ;
			copy(_config, config);
			copy(_config, opt);
			self.config = _config;
			self.wrap = wrap;
			self.init();
		};

		_pad.prototype = {
			constructor: _pad,
			init: function() {
				var self = this;
				var canvasEle = sCanvas.replace(/&CANVASID&/g, self.config.canvasId).replace(/&CANVASWIDTH&/g, self.config.width).replace(/&CANVASHEIGHT&/g, self.config.height).replace(/&CANVASCLASS&/g, self.config.classname).replace(/&CONTENT&/g, self.config.content);
				self.wrap.innerHTML = canvasEle;
				var pad = document.querySelector("#"+self.config.canvasId) || document.getElementById(self.config.canvasId);
				self.canvasObj = pad;
				pad.width = self.config.width;
				pad.height = self.config.height;
				var padContext = pad.getContext("2d");
				padContext.lineWidth = self.config.lineWidth;
				self.points = [];
				toolBar.init(self);

				ele.addEvent(pad, "mousedown", function() {
					pad.onmousemove = function() {
						console.log(1);
					};
				});

				ele.addEvent(pad, "mouseup", function() {
					pad.onmousemove = null;
				});
			},
			setOption: function(opt) {
				copy(self.config, opt);
			},
			getOption: function() {
				console.log(self.config);
			},
			draw: function(points) {

			}
		};

		return _pad;
	})();

	win.pad = {
		init: function(opt) {
			if("undefined"==typeof(opt) || "undefined"==typeof(opt.id)) return ;
			return new pad(opt);
		}
	}
}(window);