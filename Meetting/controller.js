(function($) {
	"use strict"
	var layout = vm.module["layout"],
		dataContainer = vm.module["dataContainer"],
		soundControl = vm.module["soundControl"],
		recordControl = vm.module["record"],
		tool = vm.module["tool"],
		win = vm.module["win"];

	tool.addEvent(document, "readystatechange", function() {
		if("complete"===document.readyState) {
			layout.winChange();
		}
	});

	tool.addEvent(window, "resize", function() {
		layout.winChange();
	});

	tool.addEvent(".control-title", "click", function() {
		var type = this.getAttribute("number");
		dataContainer.setInterimData("showMode", type);
		var class_str = "";
		switch(Number(type)) {
			case 1:
			class_str = "user-list-show";
			break;
			case 2:
			class_str = "note-show";
			break;
			case 3:
			class_str = "chat-show";
			break;
		}
		var controlWrap = document.getElementsByClassName("control-wrap")[0];
		tool.replaceClass(controlWrap, /user-list-show|note-show|chat-show/g, class_str);
	});

	function setVideoLayout(count, videoLayout) {
		var type = dataContainer.get('type');
		var videoBoxWrap = document.getElementsByClassName("video-box-wrap")[0];
		tool.replaceClass(videoBoxWrap, /number./g, " number"+count);
		dataContainer.set("videoCount", count);
		dataContainer.set("videoLayout", videoLayout||"");
		if("video"===type) {
			layout.videoLayout();
		} else {
			layout.winChange();
		}
	}

	function initPage() {
		for(var key in initData) {
			dataContainer.set(key, initData[key]);

			if("title"===key) {
				var topicTitle = document.getElementsByClassName("topic-title")[0];
				topicTitle.title = initData[key];
				topicTitle.innerHTML = initData[key];
			}

			if("videoCount"===key) {
				setVideoLayout(initData[key], initData.videoLayout||"");
			}

			if("meetState"===key) {
				if("interactive"===initData[key]) {
					var hintEle = document.getElementsByClassName("meetting-no-start-hint")[0];
					tool.addClass(hintEle, "hidden");
				}
			}

			if("role"===key) {
				var menuWrap = document.getElementsByClassName("menu-wrap")[0],
					menuWrapSmall = document.getElementsByClassName("menu-wrap-small")[0],
					classStr = "";

				switch(initData[key]) {
					case 0:
					classStr = "main-menu-wrap";
					break;
					case 1:
					classStr = "speaker-menu-wrap";
					break;
					case 2:
					classStr = "joiner-menu-wrap";
					break;
					case 3:
					classStr = "visitor-menu-wrap";
					break;
				}

				tool.addClass(menuWrap, classStr);
				dataContainer.setInterimData("menuWrap", menuWrap);
				dataContainer.setInterimData("menuWrapSmall", menuWrapSmall);
				dataContainer.set("role", +initData[key]);
			}

			if("type"===key && initData[key] && "video"!==initData[key]) {
				tool.replaceClass(document.body, "video", initData[key]);
			}

			if("moreScreen"===key) {
				if("show"===initData.type && initData[key]) {
					tool.replaceClass(document.getElementsByClassName("more-screen")[0], "icon-more-screen", "icon-more-screen-green");
				}
			}

			if("record"===key) {
				if(initData[key]) {
					recordControl.start();
				}
			}
		}
	}

	$(function() {
		initPage();

		var videoLayoutDialog = win.alert({
			id: "video_layout_tpl",
			header: false,
			footer: false,
			beforeClose: function() {
				dataContainer.setInterimData("hasDialogShow", false);
			}
		});

		tool.addEvent(".video-layout-item", "mousemove", function() {
			if(-1!==this.className.indexOf("mouse-move-on")) return ;
			tool.addClass(this, "mouse-move-on");
		});

		tool.addEvent(".video-layout-item", "mouseout", function() {
			if(-1!==this.className.indexOf("mouse-move-on")) tool.removeClass(this, "mouse-move-on");
		});

		tool.addEvent(".video-layout-item", "click", function() {
			var _layout = this.getAttribute("layout"),
				_layouts = _layout.split(","),
				type = dataContainer.get('type'),
				videoLayoutDialog = dataContainer.getInterimData("videoLayoutDialog");

			setVideoLayout(Number(_layouts[0]), _layouts[1]||"");
			videoLayoutDialog.close();
		});

		tool.addEvent(".close-btn", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			if("over"===dataContainer.get("meetState")) return;
			dataContainer.set("meetState", "over");
			alert("close");
		});

		tool.addEvent(window, "beforeunload", function() {

		});

		tool.addEvent(".more-btn", "mouseover", function() {
			var icon = this.firstElementChild || this.lastChild;
			tool.replaceClass(icon, "icon-arrrow-down-green", "icon-arrrow-down-gray");
		});

		tool.addEvent(".more-btn", "mouseout", function() {
			var icon = this.firstElementChild || this.lastChild;
			tool.replaceClass(icon, "icon-arrrow-down-gray", "icon-arrrow-down-green");
		});

		tool.addEvent(".more-btn", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var e = arguments[0] || window.event,
				isShow = dataContainer.getInterimData("moreAppIsShow"),
				moreAppWarp = document.getElementsByClassName("more-app-list-wrap")[0];

			if(!isShow) {
				tool.removeClass(moreAppWarp, "hidden");
			} else {
				tool.addClass(moreAppWarp, "hidden");
			}

			dataContainer.setInterimData("moreAppIsShow", !isShow);
			e.preventDefault();
			e.stopPropagation();
		});

		tool.addEvent("#record", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var e = arguments[0] || window.event,
				isShow = dataContainer.getInterimData("moreRecordIsShow"),
				moreRecordWarp = document.getElementsByClassName("more-record-list-wrap")[0];

			if(!isShow) {
				tool.removeClass(moreRecordWarp, "hidden");
			} else {
				tool.addClass(moreRecordWarp, "hidden");
			}

			dataContainer.setInterimData("moreRecordIsShow", !isShow);
			e.preventDefault();
			e.stopPropagation();	
		});

		tool.addEvent(".more-app-list-item", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var e = arguments[0] || window.event,
				moreAppWarp = document.getElementsByClassName("more-app-list-wrap")[0],
				action = this.getAttribute("action");

			switch(action) {
				case "sequence":
				console.log("sequence");
				break;
				case "loop":
				loopDialog.open();
				dataContainer.setInterimData("hasDialogShow", true);
				break;
				case "nospeak":
				noSpeakDialog.open();
				dataContainer.setInterimData("hasDialogShow", true);
				break;
				case "nochat":
				console.log("nochat");
				break;
				case "calling":
				doCalling();
				break;
				case "survey":
				console.log("survey");
				break;
				case "test":
				console.log("test");
				break;
				case "lock":
				console.log("lock");
				break;
				case "guest":
				console.log("guest");
				break;
				case "visitor":
				console.log("visitor");
				break;
			}

			tool.addClass(moreAppWarp, "hidden");
			dataContainer.setInterimData("moreAppIsShow", false);
			e.preventDefault();
			e.stopPropagation();
		});

		tool.addEvent(".more-reocrd-list-itme", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var e = arguments[0] || window.event,
				moreRecordWarp = document.getElementsByClassName("more-record-list-wrap")[0],
				action = this.getAttribute("action");

			if("archive"===action) {
				var archiveDialog = dataContainer.getInterimData("archiveDialog");
				archiveDialog.open("");	
			}

			tool.addClass(moreRecordWarp, "hidden");
			dataContainer.setInterimData("moreRecordIsShow", false);
			e.preventDefault();
			e.stopPropagation();
		});

		tool.addEvent(document, "click", function() {
			if(dataContainer.getInterimData("moreAppIsShow")) {
				var moreAppWarp = document.getElementsByClassName("more-app-list-wrap")[0];
				tool.addClass(moreAppWarp, "hidden");
				dataContainer.setInterimData("moreAppIsShow", false);
			}
			if(dataContainer.getInterimData("moreRecordIsShow")) {
				var moreRecordWarp = document.getElementsByClassName("more-record-list-wrap")[0];
				tool.addClass(moreRecordWarp, "hidden");
				dataContainer.setInterimData("moreRecordIsShow", false);
			}
		});

		var microphone = soundControl.init({
			id: "microphone-wrap",
			type: "microphone",
			switchClick: function(val) {console.log(val);},
			drag: function(val) {console.log(val);}
		});

		var earphone = soundControl.init({
			id: "earphone-wrap",
			type: "earphone",
			switchClick: function(val) {console.log(val);},
			drag: function(val) {console.log(val);}
		});

		microphone.setSound(dataContainer.getInterimData("microphone"));
		earphone.setSound(dataContainer.getInterimData("earphone"));

		tool.addEvent("#camera", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var e = arguments[0] || window.event;
		});

		tool.addEvent(".menu-itme", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var e = arguments[0] || window.event,
				action = this.getAttribute("action");
			
			switch(action) {
				case "turnMode":
				turnMode();
				break;
				case "videoLayout":
				showVideoLayoutDiaLog();
				break;
			}
		});

		tool.addEvent(".turn-mode-small", "click", turnMode);

		function turnMode() {
			var type = dataContainer.get("type");
			if("video"===type) {
				tool.replaceClass(document.body, "video", "show");
				tool.replaceClass(document.getElementsByClassName("more-screen")[0], "icon-more-screen-green", "icon-more-screen");
				dataContainer.set("type", "show");
			} else {
				tool.replaceClass(document.body, "show", "video");
				dataContainer.set("type", "video");
			}
			dataContainer.set("moreScreen", false);
			layout.winChange();
		}

		tool.addEvent(".icon-hide-menu", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var menuWrap = dataContainer.getInterimData("menuWrap"),
				menuWrapSmall = dataContainer.getInterimData("menuWrapSmall");
			tool.addClass(menuWrap, "hidden");
			tool.removeClass(menuWrapSmall, "hidden");
			layout.layoutMenuWrap();
		});

		tool.addEvent(".menu-wrap-small", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var menuWrap = dataContainer.getInterimData("menuWrap"),
				menuWrapSmall = dataContainer.getInterimData("menuWrapSmall");
			tool.removeClass(menuWrap, "hidden");
			tool.addClass(menuWrapSmall, "hidden");
			layout.layoutMenuWrap();
		});

		function showVideoLayoutDiaLog() {
			var videoLayoutDialog = dataContainer.getInterimData("videoLayoutDialog");
			videoLayoutDialog.open();
			dataContainer.setInterimData("hasDialogShow", true);
		}

		function doCalling() {
			var _time = 30,
				callingTimeEle = document.getElementById("calling_time"),
				arrivedList = document.getElementsByClassName("arrived-list")[0],
				nonarrivalList = document.getElementsByClassName("nonarrival-list")[0];
			arrivedList.innerHTML = "";
			nonarrivalList.innerHTML = "";
			callingTimeEle.innerHTML = _time;
			callingDialog.open();
			var it = setInterval(function() {
				callingTimeEle.innerHTML = --_time;
				if(0>=_time) {
					clearInterval(it);
					if(!callingDialog.isShow) callingDialog.open();
				}
			}, 1000);
			dataContainer.setInterimData("hasDialogShow", true);
		}

		tool.addEvent(".full-screen", "click", function() {
			if(dataContainer.getInterimData("hasDialogShow")) return ;
			var videoFullScreen = dataContainer.getInterimData("videoFullScreen"),
				container = document.getElementById("container");
			if(!videoFullScreen) {
				tool.addClass(container, "video-full-screen");
			} else {
				tool.removeClass(container, "video-full-screen");
			}
			dataContainer.setInterimData("videoFullScreen", !videoFullScreen);
			layout.winChange();
		});

		tool.addEvent(".more-screen", "click", function() {
			var moreScreen = dataContainer.get("moreScreen");
			if(moreScreen) {
				tool.replaceClass(this, "icon-more-screen-green", "icon-more-screen");
			} else {
				tool.replaceClass(this, "icon-more-screen", "icon-more-screen-green");
			}
			dataContainer.set("moreScreen", !moreScreen);
			layout.layoutSmallVideo();
			layout.resizeControl();
		});

		var archiveDialog = win.alert({
			title: "归档",
			footer: false,
			width: 500,
			height: 300,
			beforeClose: function() {
				dataContainer.setInterimData("hasDialogShow", false);
			}
		});

		var loopDialog = win.alert({
			id: "loop_setting_tpl",
			title: "轮巡设置",
			footer: false,
			beforeClose: function() {
				dataContainer.setInterimData("hasDialogShow", false);
			}
		});

		tool.addEvent(".start-loop-btn", "click", function() {
			var loopDialog = dataContainer.getInterimData("loopDialog");
			var loopTime = document.getElementById("loopTime2").value||document.getElementById("loopTime1").value;
			console.log(loopTime);
			loopDialog.close();
		});

		tool.addEvent(".cancel-loop-btn", "click", function() {
			loopDialog.close();
		});

		var noSpeakDialog = win.alert({
			id: "no_speak_tpl",
			footer: false,
			beforeClose: function() {
				dataContainer.setInterimData("hasDialogShow", false);
			}
		});

		tool.addEvent("#run_no_speak", "click", function() {
			noSpeakDialog.close();
		});

		tool.addEvent("#cancel_no_speak", "click", function() {
			noSpeakDialog.close();
		});

		var callingDialog = win.alert({
			id: "calling_main_tpl",
			title: "点名",
			footer: false,
			beforeClose: function() {
				dataContainer.setInterimData("hasDialogShow", false);
			}
		});
	})
})(jQuery)