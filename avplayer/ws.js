/**
 *
 *
 * websocket
 * @Author Jason
 * @Date 2017-8-8
 *
 *
 *
 **/
 (function(undefined) {
 	"use strict";
 	var wss = {},
 		uuid = -1,
 		toString = Object.prototype.toString,
 		protocol = ("https"===location.protocol?"wss":"ws")+"://";

 	function WS(opts) {
 		var server = /http/.test(opts.server)?opts.server:(protocol+opts.server);
 		var ws = null;
 		var self = this;
 		var messages = {};

 		var buildWS = function() {
 			ws = new WebSocket(server);
 			self.state = "connecting";

	 		ws.onopen = function() {
	 			opts.onopen && opts.onopen.apply(self, [].slice.call(arguments));
	 			self.state = "connected";
	 		};

	 		ws.onmessage = function(arg) {
	 			var data = arg.data,
	 				ev = data.event,
	 				params = data.parameter;
	 			messages[ev] && messages[ev].apply(self, "[object Array]"===toString.call(params)?params:[params]);
	 		};

	 		ws.onclose = function() {
	 			opts.onclose && opts.onclose.apply(self, [].slice.call(arguments));
	 			self.state = "closed";
	 		};

	 		ws.onerror = function() {
	 			ws.close();
	 			self.state = "closed";
	 			buildWS();
	 		};
 		};

 		buildWS();

 		this.getParams = function() {
 			return opts;
 		};

 		this.getWebSocket = function() {
 			return ws;
 		};

 		this.addMessage = function(name, callback) {
 			void(0)===name && throw "no function name";
 			messages[name] = (callback||null);
 		};

 		wss[opts.name||++uuid] = this;
 	}

 	WS.prototype = {
 		constructor: WS,
 		close: function() {
 			var ws = this.getWebSocket();
 			ws.close();
 		}
 	};

 	var ws = {
 		init: function(opts) {
 			!opts.server && throw "no server, please put server's name";
 			return new WS(opts);
 		},
 		getWsByName: function(name) {
 			return void(0)===name?wss:wss[name];
 		},
 	};

 	module.exports = ws;
 }());