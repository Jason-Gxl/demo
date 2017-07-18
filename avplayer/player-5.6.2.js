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
	var avPublish = {},
		avReceive = {},
		wsList = [];
		websocket = window.websocket,
		duang = fn.call(Object.create(null)),
		url = ("https:"===location.protocol?"wss://":"ws://")+"localhost:9098";
	navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia  || navigator.webkitGetUserMedia || navigator.msGetUserMedia);

//================发送插件开始=======================================================
	function AvPublish(params) {
		if(!this instanceof AvPublish) {
			return new AvPublish(params);
		}

		this.name = "AvPublish";
	}

	AvPublish.prototype = {
		constructor: AvPublish
	};
//================发送插件结束=======================================================

//================接收插件开始=======================================================
	function AvReceive(params) {
		if(!this instanceof AvReceive) {
			return new AvReceive(params);
		}

		this.name = "AvReceive";
	}

	AvReceive.prototype = {
		constructor: AvReceive
	};
//================接收插件结束=======================================================

	function createWebsocket(num, url) {
		var ws = new websocket(url);

		ws.onopen = function() {};

		ws.onmessage = function() {};

		ws.onclose = function() {};

		ws.onerror = function() {
			ws.close();
			createWebsocket(num, url);
		};

		wsList[num] = ws;
	}

	function getUserMedia() {
		
	}

	createWebsocket(0, url);
	createWebsocket(1, url);

	avPublish["init"] = function(params) {};
	avReceive["init"] = function(params) {};
}(function() {
	return window.duang?window.duang:null;
}));