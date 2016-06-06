(function(global) {
	"use strict"

	var tool = global.vm.module.tool,
		slice = Array.prototype.slice,
		baseConfig = {
			gid: tool.random() + "",
			debug: 1
		};

	var COCO = function() {
		this.name = "COCO";
		this.users = {};
		this.connected = false;
	};

	COCO.prototype = {
		constructor: COCO,
		init: function(wrap, url, params) {
			var paramStr ="";
			var params = tool.deepCopy(baseConfig, params);

			for(var key in params){
				paramStr += key+"="+params[key]+"&";
			}

			this.cocoEvent = new tool.constructor.CustomerEvent();
	        this.socket = buildFlash(wrap, url+"?"+paramStr, {id: "cocoSwf"});
	        return this;
		},
		// 连接成功
		linkup: function(hasConnect) {
			this.connected = hasConnect;
			this.cocoEvent.fire({type: "linkup"});
		},
		// 掉线
		linkDown: function(hasDisConnect) {
			this.connected = !hasDisConnect;
			this.cocoEvent.fire({type: "linkDown"});
		},
		loginup: function(users) {
			if(users && users.length>0) {
				var len = users.length,
					i = 0;
				this.users.onlineNum = users.length;
				while(i++<len) {
					this.users[users[i]] = true;
				}
			}

			this.cocoEvent.fire({type: "loginup"});
			this.getGroupOnline();
		},
		// 上线通知
		loginNotify: function(j) {
			this.users[j.from] = true;
			this.users.onlineNum++;
			j.send_nick = decodeURI(j.send_nick);
	        this.cocoEvent.fire({type: "loginNotify", message: j});
		},
		// 下线通知
		logoutNotify: function() {
			this.users[j.from] = false;
			this.users.onlineNum--;
			this.users.outlineNum++;
			j.send_nick = decodeURI(j.send_nick);
	        this.cocoEvent.fire({type: "logoutNotify", message: j});
		},
		// 消息发送
		send: function(msg) {
			var reSend = function(){
				var ret = this.socket.sendData(msg);

				if(!ret) {
					setTimeout(reSend, 300);
				}
			};

			reSend();
		},
		// 文本私聊发送
		sendMsgTo: function(id, msg) {
			this.socket.sendMsgTo(id,msg);
		},
		// 文本群聊发送
		sendMsgToAll: function(msg) {
			this.socket.sendMsgToAll(msg);
		},
		// 私聊
		callOne: function() {
			var info = slice.call(arguments, 0);
			this.socket.callOne(info);
		},
		// 群聊
		callAll: function() {
			var info = slice.call(arguments, 0);
			this.socket.callAll(info); 
		},
		// 获取(返回)服务器在线人数和剩余点数
		getAllCount: function(result) {
			if(arguments.length == 0){
	            this.socket.checkOnline();
	        }else{
	            this.cocoEvent.fire({type:"getAllCount", message:result});
	        }
		},
		// 获取(返回)服务器内人员id列表
		getAllOnline: function(result){
	        if(arguments.length == 0){
	            this.socket.getAllOnline();
	        }else{
	            this.cocoEvent.fire({type:"getAllOnline", message:result});
	        }
		},
		// 获取(返回)当前组人员id列表
		getGroupOnline: function(users){
	        if(arguments.length == 0){
	            this.socket.getGroupOnline();
	        }else{
	        	var len = users.length, i=0;
	            this.users.onlineNum = len;

	            while(i++<len) {
	            	this.users[users[i]] = true;
	            }

	            this.cocoEvent.fire({type:"loadUser", message:users});
	        }
		},
		// 提示音
		playSound: function(mp3){
			this.socket.playSound(mp3);
		},
		stopSound: function(){
			this.socket.stopSound();
		},
		// 私聊接收
		recePrivateMsg: function(data){
			data.say= decodeURI(data.say);
			data.send_nick= decodeURI(data.send_nick);
	        this.cocoEvent.fire({type:"recePrivateMsg", message:data});
		},
		// 群聊接收
		recePublicMsg: function(data){
			data.say= decodeURI(data.say);
			data.send_nick= decodeURI(data.send_nick);
	        this.cocoEvent.fire({type:"recePublicMsg", message:data});
		},
		// 接收除私聊，群聊，群call，私call等消息外的消息
		receive: function(data){
	        this.cocoEvent.fire({type:"receive", message:data});
	    },
	    // 接收所有消息,包括自己发的（尽量不用此处）
	    receiveAll: function(data){
	    	data.say = decodeURI(data.say);
			data.send_nick = decodeURI(data.send_nick);
	        this.cocoEvent.fire({type:"receiveAll", message:data});
		},
		licenseFail: function(result){
	        var _errorStr = "";

	        switch(result){
	            case "0":
	                _errorStr = "License认证失败";
	                break;
	            case "3":
	                _errorStr = "点数已满";
	                window.location.href = '/?r=//overpoints';
					return;
	            case "2":
	                _errorStr = "License已到期";
	                break;
	        };

	        this.cocoEvent.fire({type:"licenseFail", message:_errorStr});
	    }
	};

	function buildFlash(wrap, url, config) {
		var config = config || {},
			id = (config.id) ? config.id : "swf"+tool.random(),
			wrapBox = wrap || document.body,
			f = (url.indexOf("?") > 0 ? url : url+"?").split("?"),
			u = [f.shift(), f.join("?")],
			wh = config.wh ? [config.wh[0]+"px", config.wh[1]+"px"] : ["100%", "100%"],
			wmode = config.wmode || "transparent";

		var e = '<embed src="' + u[0] + '" name="' + id + '" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"  type="application/x-shockwave-flash" allownetworking="all" allowfullscreen="true" allowFullscreenInteractive="true" allowscriptaccess="always" FlashVars="' + u[1] + '" wmode="' + wmode + '" width="' + wh[0] + '" height="' + wh[1] + '"></embed>';
			e = '<object class="FlashPlayer" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,0,0,0" width="' + wh[0] + '" height="' + wh[1] + '" id="' + id + '"><param name="wmode" value="' + wmode + '" ><param value="true" name="allowFullScreen"><param value="all" name="AllowNetworking"><param value="always" name="allowScriptAccess"><param name="AllowNetworking" value="all"><param value="true" name="allowFullscreenInteractive"><param name="movie" value="' + u[0] + '" ><param name="FlashVars" value="' + u[1] + '">' + e + '</object>';
		
		if (config.returnType == "string") {
			return e;
		}

		wrapBox.insertAdjacentHTML('afterBegin', e);

		return document[id];
	}

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["coco"] = new COCO(); 
})(window)