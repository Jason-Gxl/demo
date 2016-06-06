(function(global) {
	"use strict"
	// 大模块对象
	var body = null,
		header = null,
		container = null,
		videoWrap = null,
		padWrap = null,
		controlWrap = null,
		menuContainer = null;

	// 右侧用户操作的模块
	var userList = null,
		noteTextWrap = null,
		chatting = null;

	// 视频区
	var videoBoxWrap = null,
		videoBoxList = [];

	// 数据模块
	var dataContainer = global.vm.module["dataContainer"],
		slice = Array.prototype.slice;

	function Layout() {
		body = document.body,
		header = document.getElementById("header"),
		container = document.getElementById("container");
		videoWrap = document.getElementsByClassName("video-wrap")[0];
		padWrap = document.getElementsByClassName("pad-wrap")[0];
		controlWrap = document.getElementsByClassName("control-wrap")[0];

		userList = document.getElementsByClassName("user-list")[0];
		noteTextWrap = document.getElementsByClassName("note-text-wrap")[0];
		chatting = document.getElementsByClassName("chatting")[0];

		videoBoxWrap = document.getElementsByClassName("video-box-wrap")[0];
		videoBoxList = slice.call(document.getElementsByClassName("video-box"));

		menuContainer = document.getElementsByClassName("menu-container")[0];
	}

	Layout.prototype = {
		constructor: Layout,
		winChange: function() {
			var type = dataContainer.get("type");

			container.style.height = body.clientHeight - header.offsetHeight + "px";

			if("video"===type) {
				padWrap.removeAttribute("style");
				videoWrap.style.width = container.clientWidth - padWrap.offsetWidth + "px";
				videoWrap.style.height = container.clientHeight + "px";
				videoBoxWrap.style.height = videoWrap.clientHeight - 30 + "px";
			} else {
				videoWrap.removeAttribute("style");
				videoBoxWrap.removeAttribute("style");
				padWrap.style.width = container.clientWidth - videoWrap.offsetWidth + "px";
				padWrap.style.height = container.clientHeight + "px";
			}

			if("video"===type) {
				this.videoLayout();
			} else {
				var len = videoBoxList.length;
				while(len--) {
					videoBoxList[len].removeAttribute("style");
				}
			}

			this.layoutMenuWrap();
			if("show"===type && dataContainer.get("moreScreen")) {
				this.layoutSmallVideo();
			}
			this.resizeControl();
		},
		layoutMenuWrap: function() {
			var type = dataContainer.get("type");
			if("video"===type) {
				menuContainer.style.left = (videoWrap.offsetWidth - menuContainer.offsetWidth)/2 + "px";
			} else {
				menuContainer.style.left = (padWrap.offsetWidth - menuContainer.offsetWidth)/2 + "px";
			}
		},
		layoutSmallVideo: function() {
			var videoCount = dataContainer.get("videoCount"),
				videoBoxWrapWidth = videoBoxWrap.clientWidth,
				videoBoxWrapHeight = videoBoxWrap.clientHeight,
				perVideoBox = null,
				moreScreen = dataContainer.get("moreScreen"),
				i = 1;

			if(1===videoCount) return ;

			if(moreScreen) {
				var smallVideoWidth = videoBoxWrapWidth/2,
					smallVideoHeight = smallVideoWidth/16*9;

				do {
					var videoBox = videoBoxList[i];

					if(i>0) {
						perVideoBox = videoBoxList[i-1];
					}

					videoBox.style.width = smallVideoWidth + "px";
					videoBox.style.height = smallVideoHeight + "px";

					if(1===i) {
						videoBox.style.top = 180 + "px";
					} else {
						if(i%2) {
							videoBox.style.top = perVideoBox.offsetTop + perVideoBox.offsetHeight + "px";
							videoBox.style.left = 0;
						} else {
							videoBox.style.top = perVideoBox.offsetTop + "px";
							videoBox.style.left = perVideoBox.offsetWidth + "px";
						}
					}
				} while (i++<videoCount)

				videoBoxWrap.style.height = Math.ceil((videoCount-1)/2)*smallVideoHeight + 180 + "px";
			} else {
				do {
					var videoBox = videoBoxList[i];
					videoBox.removeAttribute("style");
				} while (i++<videoCount)

				videoBoxWrap.removeAttribute("style");
			}
		},
		resizeControl: function() {
			var type = dataContainer.get("type");

			if("video"===type) {
				controlWrap.style.height = container.clientHeight - padWrap.offsetHeight + "px";
				controlWrap.style.left = videoWrap.offsetWidth + "px";
				controlWrap.style.top = header.offsetHeight + padWrap.offsetHeight + "px";
			} else {
				controlWrap.style.height = container.clientHeight - videoWrap.offsetHeight + "px";
				controlWrap.style.left = padWrap.offsetWidth + "px";
				controlWrap.style.top = header.offsetHeight + videoWrap.offsetHeight + "px";
			}

			userList.style.height = controlWrap.clientHeight - 85 + "px";
			noteTextWrap.style.height = controlWrap.clientHeight - 85 + "px";
			chatting.style.height = controlWrap.clientHeight - 85 + "px";
		},
		videoLayout: function() {
			var videoCount = dataContainer.get("videoCount"),
				videoBoxWrapWidth = videoBoxWrap.clientWidth,
				videoBoxWrapHeight = videoBoxWrap.clientHeight;

			if(1===videoCount) {
				var videoBox = videoBoxList[0];
				var flag = videoBoxWrapWidth/videoBoxWrapHeight>16/9;
				if(flag) {
					var normalHeight = videoBoxWrapHeight - 2;
					videoBox.style.height = normalHeight + "px";
					videoBox.style.width = normalHeight/9 * 16 + "px";
					videoBox.style.top = 0;
					videoBox.style.left = (videoBoxWrapWidth-videoBox.offsetWidth)/2 + "px";
				} else {
					var normalWidth = videoBoxWrapWidth;
					videoBox.style.width = normalWidth + "px";
					videoBox.style.height = normalWidth/16 * 9 + "px";
					videoBox.style.left = 0;
					videoBox.style.top = (videoBoxWrapHeight-videoBox.offsetHeight)/2 + "px";
				}
			}

			if(2===videoCount) {
				var i = 0,
					flag = videoBoxWrapWidth/videoBoxWrapHeight>32/9?true:false;
				do {
					var videoBox = videoBoxList[i];

					if(flag) {
						var normalHeight = videoBoxWrapHeight - 2;
						videoBox.style.height = normalHeight + "px";
						videoBox.style.width = normalHeight/9 * 16 + "px";
					} else {
						var normalWidth = videoBoxWrapWidth/2;
						videoBox.style.width = normalWidth + "px";
						videoBox.style.height = normalWidth/16*9 + "px";
					}
				} while (++i<videoCount)

				i = 0;
				do {
					var videoBox = videoBoxList[i],
						perVideoBox = null;

					if(0<i) {
						perVideoBox = videoBoxList[i-1];
					}

					if(flag) {
						if(0===i) {
							videoBox.style.left = (videoBoxWrapWidth - videoBox.offsetWidth*2)/2 + "px";
							videoBox.style.top = 0;
						}
					} else {
						if(0===i) {
							videoBox.style.top = (videoBoxWrapHeight - videoBox.offsetHeight)/2 + "px";
							videoBox.style.left = 0;
						}
					}

					if(1===i) {
						videoBox.style.top = perVideoBox.offsetTop + "px";
						videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
					}
				} while (++i<videoCount)
			}

			if(3===videoCount) {
				var videoLayout = dataContainer.get("videoLayout");
				if("vertical"!==videoLayout) {
					var i = 0,
						flag = videoBoxWrapWidth/videoBoxWrapHeight>8/3?true:false;

					do {
						var videoBox = videoBoxList[i];

						if(flag) {
							var normalHeight = videoBoxWrapHeight - 2;
							if(0===i) {
								videoBox.style.height = normalHeight + "px";
								videoBox.style.width = normalHeight/9*16 + "px";
							} else {
								videoBox.style.height = normalHeight/2 - 0.5 + "px";
								videoBox.style.width = normalHeight/9*8 + "px";
							}
						} else {
							if(0===i) {
								var normalWidth = videoBoxWrapWidth/3*2;
								videoBox.style.width = normalWidth + "px";
								videoBox.style.height = normalWidth/16*9 + "px";
							} else {
								videoBox.style.width = videoBoxWrapWidth/3 + "px";
								videoBox.style.height = videoBoxWrapWidth/16*3 + "px";
							}
						}
					} while (++i<videoCount)

					i = 0;
					do {
						var videoBox = videoBoxList[i],
							perVideoBox = null;

						if(0<i) {
							perVideoBox = videoBoxList[i-1];
						}

						if(flag) {
							if(0===i) {
								videoBox.style.top = 0;
								videoBox.style.left = (videoBoxWrapWidth - (videoBox.offsetWidth + videoBoxList[1].offsetWidth))/2 + "px";
							}
						} else {
							if(0===i) {
								videoBox.style.left = 0;
								videoBox.style.top = (videoBoxWrapHeight - videoBox.offsetHeight)/2 + "px";
							}
						}

						if(1===i) {
							videoBox.style.top = perVideoBox.offsetTop + "px";
							videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
						}

						if(2===i) {
							videoBox.style.left = perVideoBox.offsetLeft + "px";
							videoBox.style.top = perVideoBox.offsetTop + perVideoBox.offsetHeight + "px";
						}
					} while (++i<videoCount)
				} else {
					var i = 0,
						flag = videoBoxWrapWidth/videoBoxWrapHeight>32/27?true:false;

					do {
						var videoBox = videoBoxList[i];

						if(flag) {
							if(0===i) {
								var normalHeight = videoBoxWrapHeight/3*2;
								videoBox.style.height = normalHeight - 1 + "px";
								videoBox.style.width = normalHeight/9*16 + "px";
							} else {
								var normalHeight = videoBoxWrapHeight/3
								videoBox.style.height = normalHeight - 1 + "px";
								videoBox.style.width = normalHeight/9*16 + "px";
							}
						} else {
							if(0===i) {
								videoBox.style.width = videoBoxWrapWidth + "px";
								videoBox.style.height = videoBoxWrapWidth/16*9 + "px";
							} else {
								var normalWidth = videoBoxWrapWidth/2;
								videoBox.style.width = normalWidth + "px";
								videoBox.style.height = normalWidth/16*9 + "px";
							}
						}
					} while (++i<videoCount)

					i = 0;
					do {
						var videoBox = videoBoxList[i],
							perVideoBox = null;

						if(0<i) {
							perVideoBox = videoBoxList[i-1];
						}

						if(flag) {
							if(0===i) {
								videoBox.style.left = (videoBoxWrapWidth - videoBox.offsetWidth)/2 + "px";
								videoBox.top = 0;
							}
						} else {
							if(0===i) {
								videoBox.style.left = 0;
								videoBox.style.top = (videoBoxWrapHeight - (videoBox.offsetHeight + videoBoxList[1].offsetHeight))/2 + "px";
							}
						}

						if(1===i) {
							videoBox.style.left = perVideoBox.offsetLeft + "px";
							videoBox.style.top = perVideoBox.offsetTop + perVideoBox.offsetHeight + "px";
						}

						if(2===i) {
							videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
							videoBox.style.top = perVideoBox.offsetTop + "px";
						}
					} while (++i<videoCount)
				}
			}

			if(4===videoCount) {
				var i = 0,
					flag = videoBoxWrapWidth/videoBoxWrapHeight>16/9?true:false;

				do {
					var videoBox = videoBoxList[i];

					if(flag) {
						var normalHeight = videoBoxWrapHeight/2;
						videoBox.style.height = normalHeight - 2 + "px";
						videoBox.style.width = normalHeight/9*16 + "px";
					} else {
						videoBox.style.width = videoBoxWrapWidth/2 + "px";
						videoBox.style.height = videoBox.offsetWidth/16*9 + "px";
					}
				} while (++i<videoCount)

				i = 0;
				do {
					var videoBox = videoBoxList[i],
						perVideoBox = null;

					if(0<i) {
						perVideoBox = videoBoxList[i-1];
					}

					if(flag) {
						if(0===i) {
							videoBox.style.top = 0;
							videoBox.style.left = (videoBoxWrapWidth-videoBox.offsetWidth*2)/2 + "px";
						}
					} else {
						if(0===i) {
							videoBox.style.left = 0;
							videoBox.style.top = (videoBoxWrapHeight-videoBox.offsetHeight*2)/2 + "px";
						}
					}

					if(1===i) {
						videoBox.style.top = perVideoBox.offsetTop + "px";
						videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
					}

					if(2===i) {
						videoBox.style.top = perVideoBox.offsetTop + perVideoBox.offsetHeight + "px";
						videoBox.style.left = perVideoBox.offsetLeft - perVideoBox.offsetWidth + "px";
					}

					if(3===i) {
						videoBox.style.top = perVideoBox.offsetTop + "px";
						videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
					}
				} while (++i<videoCount)
			}

			if(6===videoCount) {
				var i = 0,
					videoLayout = dataContainer.get("videoLayout"),
					flag = videoBoxWrapWidth/videoBoxWrapHeight>16/9?true:false;

				do {
					var videoBox = videoBoxList[i];

					if(flag) {
						var normalHeight = 0;
						if(0===i) {
							normalHeight = videoBoxWrapHeight/3*2;
							videoBox.style.height = normalHeight -1 + "px";
						} else {
							normalHeight = videoBoxWrapHeight/3;
							videoBox.style.height = normalHeight - 1 + "px";
						}
						videoBox.style.width = videoBox.offsetHeight/9*16 + "px";
					} else {
						if(0===i) {
							videoBox.style.width = videoBoxWrapWidth/3*2 + "px";
						} else {
							videoBox.style.width = videoBoxWrapWidth/3 + "px";
						}
						videoBox.style.height = videoBox.offsetWidth/16*9 + "px";
					}
				} while(++i<videoCount)

				i = 0;
				if("right"!==videoLayout) {
					do {
						var videoBox = videoBoxList[i],
							perVideoBox = null;

						if(0<i) {
							perVideoBox = videoBoxList[i-1];
						}

						if(flag) {
							if(0===i) {
								videoBox.style.top = 0;
								videoBox.style.left = (videoBoxWrapWidth-(videoBox.offsetWidth+videoBoxList[1].offsetWidth))/2 + "px";
							}

						} else {
							if(0===i) {
								videoBox.style.left = 0;
								videoBox.style.top = (videoBoxWrapHeight - (videoBox.offsetHeight + videoBoxList[1].offsetHeight))/2 + "px";
							}
						}
						if(1===i) {
							videoBox.style.top = perVideoBox.offsetTop + "px";
							videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
						}

						if(2===i) {
							videoBox.style.top = perVideoBox.offsetTop + perVideoBox.offsetHeight + "px";
							videoBox.style.left = perVideoBox.offsetLeft + "px";
						}

						if(3===i) {
							videoBox.style.top = videoBoxList[0].offsetTop + videoBoxList[0].offsetHeight + "px";
							videoBox.style.left = videoBoxList[0].offsetLeft + "px";
						}

						if(4===i || 5===i) {
							videoBox.style.top = perVideoBox.offsetTop + "px";
						}

						if(5===i) {
							videoBox.style.top = videoBoxList[2].offsetTop + videoBoxList[2].offsetHeight + "px";
							videoBox.style.left = videoBoxList[2].offsetLeft + "px";

							var spaceWidth = ((videoBox.offsetLeft - (videoBoxList[3].offsetLeft + videoBoxList[3].offsetWidth))-perVideoBox.offsetWidth)/2
							perVideoBox.style.left = videoBoxList[3].offsetLeft + videoBoxList[3].offsetWidth + spaceWidth + "px";
						}
					} while(++i<videoCount)
				} else {
					do {
						var videoBox = videoBoxList[i],
							perVideoBox = null;

						if(0<i) {
							perVideoBox = videoBoxList[i-1];
						}

						if(flag) {
							if(0===i) {
								videoBox.style.top = 0;
								videoBox.style.left = (videoBoxWrapWidth-(videoBox.offsetWidth+videoBoxList[1].offsetWidth))/2 + videoBoxList[1].offsetWidth + "px";
							}
						} else {
							if(0===i) {
								videoBox.style.top = (videoBoxWrapHeight-(videoBox.offsetHeight+videoBoxList[1].offsetHeight))/2 + "px";
								videoBox.style.left = videoBoxList[1].offsetWidth + "px";
							}
						}
						if(1===i) {
							videoBox.style.top = perVideoBox.offsetTop + "px";
							videoBox.style.left = perVideoBox.offsetLeft - videoBox.offsetWidth + "px";
						}

						if(2===i || 3===i) {
							videoBox.style.top = perVideoBox.offsetTop + perVideoBox.offsetHeight + "px";
							videoBox.style.left = perVideoBox.offsetLeft;
						}

						if(4===i || 5===i) {
							videoBox.style.top = perVideoBox.offsetTop + "px";
							videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth;
						}
					} while (++i<videoCount)
				}
			}

			if(8===videoCount) {
				var i = 0,
					flag = videoBoxWrapWidth/videoBoxWrapHeight>16/9?true:false;

				if(flag) {
					do {
						var videoBox = videoBoxList[i];

						if(0===i) {
							var normalHeight = videoBoxWrapHeight/4*3;
							videoBox.style.height = normalHeight - 2 + "px";
							videoBox.style.width = normalHeight/9*16 + "px";
						} else {
							var normalHeight = videoBoxWrapHeight/4;
							videoBox.style.height = normalHeight - 1 + "px";
							videoBox.style.width  = normalHeight/9*16 + "px";
						}
					} while(++i<videoCount)
				} else {
					do {
						var videoBox = videoBoxList[i];

						if(0===i) {
							var normalWidth = videoBoxWrapWidth/4*3;
							videoBox.style.width = normalWidth + "px";
							videoBox.style.height = normalWidth/16*9 + "px";
						} else {
							var normalWidth = videoBoxWrapWidth/4;
							videoBox.style.width = normalWidth + "px";
							videoBox.style.height = normalWidth/16*9 + "px";
						}
					} while(++i<videoCount)
				}

				i = 0;
				do {
					var videoBox = videoBoxList[i],
						perVideoBox = null;

					if(0<i) {
						perVideoBox = videoBoxList[i-1];
					}

					if(flag) {
						if(0===i) {
							videoBox.style.left = (videoBoxWrapWidth-(videoBox.offsetWidth + videoBoxList[1].offsetWidth))/2 + "px";
							videoBox.style.top = 0;
						}
					} else {
						if(0===i) {
							videoBox.style.top = (videoBoxWrapHeight-(videoBox.offsetHeight + videoBoxList[1].offsetHeight))/2 + "px";
							videoBox.style.left = 0;
						}
					}

					if(1===i) {
						videoBox.style.top = perVideoBox.offsetTop + "px"
						videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
					}

					if(2===i || 3===i) {
						videoBox.style.top = perVideoBox.offsetTop + perVideoBox.offsetHeight + "px";
						videoBox.style.left = perVideoBox.offsetLeft + "px";
					}

					if(4===i) {
						videoBox.style.top = videoBoxList[0].offsetTop + videoBoxList[0].offsetHeight + "px";
						videoBox.style.left = videoBoxList[0].offsetLeft + "px";
					}

					if(5===i || 6===i || 7===i) {
						videoBox.style.top = perVideoBox.offsetTop + "px";
						videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
					}
				} while (++i<videoCount)
			}

			if(9===videoCount) {
				var i = 0,
					flag = videoBoxWrapWidth/videoBoxWrapHeight>16/9?true:false;

				if(flag) {
					do {
						var videoBox = videoBoxList[i];
						var normalHeight = videoBoxWrapHeight/3;
						videoBox.style.height = normalHeight - 1 + "px";
						videoBox.style.width = normalHeight/9*16 + "px";
					} while(++i<videoCount)
				} else {
					do {
						var videoBox = videoBoxList[i];
						var normalWidth = videoBoxWrapWidth/3;
						videoBox.style.width = normalWidth + "px";
						videoBox.style.height = normalWidth/16*9 + "px";
					} while(++i<videoCount)
				}

				i = 0;
				do {
					var videoBox = videoBoxList[i],
						perVideoBox = null;

					if(0<i) {
						perVideoBox = videoBoxList[i-1];
					}

					if(flag) {
						if(0===i) {
							videoBox.style.left = (videoBoxWrapWidth - videoBox.offsetWidth*3)/2 + "px";
							videoBox.style.top = 0;
						}
					} else {
						if(0===i) {
							videoBox.style.left = 0;
							videoBox.style.top = (videoBoxWrapHeight - videoBox.offsetHeight*3)/2 + "px";
						}
					}

					if(1===i || 2===i || 4===i || 5===i || 7===i || 8===i) {
						videoBox.style.top = perVideoBox.offsetTop + "px";
						videoBox.style.left = perVideoBox.offsetLeft + perVideoBox.offsetWidth + "px";
					}

					if(3===i) {
						videoBox.style.top = videoBoxList[0].offsetTop + videoBox.offsetHeight + "px";
						videoBox.style.left = videoBoxList[0].offsetLeft + "px";
					}

					if(6===i) {
						videoBox.style.top = videoBoxList[0].offsetTop + videoBox.offsetHeight*2 + "px";
						videoBox.style.left = videoBoxList[0].offsetLeft + "px";
					}
				} while (++i<videoCount)
			}
		}
	};

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["layout"] = new Layout();
})(window)