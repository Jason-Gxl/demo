var hdPlugin = (function(win) {
	var sHdPlugin = '<object id="&PLUGINID&" type="application/x-codyymultihd" width="100%" height="100%"><param name="onload" value="&HDPLUGINLOADEDFN&"/><param name="pluginType" value="&PLUGINTYPE&"/></object>';
	var config = {
		id: "myHdPlugin",
		pluginLoadedFn: "hdPluginloaded",
		pluginType: "publisher",
		videoFPS: 25,
		classroomId: "",
		userId: "",
		localRecord: 1,
		events: []
	};

	var copyConfig = function(config, opt) {
		for(var key in config) {
			var val = config[key];
			if("[object Array]"==Object.prototype.toString.call(val)) {
				opt[key] = [];
				copyConfig(config[key], opt[key]);
			} else if("[object Object]"==Object.prototype.toString.call(val)) {
				opt[key] = {};
				copyConfig(config[key], opt[key]);
			} else {
				opt[key] = "undefined"!=typeof opt[key]?opt[key]:config[key];
			}
		}
	};

	var bindEvent = function(target, type, fn, useCapturn) {
		if(win.addEventListener) {
			target.addEventListener("common", function(name, res) {
				var ev = arguments[0] || win.event;
				fn.call(this, ev);
			}, useCapturn||false);
		} else {
			target.attachEvent("on"+"common", function(res) {
				var ev = arguments[0] || win.event;
				fn.call(this, ev);
			});
		}
	};

	function _hdPlugin(opt) {
		var self = this;
		var wrap = document.querySelector("#"+opt.id) || document.getElementById(opt.id);
		if("undefined"==typeof wrap) return ;
		copyConfig(config, opt);
		var _sHdPlugin = sHdPlugin.replace(/&PLUGINID&/g, opt.pluginId),
			_sHdPlugin = _sHdPlugin.replace(/&HDPLUGINLOADEDFN&/g, opt.pluginLoadedFn),
			_sHdPlugin = _sHdPlugin.replace(/&PLUGINTYPE&/g, opt.pluginType);

		win[opt.pluginLoadedFn] = function() {
			var plugin = document.getElementById(opt.pluginId);
			self.plugin = plugin;
			//run前的参数
			plugin.videoFPS = opt.videoFPS;
			plugin.classroomId = opt.classroomId;
			plugin.userId = opt.userId;
			plugin.localRecord = opt.localRecord;
			//run前的函数
			plugin.SetRtmpUrl(opt.rtmpUrl);
			plugin.SetRtmpStream(opt.streamUrl);
			//绑定事件
			var len = opt.events.length;
			while(len--) {
				var eventObj = events[len];
				bindEvent(plugin, eventObj.name, eventObj.fn);
			}
			self.run();
		};
		wrap.innerHTML = _sHdPlugin;
	}

	_hdPlugin.prototype = {
		constructor: _hdPlugin,
		setParam: function(param) {
			var self = this;
			var plugin = self.plugin;
			for(var paramKey in param) {
				plugin[paramKey] = param[paramKey];
			}
		},
		getParam: function(paramName) {
			var self = this;
			var plugin = self.plugin;
			return plugin[paramName];
		},
		run: function() {
			this.plugin.Run();
		}
	};

	return {
		init: function(opt) {
			if(!opt || !opt.id || !opt.pluginId) return ;
			return new _hdPlugin(opt);
		}
	}
})(window);