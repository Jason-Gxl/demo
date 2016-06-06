(function(global) {
	"use strict"

	var players = {},
		tool = global.vm.module["tool"],
		baseConfig = {
			nameSpace: "",
			debug: 0 ,
			meetType : "mix",	//mix,video,audio
			swf : "",
			code: window.CODE,
			mid: window.MEET_ID,
			myid: window.USER_ID,
			separator: "_",
			codec: 4,
			buffer: window.BUFFER_TIME || "0.5",
			bufferMax: window.BUFFER_TIMEMAX || "1",
			bgcolor: "0xAAC7EC",
			bgimg: PUBLIC_PATH + "/public/img/speakvideo/speaker.jpg"	//背景图
			fullimg : PUBLIC_PATH + "/public/img/speakvideo/fullBtn.png",	//全屏图标
			waterimg : PUBLIC_PATH + "/public/img/speakvideo/logo.png"	//水印
			// echoPath : ECHO_PATH,
			// width : SPEAKER_RATIO,
			// quality : VIDEO_QUALITY,
			// frame : VIDEO_FRAME,
			// h264 : H264_SET,	//none:照顾移动端,可不启用h264
			// bgsize : "500,500",	//为空时自适应
			// fullpos : "2,20,20", 	//缺省为右上角，20*20的尺寸
		};

	var FlashPlayer = function(opts) {
		this.name = "FlashPlayer";
		var opts = tool.deepCopy(opts, baseConfig);
		this.streamEvent = new tool.constructor.CustomerEvent();
		this.wrap = document.getElementById(opts.id);

		this.init = function() {
			var paramStr = "";
			for(var key in opts) {
				if("id"!==key && "swf"!==key) {
					paramStr += (key+"="+opts[key]) + "&";
				}
			}
			this.obj = buildFlash(this.wrap, opts.swf+"?"+paramStr, {id: opts.id});
		};

		this.getParams = function() {
			return opts;
		};

		this.init();
	};

	FlashPlayer.prototype = {
		constructor: FlashPlayer,
		onLoad : function(){	// flash加载完成时调用
			this.streamEvent.fire({type:"onLoad"});
		},
		onLinkup : function(){	// flash connect success时调用
			this.streamEvent.fire({type:"onLinkup"});
		},
		onLinkdown : function(){	//连接断开时
			this.streamEvent.fire({type:"onLinkdown"});
		},
		onMicWave : function(v){	// flash中麦克风音量 
			this.streamEvent.fire({type:"onMicWave", message:v});
		},
		onSoundWave : function(v){	// flash中扬声器音量 （未实现）
			this.streamEvent.fire({type:"onSoundWave", message:v});
		},
		onInsufficientBW : function(){	//提示接收端带宽不足
			this.streamEvent.fire({type:"onInsufficientBW"});
		},
		onMetaData : function(v){	//视频播放开始，返回metadata信息(通常只用于录播流)
			this.streamEvent.fire({type:"onMetaData", message:v});
		},
		onStop : function(){	//视频播放结束(录播流)
			this.streamEvent.fire({type:"onStop"});
		},
		connect : function(sUrl){
			this.obj.connect(sUrl);
		},
		publish : function(){ 
			var isAudio = (arguments[0] === "audio");	//若传入"audio"则只发布音频。
			this.obj.publish(isAudio);	//isAudio：可用于在视频模式下面发布音频流
		},
		rePublish : function(isAudioStream, meetType){	//mix 
			this.obj.rePublish(isAudioStream, meetType);	//isAudio：可用于在视频模式下面发布音频流
		},
		purePublish : function(){
			this.obj.purePublish();	//纯发布流，不在本地video显示
		},
		unPublish : function(){
			var isAudio = (arguments[0] === "audio");	//传入audio，只停止发布，不去除video显示
			this.obj.unPublish(isAudio);
		},
		play : function(uid, uname){
			this.obj.playStream(uid, uname);	//uname用于显示名字
		},
		playAudio : function(uid){
			this.obj.playStream(uid, '', true);	//接收音频流（不会放入video）
		},
		stop : function(uid){
			this.obj.stopStream(uid);
		},
		togglePause : function(){
			this.obj.togglePause();	//录播流的暂停/播放
		},
		seek : function(t){
			this.obj.seek(t);	//录播流跳播
		},
		selectCam : function(name){
			this.obj.selectCamera(name); 
		},
		setCamera : function(width, fps, quality, keyFrame){
			this.obj.setCamera(width, fps, quality, keyFrame);
		},
		setMicVolume: function(v){
			this.obj.setMicVolume(v); 
		},
		setSoundVolume: function(v){
			this.obj.setSoundVolume(v/50); 
		},
		applyH264 : function(profile, level){
			this.obj.h264(profile, level); 
		},
		applyCodec : function(value){
			this.obj.codec(value); 
		},
		setRate : function(value){
			this.obj.setRate(value); 
		},
		applyEnhanced : function(value){
			this.obj.applyEnhanced(value); 
		},
		setEchoPath : function(value){
			this.obj.setEchoPath(value); 
		},
		recordSet : function(type){
			this.obj.recordSet(type); 
		},
		receiveSet : function(type){
			this.obj.receiveSet(type); 
		},
		getDeviceInfo : function(uid){
			return this.obj.getDeviceInfo();	//获取摄像头，麦克风设置的信息
		},
		getStreamInfo : function(uid){
			return this.obj.getStreamInfo(uid);	//接收方实时获取流信息，如果播的是主持人流或者录播流，不用传uid
		},
		quitFull : function(){	//退出flash全屏
			this.obj.quitFull();
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
	global.vm.module["flashPlayer"] = {
		init: function(opts) {
			var playorObj = new FlashPlayer(opts);
			players[opts.key || opts.id] = playorObj;
			return playorObj;
		},
		getPlayers: function() {
			return players;
		}
	}
})(window)