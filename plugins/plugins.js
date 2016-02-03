var hdPlugin = (function(win) {
	var sHdPlugin = '<object id="&PLUGINID&" type="application/x-codyymultihd" width="100%" height="100%"><param name="onload" value="hdPluginLoaded"/><param name="pluginType" value="publisher"/></object>';

	function _hdPlugin(opt) {
		var self = this;
		var wrap = document.getElementById(opt.id);
		var _sHdPlugin = sHdPlugin.replace(/&PLUGINID&/g, opt.pluginId);

		win.hdPluginLoaded = function() {
			var plugin = document.getElementById(opt.pluginId);
			self.plugin = plugin;
			//run前的参数
			if(opt.videoFPS) plugin.videoFPS = opt.videoFPS;
			if(opt.classroomId) plugin.classroomId = opt.classroomId;
			if(opt.userId) plugin.userId = opt.userId;
			if(opt.localRecord) plugin.localRecord = opt.localRecord;
			//run前的函数
			plugin.SetRtmpUrl(opt.rtmpUrl || "");
			plugin.SetRtmpStream(opt.streamUrl || "");
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
			if(!opt.id || !opt.pluginId) return ;
			return new _hdPlugin(opt);
		}
	}
})(window);