(function(global) {
	"use strict"

	var pluginStr = "<object id='hdPlugin' type='application/x-codyymultihd' width='100%' height='100%'><param name='onload' value='$HDPLUGINLOADED$'/></object>",
		tool = global.vm.module["tool"],
		version = 6,
		baseConfig = {
			directorMode: 1,
			classroomId: tool.random() + "",
			classroomName: tool.random() + "",
			videoFPS: 25,
			videoBitrate: 350,
			spkVolume: 70,
			micVolume: 70,
			localRecord: false,
			userId: tool.random() + "",
			regionId: tool.random(),
			videoStitchMode: 1,
			resolution: "1920*1080",
			recordFileType: 1,
			recordFilePath: "",
			recordFileName: "",
			aloneOnline: 0,
			renderHwnd: [0, 0, 0, 0, 0, 0]
		};

	var pluginLoaded_v5 = function(opts) {
		var self = this;
		var opts = self.options = tool.deepCopy(opts, baseConfig),
			plugin = self.plugin = document.getElementById("hdPlugin");

		plugin.Run();
	};

	var pluginLoaded_v5d5 = function(opts) {
		var self = this;
		var opts = self.options = tool.deepCopy(opts, baseConfig),
			plugin = self.plugin = document.getElementById("hdPlugin");

		plugin.videoFPS = opts.videoFPS;
		plugin.localRecord = opts.localRecord;
		plugin.classroomId = opts.classroomId || tool.random();
		plugin.RegionID = opts.regionId;
		plugin.videoStitchMode = opts.videoStitchMode;
		plugin.directorMode = opts.directorMode;
		plugin.classroomName = opts.classroomName;
		plugin.recordFileType = opts.recordFileType;
		plugin.recordFilePath = opts.recordFilePath;
		plugin.recordFileName = opts.recordFileName;
		plugin.SetAloneOnline(opts.aloneOnline);

		var _resolutions = opts.resolution.split("*");
		plugin.SetResolution(+_resolutions[0], +_resolutions[1]);

		var num = plugin.GetCameraNum(), i=0;
		while(i++<num) {
			plugin.SetVideoBitrate(i, opts.videoBitrate);
			plugin.SetRenderHwnd(i, opts.renderHwnd[i]);
		}

		plugin.Run();
		plugin.spkVolume = opts.spkVolume;
		plugin.micVolume = opts.micVolume;
	};

	var pluginLoaded_v6 = function(opts) {
		var self = this;
		var opts = self.options = tool.deepCopy(opts, baseConfig),
			plugin = self.plugin = document.getElementById("hdPlugin");

		plugin.Run();
	};



// ================================================================公共类开始====================================================================================
	var PluginPublish = function() {
		this.name = "PluginPublish";
	};

	PluginPublish.prototype = {
		constructor: PluginPublish,
		init: function(opts) {
			var self = this,
				opts = tool.deepCopy(opts, baseConfig),
				wrap = document.getElementById(opts.id),
				str = pluginStr.replace("$HDPLUGINLOADED$", opts.hdPluginLoaded || "hdPluginLoaded");

			window[opts.hdPluginLoaded || "hdPluginLoaded"] = function() {
				switch(version) {
					case 5:
					pluginLoaded_v5.call(self, opts);
					break;
					case 6:
					pluginLoaded_v5d5.call(self, opts);
					break;
					case 7:
					pluginLoaded_v6.call(self, opts);
					break;
				}
			};

			wrap.innerHTML = str;
		}
	};
// ================================================================公共类结束====================================================================================



// ================================================================CV5类开始====================================================================================
	var PluginPublish_v5 = function() {
		this.name = "PluginPublish_v5";
	};

	PluginPublish_v5.prototype = new PluginPublish();
// ================================================================CV5类结束====================================================================================



// ================================================================CV5.5类开始====================================================================================
	var PluginPublish_v5d5 = function() {
		this.name = "PluginPublish_v5d5";
	};

	PluginPublish_v5d5.prototype = new PluginPublish();

	PluginPublish_v5d5.prototype.setOrGetVideoBitrate = function(_bit) {
		if(_bit) {
			this.plugin.videoBitrate = _bit;
		} else {
			return this.plugin.videoBitrate;
		}
	};

	pluginLoaded_v5d5.prototype.setOrGetSpkVolume = function(_volume) {
		if(_volume) {
			this.plugin.spkVolume = _volume;
		} else {
			return this.plugin.spkVolume;
		}
	};

	pluginLoaded_v5d5.prototype.setOrGetMicVolume = function(_micVolume) {
		if(_micVolume) {
			this.plugin.micVolume = _micVolume;
		} else {
			return this.plugin.micVolume;
		}
	};

	pluginLoaded_v5d5.prototype.getNumberOfVideoDev = function() {
		return this.plugin.NumberOfVideoDev;
	};

	pluginLoaded_v5d5.prototype.getNumberOfAudioDev = function() {
		return this.plugin.NumberOfAudioDev;
	};

	pluginLoaded_v5d5.prototype.setAutoUpdate = function(_flag) {
		this.plugin.Update = (_flag || true);
	};

	pluginLoaded_v5d5.prototype.setOrGetVideoStitchMode = function(_mode) {
		if(_mode) {
			this.plugin.videoStitchMode = _mode;
		} else {
			return this.plugin.videoStitchMode;
		}
	};

	pluginLoaded_v5d5.prototype.setOrGetDirectorMode = function(_mode) {
		if(_mode) {
			this.plugin.directorMode = _mode;
		} else {
			return this.plugin.directorMode;
		}
	}
// ================================================================CV5.5类结束====================================================================================



// ================================================================CV6类开始====================================================================================
	var PluginPublish_v6 = function() {
		this.name = "PluginPublish_v6";
	};

	PluginPublish_v6.prototype = new PluginPublish();
// ================================================================CV6类结束====================================================================================

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["pluginPublish"] = {
		init: function(v) {
			var obj = null,
				v = v || 6,
				version = v;

			switch(v) {
				case 5:
				obj = new PluginPublish_v5();
				break;
				case 6:
				obj = new PluginPublish_v5d5();
				break;
				case 7:
				obj = new PluginPublish_v6();
				break;
			}

			return obj;
		}
	};
})(window)