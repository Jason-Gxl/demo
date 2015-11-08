(function(win) {
	var doc = win.document;
	var objs = [];
	win.ELES = objs;

	// document监控器
	var docWatch = function() {
		if("complete"!=doc.readyState) return ;
		var allEl = EF.getAllEl();
		for(var i=0, len=allEl.length; i<len; i++) {
			CC(allEl[i]);
		}
	};

	//创建组件
	var CC = function(el) {
		if(!el) return ;
		switch (el.tagName) {
			case "CODYY-SELECT":
				var obj = new CSelect(el);
				objs.push(obj);
				break;
			case "CODYY-PROGRESS":
				var obj = new CProgress(el);
				objs.push(obj);
				break;
		}
	};

	//
	var EF = {
		"getAllEl": function() {
			var els = [];
			var _els = doc.all || doc.getElementsByTagName("*") || [];
			for(var i=0, len=_els.length; i<len; i++) {
				if(_els[i].nodeType==1) {
					els.push(_els[i]);
				}
			}
			return els;
		},
		"create": function(tagName) {
			return doc.createElement(tagName);
		},
		"addClass": function(el, classname) {
			el.className = trim(el.className) + " " + trim(classname);
		},
		"removeClass": function(el, classname) {
			var oldClassList = el.className.split(/\s*/) || [];
			var removeClassList = classname.split(/\s*/) || [];
			for(var i=0; i<oldClassList.length; ) {
				var count = 0;
				var oldClass = oldClassList[i];
				for(var j=0,len=removeClassList.length; j<len; j++) {
					var removeClass = removeClassList[j];
					if(oldClass==removeClass) {
						count++;
					}
				}
				if(count>0) {
					oldClassList.splice(i, 1);
				} else {
					i++;
				}
			}
			el.className = oldClassList.join(" ");
		},
		"replaceClass": function(el, oldClass, newClass) {
			el.className = el.className.replace(trim(oldClass), trim(newClass));
		},
		"reAttr": function(el, attrName) {
			el.removeAttribute(attrName);
		},
		"setAttr": function(el, attrName, attrValue) {
			el.setAttribute(attrName, attrValue);
		},
		"getAttr": function(el, attrName) {
			return el.getAttribute(attrName);
		},
		"append": function(parent, child) {
			parent.appendChild(child);
		},
		"getRect": function(el) {
			return el.getBoundingClientRect();
		}
	};

	var trim = function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	};

	var events = {
		"add": function(el, ev, fn, flag) {
			if(win.addEventListener) {
				el.addEventListener(ev, fn, flag||false);
			} else {
				el.attachEvent("on"+ev, fn);
			}
		},
		"remove": function(el, ev, fn, flag) {
			if(win.addEventListener) {
				el.removeEventListener(ev, fn, flag||false);
			} else {
				el.detachEvent("on"+ev, fn);
			}
		}
	};

	var dragEvent = function(el, type, pos, callBacks) {
		this._el = el;
		this._callBacks = callBacks;
		this.type = type;
		this.pos = pos;
		this.moveParam = 0;
		this.init();
	};

	dragEvent.prototype = {
		"constructor": this,
		"init": function() {
			var self = this;
			self.leftBalance = 0;
			self.topBalance = 0;
			self._start = function() {
				self.start();
			};
			self._stop = function() {
				self.stop();
			};
			events.add(self._el, "mousedown", self._start);
		},
		"start": function() {
			var e = arguments[0] || win.event;
			var self = this;
			self.moveParam = 1;
			var elRect = EF.getRect(self._el);
			var mousePos = {
				"top": e.clientY,
				"left": e.clientX
			};
			self.leftBalance = mousePos.left - elRect.left;
			self.topBalance = mousePos.top - elRect.top;
			if(self._callBacks["start"]) self._callBacks["start"].call(self);
			self._moveEventLin = function() {
				self.move();
			};
			events.add(doc, "mousemove", self._moveEventLin);
		},
		"move": function() {
			var e = arguments[0] || win.event;
			var self = this;
			var dist = 0;
			if(self.move) {
				if("H"==self.type) {
					dist = Math.max(0, Math.min(e.clientX-self.pos.start, self.pos.end));
					self._el.style.left = dist + "px";
				} else {
					dist = Math.max(0, Math.min(e.clientY-self.pos.start, self.pos.end));
					self._el.style.top = dist + "px";
				}
			}
			var percent = dist/self.pos.end;
			if(self._callBacks["move"]) self._callBacks["move"].call(self, dist, percent);
			events.add(doc, "mouseup", self._stop);
		},
		"stop": function() {
			var e = arguments[0] || win.event;
			var self = this;
			self.moveParam = 0;
			if(self._callBacks["stop"]) self._callBacks["stop"].call(self);
			events.remove(doc, "mousemove", self._moveEventLin);
		}
	};



	/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝创建下拉框＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
	var CSelect = function(el) {
		var self = this;
		self.element = el;
		var opts = {};
		opts.dataList = eval(EF.getAttr(el, "list") || []);
		EF.reAttr(el, "list");
		opts.name = EF.getAttr(el, "name");
		EF.reAttr(el, "name");
		opts.classname = el.className;
		EF.reAttr(el, "class");
		opts._id = el.id;
		EF.reAttr(el, "id");
		opts.showParam = EF.getAttr(el, "showParam");
		EF.reAttr(el, "showParam");
		opts.val = EF.getAttr(el, "val");
		EF.reAttr(el, "val");
		opts.placeholder = EF.getAttr(el, "placeholder");
		EF.reAttr(el, "placeholder");
		opts._value = EF.getAttr(el, "value") || "";
		EF.reAttr(el, "value");
		self.opts = opts;
		_CSelect(self);
	};

	CSelect.prototype = {
		"constructor": this,
		"setOptions": function(dataList, type) {
			if(!dataList) return;
			var self = this;
			var select = self.select;
			var opts = self.opts;
			if("NEW"==type) select.innerHTML = "";
			var option = EF.create("OPTION");
			EF.setAttr(option, "value", "");
			option.innerHTML = opts.placeholder || "请选择";
			EF.append(select, option);
			for(var i=0,len=dataList.length; i<len; i++) {
				var option = EF.create("OPTION");
				EF.setAttr(option, "value", dataList[i][opts.val])
				option.innerHTML = dataList[i][opts.showParam];
				EF.append(select, option);
			}
		}
	};

	var _CSelect = function(obj) {
		var el = obj.element;
		var opts = obj.opts;
		var wrap = EF.create("DIV");
		EF.addClass(wrap, "codyy_select_wrap");
		EF.append(el, wrap);
		var input = EF.create("INPUT");
		EF.addClass(input, opts.classname + " cur_selected");
		if(trim(opts._value)) {
			for(var i=0,len=opts.dataList.length; i<len; i++) {
				if(opts.dataList[i][opts.val]==opts._value) {
					input.value = opts.dataList[i][opts.showParam];
					break;
				}
			}
		} else {
			input.value = trim(opts.placeholder) || "请选择";
		}
		EF.append(wrap, input);
		var select = EF.create("select");
		select.id = opts._id;
		EF.addClass(select, opts.classname + " codyy_select");
		EF.setAttr(select, "name", opts.name);
		if(opts._value) select.value = opts._value;
		select.onchange = function() {
			if(!this.value) {
				input.value = trim(opts.placeholder) || "请选择";
				return ;
			}
			for(var i=0,len=opts.dataList.length; i<len; i++) {
				if(opts.dataList[i][opts.val]==this.value) {
					input.value = opts.dataList[i][opts.showParam];
					break;
				}
			}
		};
		EF.append(wrap, select);
		obj.select = select;
		obj.setOptions(opts.dataList, "NEW");
	};
	/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝创建下拉框＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/

	/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝创建播放器进度条＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
	var CProgress = function(el) {
		if(!el) return ;
		var self = this;
		self.element = el;
		self.opts = {
			"_fn": {
				"startDrag": EF.getAttr(el, "startDrag"),
				"duringDrag": EF.getAttr(el, "duringDrag"),
				"stopDrag": EF.getAttr(el, "stopDrag"),
				"pause": EF.getAttr(el, "pause"),
				"stop": EF.getAttr(el, "stop"),
				"shutVoice": EF.getAttr(el, "shutVoice"),
				"openVoice": EF.getAttr(el, "openVoice")
			},
			"time": EF.getAttr(el, "time") || 0,
			"totalTime": EF.getAttr(el, "totalTime") || 0,
			"voice": EF.getAttr(el, "voice") || 70,
			"voiceTotal": EF.getAttr(el, "voiceTotal") || 100
		};
		var obj = new _CProgress(self);
		obj.build();
		obj.init();
		obj.bind();
		return self;
	}

	var _CProgress = function(obj) {
		var self = this;
		self._el = obj.element;
		self._fn = {
			"startDrag": obj.opts._fn.startDrag,
			"duringDrag": obj.opts._fn.duringDrag,
			"stopDrag": obj.opts._fn.stopDrag,
			"pause": obj.opts._fn.pause,
			"stop": obj.opts._fn.stop,
			"openVoice": obj.opts._fn.openVoice,
			"shutVoice": obj.opts._fn.shutVoice
		};
		self.time = obj.opts.time;
		self.totalTime = obj.opts.totalTime;
		self.voice = obj.opts.voice;
		self.voiceTotal = obj.opts.voiceTotal;
	};

	_CProgress.prototype = {
		"constructor": this,
		"build": function() {
			var self = this;

			var proWrap = EF.create("DIV");
			EF.addClass(proWrap, "progress_wrap")
			var proBkg = EF.create("DIV");
			EF.addClass(proBkg, "progress_bkg");
			EF.append(proWrap, proBkg);
			
			var proBarWrap = EF.create("DIV");
			EF.addClass(proBarWrap, "pro_bar_wrap");
			var proBar = EF.create("DIV");
			EF.addClass(proBar, "pro_bar");
			var proBtn = EF.create("SPAN");
			EF.addClass(proBtn, "pro_btn");
			var proBarBkg = EF.create("DIV");
			EF.addClass(proBarBkg, "pro_bar_bkg");
			EF.append(proBarWrap, proBarBkg);
			EF.append(proBarWrap, proBar);
			EF.append(proBarWrap, proBtn);
			EF.append(proWrap, proBarWrap);

			var ctrlWrap = EF.create("DIV");
			EF.addClass(ctrlWrap, "ctrl_wrap");
			var pause = EF.create("I");
			EF.addClass(pause, "pause_btn");
			var stop = EF.create("I");
			EF.addClass(stop, "stop_btn");
			EF.append(ctrlWrap, pause);
			EF.append(ctrlWrap, stop);
			EF.append(proWrap, ctrlWrap);

			var audioWrap = EF.create("DIV");
			EF.addClass(audioWrap, "audio_wrap");
			var trumpet = EF.create("I");
			EF.addClass(trumpet, "trumpet");
			var audioBarWrap = EF.create("DIV");
			EF.addClass(audioBarWrap, "audio_bar_wrap");
			var audioBar = EF.create("DIV");
			EF.addClass(audioBar, "audio_bar");
			var audioBtn = EF.create("SPAN");
			EF.addClass(audioBtn, "audio_btn");
			var audioBarBkg = EF.create("DIV");
			EF.addClass(audioBarBkg, "audio_bar_bkg");
			EF.append(audioBarWrap, audioBarBkg);
			EF.append(audioBarWrap, audioBar);
			EF.append(audioBarWrap, audioBtn);
			EF.append(audioWrap, trumpet);
			EF.append(audioWrap, audioBarWrap);
			EF.append(proWrap, audioWrap);

			EF.append(self._el, proWrap);

			var proBarWrapRect = EF.getRect(proBarWrap);
			var proBtnRound = {
				"start": proBarWrapRect.left,
				"end": proBarWrapRect.width - proBtn.offsetWidth
			};
			new dragEvent(proBtn, "H", proBtnRound, {
				"start": self._fn["start"],
				"move": function(dist, percent) {
					proBar.style.width = dist + "px";
					if(self._fn["move"]) self._fn["move"].call(self);
				},
				"stop": self._fn["stop"]
			});

			var audioBarWrapRect = EF.getRect(audioBarWrap);
			var audioBtnRound = {
				"start": audioBarWrapRect.left,
				"end": audioBarWrapRect.width - audioBtn.offsetWidth
			};

			new dragEvent(audioBtn, "H", audioBtnRound, {
				"start": function() {},
				"move": function(dist, percent) {
					audioBar.style.width = dist + "px";
				},
				"stop": function() {}
			});

			self._pmd = proBarWrap.offsetWidth - proBtn.offsetWidth;
			self._vmd = audioBarWrap.offsetWidth - audioBtn.offsetWidth;
			self.proBar = proBar;
			self.proBtn = proBtn;
			self.audioBtn = audioBtn;
			self.audioBar = audioBar;
			self.pause = pause;
			self.stop = stop;
			self.trumpet = trumpet;
			self.audioBar = audioBar;
			self.audioBtn = audioBtn;
		},
		"init": function() {
			var self = this;
			var pmd = self.totalTime>0?(self.time/self.totalTime)*self._pmd:0;
			self.proBtn.style.left = pmd + "px";
			self.proBar.style.width = pmd + "px";
			var vmd = self.voiceTotal>0?(self.voice/self.voiceTotal)*self._vmd:0;
			self.audioBtn.style.left = vmd + "px";
			self.audioBar.style.width = vmd + "px";
			self.v = 1;
			if(vmd<=0) {
				EF.replaceClass(self.trumpet, "trumpet", "notrumpet");
				self.v = 0;
			}
		}, 
		"bind": function() {
			var self = this;
			self.pause.onclick = function() {
				try {
					window[self._fn.pause].call(self);
				} catch (e) {
					console.log("pause外部函数未定义");
				}
			};

			self.stop.onclick = function() {
				try {
					window[self._fn.stop].call(self);
				} catch (e) {
					console.log("stop外部函数未定义");
				}
			}

			self.trumpet.onclick = function() {
				if(self.v) {
					EF.replaceClass(this, "trumpet", "notrumpet");
					self.audioBar.style.width = 0;
					self.audioBtn.style.left = 0;
					try {
						window[self._fn.shutVoice].call(this);
					} catch (e) {
						console.log("shutVoice外部函数未定义");
					}
					self.v = 0;
				} else {
					var vmd = self.voiceTotal>0?(self.voice/self.voiceTotal)*self._vmd:0;
					if(vmd<=0) return ;
					EF.replaceClass(this, "notrumpet", "trumpet");
					self.audioBtn.style.left = vmd + "px";
					self.audioBar.style.width = vmd + "px";
					try {
						window[self._fn.openVoice].call(this);
					} catch (e) {
						console.log("openVoice外部函数未定义");
					}
					self.v = 1;
				}
			};
		}
	};
	/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝创建播放器进度条＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/

	doc.onreadystatechange = docWatch;
})(window)