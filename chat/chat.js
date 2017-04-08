;(function() {
	"use strict";
	var win = window,
		doc = document,
		toString = Object.prototype.toString,
		tpl = '\
				<div class="chat-wrap">\
					<div class="chat-wrap-header"><i class="iconfont"></i><span>$TITLE$</span></div>\
					<div class="chat-wrap-body">\
						<ul class="chat-groupMsg-wrap"></ul>\
					</div>\
					<div class="chat-wrap-footer">\
						<div class="chat-face-wrap"><i class="iconfont"></i></div>\
						<div class="chat-message-wrap">\
							<textarea class="message-box" placeholder="$PLACEHOLDER$"></textarea>\
						</div>\
						<div class="chat-send-wrap clear-fix">\
							<a href="javascript:void(0);" class="btn send-btn">发表</a>\
						</div>\
					</div>\
				</div>',
		tplLi1 = '\
				<li class="msg-item-wrap">\
					<span class="user-avatar-wrap"><img src="$AVATAR$" width="30" height="30"></img></span>\
					<div class="msg-content-wrap">\
						<span class="msg-from-wrap">$USERNAME$</span>\
						<div class="msg-box msg-box-left">\
							<span class="arrow-left"></span>\
							<div>$MSG$</div>\
						</div>\
					</div>\
				</li>',
		tplLi2 = '\
				<li class="msg-item-wrap">\
					<div class="msg-content-wrap">\
						<div class="msg-box msg-box-right">\
							<span class="arrow-right"></span>\
							<div>$MSG$</div>\
						</div>\
					</div>\
					<span class="user-avatar-wrap"><img src="$AVATAR$" width="30" height="30"></img></span>\
				</li>';


	function COCOChat(params) {
		this.name = "COCOChat";
		var self = this,
			wrap = params.wrap,
			swfUrl = params.swfUrl;
		delete params.wrap;
		delete params.swfUrl;
		COCO.init(wrap, swfUrl, params);

		COCO.cocoEvent.addCustEvent("linkup", function() {
			console.log("................linkup in.......................");
			self.addSystemMsg("COCO连接成功！");
		});
		
		COCO.cocoEvent.addCustEvent("loginup", function() {
			console.log("................loginup in.......................");
			self.addSystemMsg("COCO登录成功！");
		});
		
		COCO.cocoEvent.addCustEvent("linkDown", function() {
			console.log("................linkDown in.......................");
			self.addSystemMsg("帐号已在别处被登录！");
		});
		
		COCO.cocoEvent.addCustEvent("loginNotify", function() {
			console.log("................loginNotify in.......................");
		});
		
		COCO.cocoEvent.addCustEvent("logoutNotify", function() {
			console.log("................logoutNotify in.......................");
		});
		
		COCO.cocoEvent.addCustEvent("loadUser", function() {
			console.log("................loadUser in.......................");
		});
		
		COCO.cocoEvent.addCustEvent("recePrivateMsg", function() {
			console.log("................recePrivateMsg in.......................");
			var info = arguments[0];
			var privateMsg = tool.encodeHTML(info.say);
			self.addSystemMsg(privateMsg, info.from);
		});
		
		COCO.cocoEvent.addCustEvent("recePublicMsg", function() {
			console.log("................recePublicMsg in.......................");
			var info = arguments[0];
			var receMsg = tool.encodeHTML(info.say);
			self.addGroupMsg(receMsg, info.from);
		});
		
		COCO.cocoEvent.addCustEvent("receive", function() {
			console.log("................receive in.......................");
		});

		self.socket = COCO;
	}

	function WebSocketChat(params) {
		this.name = "WebSocketChat";
	}

	function buildChatBox(params) {
		if(!params.wrap) return ;
		var self = this,
			socket = self.socket,
			df = doc.createElement("DIV"),
			msgTpl = tpl.replace(/\$TITLE\$/g, params.title||"交流区")
					.replace(/\$PLACEHOLDER\$/g, params.placeholder||"请输入您要说的内容.....");
		df.innerHTML = msgTpl.replace(/^\s+|\s+$/g, "");
		var chatBox = df.removeChild(df.firstChild),
			groupMsgBox = chatBox.getElementsByClassName("chat-groupMsg-wrap")[0],
			systemMsgBox = chatBox.getElementsByClassName("chat-systemMsg-wrap")[0],
			msgBox = chatBox.getElementsByClassName("message-box")[0],
			sendMsgBtn = chatBox.getElementsByClassName("send-btn")[0];

		tool.addEvent(sendMsgBtn, "click", function() {
			var val = msgBox.value;
			socket && socket.sendMsgToAll(val);
			self.addGroupMsg(val, false);
			msgBox.value = "";
		});

		params.wrap.appendChild(chatBox);
		self._groupMsgBox = groupMsgBox;
		self._systemMsgBox = systemMsgBox;
	}

	function Chat() {
		var args = [].slice.call(arguments, 0),
			len = args.length,
			params = null,
			fn = null;
		if(0===len) return ;
		if("[object Function]"===toString.call(args[len-1])) {
			fn = args.pop();
		}
		params = args.shift();
		if(!params || !fn) return ;
		buildChatBox.call(this, params);
		//var remoteTool = fn.call(this, params.remoteParams);
	}

	Chat.prototype = {
		constructor: Chat,
		addPrivateMsg: function() {
			return ;
		},
		addGroupMsg: function(msg, fromSelf) {
			if(!msg) return ;
			var msgLi = (!fromSelf?tplLi1:tplLi2)
							.replace(/\$AVATAR\$/g, "")
							.replace(/\$USERNAME\$/g, "")
							.replace(/\$MSG\$/g, msg);
			tool.insertHTML(this._groupMsgBox, "beforeend", msgLi.replace(/^\s+|\s+$/, ""));
		},
		addSystemMsg: function() {
			return ;
		}
	};

	win.chat = {
		init: function(params) {
			if(!params || !params.wrap) return ;
			return new Chat(params, "coco"===params.remoteType?COCOChat:WebSocketRemote);
		}
	};
}(void(0)));