/**
 *
 *
 * 收发流插件
 * @Author Jason
 * @Date 2017-7-13
 *
 *
 *
 **/
;(function(fn, undefined) {
	"use strict";
	var plugin = {},
		publishPlugin = null,
		receivePluginTab = [],
		receivePluginObj = {},
		isUnload = false,
		cameras = {},
		audios = {},
		duang = fn.call(Object.create(null)),
		tool = duang?duang.getModule("Tool").getController("tool"):window.tool,
		url = ("https:"===location.protocol?"wss://":"ws://")+"localhost:9098";

	var addEvent = window.addEventListener?function(target, type, fn, use) {
		target.addEventListener(type, fn, use||false);
	}:function(target, fn, type) {
		target.attachEvent("on"+type, fn);
	};

	addEvent(window, "beforeunload", function() {
		isUnload = true;
	});

	addEvent(window, "DOMContentLoaded", function() {
		getUserMedias();
	});

//================发送插件开始=======================================================
	function AvPublish(params, server) {
		if(!this instanceof AvPublish) {
			return new AvPublish(params);
		}

		this.name = "AvPublish";

		for(var key in server) {
			if(server.hasOwnProperty(key)) {
				this.__proto__[key] = server[key];
			}
		}

		
	}

	AvPublish.prototype = {
		constructor: AvPublish
	};
//================发送插件结束=======================================================

//================接收插件开始=======================================================
	function AvReceive(params, server) {
		if(!this instanceof AvReceive) {
			return new AvReceive(params);
		}

		this.name = "AvReceive";

		for(var key in server) {
			if(server.hasOwnProperty(key)) {
				this.__proto__[key] = server[key];
			}
		}
	}

	AvReceive.prototype = {
		constructor: AvReceive
	};
//================接收插件结束=======================================================

//================发送插件服务开始=======================================================
	var WSPublish = (function() {
		var	ws = null, custEvent = new tool.constructor.CustomerEvent();

		var _WSPublish = function(params, callback1, callback2) {
			ws = new WebSocket(url);

			ws.onopen = function() {
				var args = [].slice.call(arguments, 0);
				ws.send(params);
				callback1 && callback1.apply(ws, args);
			};

			ws.onmessage = function() {
				var args = [].slice.call(arguments, 0);
				callback2 && callback2.apply(obj, args);
			};

			ws.onclose = function() {
				if(isUnload) return;
				_WSPublish(params, null, callback2);
			};
		};

		var _send = function(msg) {
			ws.send(msg);
		};

		var obj = Object.create({
			addEvent: custEvent.addCustEvent,
			removeEvent: custEvent.removeCustEvent,
			fireEvent: custEvent.fire,
			send: _send
		}, {init: {
			writable: false,
			configurable: false,
			enumerable: false,
			value: _WSPublish
		}});
		return obj;
	}());
//================发送插件服务结束=======================================================

//================接收插件服务开始=======================================================
	var WSReceive = (function() {
		var	ws = null, custEvent = new tool.constructor.CustomerEvent();

		var _WSReceive = function(params, callback1, callback2) {
			ws = new WebSocket(url);

			ws.onopen = function() {
				var args = [].slice.call(arguments, 0);
				ws.send(params);
				callback1 && callback1.apply(ws, args);
			};

			ws.onmessage = function() {
				var args = [].slice.call(arguments, 0);
				callback2 && callback2.apply(obj, args);
			};

			ws.onclose = function() {
				if(isUnload) return;
				_WSReceive(params, null, callback2);
			};
		};

		var _send = function(msg) {
			ws.send(msg);
		};

		var obj = Object.create({
			addEvent: custEvent.addCustEvent,
			removeEvent: custEvent.removeCustEvent,
			fireEvent: custEvent.fire,
			send: _send
		}, {init: {
			writable: false,
			configurable: false,
			enumerable: false,
			value: _WSReceive
		}});
		return obj;
	} ());
//================接收插件服务结束=======================================================

	//获取所有音视频设备，包括虚拟设备
	function getUserMedias() {
		navigator.mediaDevices.enumerateDevices().then(function(devices) {
			[].forEach.call(devices, function(device) {
				if("audioinput"===device.kind) {
					audios[device.deviceId] = device;
				}

				if("videoinput"===device.kind) {
					cameras[device.deviceId] = device;
				}
			});
		});
	}

	//发送插件初始化接口
	//此接口对外，供业务层调用初始化发送插件
	//不包括插件服务的初始化
	var avPublish = {
		init: function(params) {
			if(void(0)===params || !params.video) return;
			publishPlugin = new AvPublish(params, WSPublish);
			return publishPlugin;
		},
		getPlugin: function() {
			return publishPlugin;
		},
	};


	//接收插件初始化接口
	//此接口对外，供业务层调用初始化接收插件
	//不包括插件服务的初始化
	var avReceive = {
		init: function(params) {
			if(void(0)===params || !params.video) return;
			var plugin = new AvReceive(params, WSReceive);
			receivePluginTab.push(plugin);
			if(void(0)!==params.id) receivePluginObj[params.id] = plugin;
			return plugin;
		},
		getPluginByIndex: function(index) {
			index = index || 0;
			return receivePluginTab[index];
		},
		getPluginById: function(id) {
			if(void(0)===id) return ;
			return receivePluginObj[id];
		}
	};

	//发送插件服务相关接口
	//此接口对外，供业务层调用初始化发送插件服务
	var wsPublish = {
		init: function(params, callback) {
			if(void(0)===params) return ;
			var self = this;

			WSPublish.init.call(Object.create(null), params, callback, function() {
				var args = [].slice.call(arguments),
					arg = args.shift();
				this.fireEvent({type: arg.type, message: arg.data});
			});
		},
		addEvent: function(type, callback) {
			if(void(0)===type || void(0)===callback) return;
			WSPublish.addEvent(type, callback);
		},
		removeEvent: function(type) {
			if(void(0)===type) return;
			WSPublish.removeEvent(type);
		}
	};

	//接收插件服务相关接口
	//此接口对外，供业务层调用初始化插件服务
	var wsReceive = {
		init: function(params, callback) {
			if(void(0)===params) return ;
			var self = this;

			WSReceive.init.call(Object.create(null), params, callback, function() {
				var args = [].slice.call(arguments),
					arg = args.shift();
				this.fireEvent({type: arg.type, message: arg.data});
			});
		},
		addEvent: function(type, callback) {
			if(void(0)===type || void(0)===callback) return;
			WSReceive.addEvent(type, callback);
		},
		removeEvent: function(type) {
			if(void(0)===type) return;
			WSReceive.removeEvent(type);
		}
	};

	plugin = {
		wsPublish: wsPublish,
		wsReceive: wsReceive,
		avPublish: avPublish,
		avReceive: avReceive
	};

	!duang?(window.plugin=plugin):(function() {
		duang.module("Tool", []).directive("PluginBuilder", ["tool"], function() {
			return plugin;
		});
	}());
}(function() {
	return window.duang?window.duang:null;
}));