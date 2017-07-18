
;(function(fn, $, undefined) {
	var win = window,
		doc = document,
		duang = fn.call(Object.create(null));

	/**
	 *
	 *数据模型层，这里是所有对后台的接口
	 *
	 */
	var DataService = function() {
		var baseUrl = "localhost",
			toString = Object.prototype.toString;

		return {
			/**
			 *获取初始化数据
			 *@param paramsObj   {mid: mid}
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			getInitData: function(paramObj, success, fail) {
				var url = baseUrl + "";
				$.post(url, paramObj, function(result) {
					if(!result || 0===result.code) {
						fail.call(this, result);
					} else {
						success.call(this, result);
					}
				});

				success.call(this, null);
			},
			/**
			 *设置录制模式
			 *@param paramsObj   {mid: mid, mode: 1}
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			setRecordMode: function(paramObj, success, fail) {

			},
			/**
			 *设置资源录制哪几个画面
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			setRecordCamera: function(paramObj, success, fail) {

			},
			/**
			 *获取所有片头片尾
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			getMovieHeadOrTailList: function(paramObj, success, fail) {},
			/**
			 *新增片头片尾
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			addMovieHeadOrTail: function(paramObj, success, fail) {},
			/**
			 *删除片头片尾
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			removeMovieHeadOrTail: function(paramObj, success, fail) {},
			/**
			 *编辑片头片尾
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			updateMovieHeadOrTail: function(paramObj, success, fail) {},
			/**
			 *使用片头
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			useMovieHead: function(paramObj, success, fail) {},
			/**
			 *使用片尾
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			useMovieTail: function(paramObj, success, fail) {},
			/**
			 *设置录制状态
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			setRecordState: function(paramObj, success, fail) {},
			/**
			 *获取所有台标
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			getSignList: function(paramObj, success, fail) {},
			/**
			 *新增台标
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			addSign: function(paramObj, success, fail) {},
			/**
			 *删除台标
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			removeSign: function(paramObj, success, fail) {},
			/**
			 *编辑台标
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			updateSign: function(paramObj, success, fail) {},
			/**
			 *使用台标
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			useSign: function(paramObj, success, fail) {},
			/**
			 *使用特效
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			useSlide: function(paramObj, success, fail) {},
			/**
			 *编辑字幕
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			updateMovieText: function(paramObj, success, fail) {},
			/**
			 *使用字幕
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			useMovieText: function(paramObj, success, fail) {},
			/**
			 *设置导播模式
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			setDirectorMode: function(paramObj, success, fail) {},
			/**
			 *设置画面模式
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			setMovieMode: function(paramObj, success, fail) {},
			/**
			 *设置预置位
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			setPresetSite: function(paramObj, success, fail) {},
			/**
			 *设置快捷键
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			setShortcutKey: function(paramObj, success, fail) {},
			/**
			 *获取所有字幕
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			getMovieTextList: function(paramObj, success, fail) {},
			/**
			 *新增字幕
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			addMovieText: function(paramObj, success, fail) {},
			/**
			 *删除字幕
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			removeMovieText: function(paramObj, success, fail) {},
			/**
			 *获取所有机位
			 *@param paramsObj
			 *		 success  请求成功后的回调
			 *		 fail  请求失败后的回调
			 */
			getCameraList: function(paramObj, success, fail) {}
		};
	};

    /**
	 * 入口，其它各个模块的初始化工作都将在这个模块完成
     * @param tool	工具模块对象，文件：public/webpc/js/tool.js
     * @param dataService	数据模块对象，用于与后端交互，获取数据
     * @param recordController	录制模块对象，录制的开始，暂停，停止，添加片头/片尾等等与录制相关的操作都在这个模块定义
     * @param specialController	特效模块对象，视频画面切换的特效等功能都在这个模块定义
     * @constructor
     */
	var IndexController = function(tool, dataService, recordController, specialController) {
		var directorWrap = doc.getElementsByClassName("director-wrap")[0];
		resizeWin();

		dataService.getInitData({}, function(data) {
			initPage(data);
		});

		function initPage(data) {
			recordController.init(data);
			specialController.init(data);
		}

		function resizeWin() {
			var bodyWidth = doc.body.clientWidth,
				bodyHeight = doc.body.clientHeight,
				directorWrapWidth = directorWrap.offsetWidth,
				directorWrapHeight = directorWrap.offsetHeight;

			directorWrap.style.top = ((bodyHeight-directorWrapHeight)/2>=0?(bodyHeight-directorWrapHeight)/2:0)+"px";
			//directorWrap.style.transform = "scale("+(bodyWidth<=1366?1:bodyWidth/directorWrapWidth)+")";
		}

		tool.addEvent(win, "resize", function() {
			resizeWin();
		});

		tool.addEvent("#quit_btn", "click", function() {
			history.back();
		});
	};

    /**
	 * 录制模块
     * @param tool	工具模块对象，文件：public/webpc/js/tool.js
     * @param remote	通讯模块，此模块用于与课堂交互
     * @param select	下拉框组件对象，文件：public/webpc/onlineClass/inside/v5.6/director/js/select.js
     * @param win	弹出层组件对象，文件：public/webpc/js/win_list.js
     * @param dataService	数据模块对象，用于与后端交互，获取数据
     * @param tab
     * @returns {{name: string, init: init}}
     * @constructor
     */
	var RecordController = function(tool, remote, select, win, dataService, tab) {
		var tpl = "\
					<tr>\
						<td>$CAMERANAME$</td>\
						<td><input class='checkbox' type='checkbox'/>录制</td>\
						<td>\
							<span><input type='radio' name='$NAME$' class='radio' value='6000'>普清</span>\
							<span><input type='radio' name='$NAME$' class='radio' value='4000'/>高清</span>\
							<span><input type='radio' name='$NAME$' class='radio' value='2000'/>超清</span>\
						</td>\
					</tr>";

		var recordCameras = {},
			recordQuality = {},
			isRecording = false,
			recordMode = 1,
			recordHeads = [],
			recordTails = [],
			canSetCameras = true;

		//勾选录制机位的弹出框
		var recordCamerasDialog = win.alert({
			id: "record_camera_tpl",
			title: "录制设置",
			footer: false,
			width: 600,
			height: 400,
			close: function() {}
		});

		//片头/片尾的弹出框
		var titleOrTailDialog = win.alert({
			id: "record_tt_tpl",
			title: "片头/片尾设置",
			footer: false,
			width: 700,
			height: 500,
			close: function() {}
		});

		//公共弹出框
		var publicWin = win.alert({
			title: "提示",
			auto: true,
			time: 3000,
			width: 350,
			footer: false,
			close: function() {}
		});

		var tt = tab.init({
			wrap: titleOrTailDialog.winObj.getElementsByClassName("tab-wrap")[0],
			list: [{label:"片头列表", id:1, linkId:"head_list_wrap"}, {label:"片尾列表", id:2, linkId:"tail_list_wrap"}, {label:"新增片头/片尾", id:3, linkId:"ht_add_wrap"}],
			select: function(d) {
				tt.addItem(d);
			}
		});

		tool.addEvent("#show_camera_btn", "click", function() {
			if(isRecording) {
				publicWin.open("录制过程中不允许设置录制机位！");
				return ;
			}
			recordCamerasDialog.open();
		});

		tool.addEvent("#tt_set_btn", "click", function() {
			titleOrTailDialog.open();
		});

		tool.addEvent(titleOrTailDialog.winObj.getElementsByClassName("sure-btn")[0], "click", function() {
			var formData = tool.serialize("addHeadTial");

			if(void(0)!==formData.headName && ""!==formData.headName.trim()) {
				var i = 0, len = recordHeads.length;

				if(len>i) {
					do {
						var recordHead = recordHeads[i];
						if(recordHead.name.trim()===formData.headName.trim()) {
							publicWin.open("片头名重复！");
							return ;
						}
					} while(++i<len)
				}

				if(0===Number(formData.headType) && (!formData.headTime || isNaN(formData.headTime) || 0===Number(formData.headTime))) {
					publicWin.open("请为片头设置有效的时长！");
					return ;
				}

				if(!formData.url) {
					publicWin.open("请为片头上传"+(0===Number(formData.headType)?"图片":"视频")+"！");
					return ;
				}

				dataService.addMovieHeadOrTail({type:formData.headType, name:formData.headName, time:formData.headTime, url:formData.headUrl, style:0}, function(d) {
					recordHeads.push(d);
				});
			}

			if(void(0)!==formData.tailName && ""!==formData.tailName.trim()) {
				var i = 0, len = recordTails.length;

				if(len>i) {
					do {
						var recordTail = recordTails[i];
						if(recordTail.name.trim()===formData.tailName.trim()) {
							publicWin.open("片尾名重复！");
							return ;
						}
					} while(++i<len)
				}

				if(0===Number(formData.tailTime) && (!formData.tailTime || isNaN(formData.tailTime) || 0===Number(formData.tailTime))) {
					publicWin.open("请为片尾设置有效的时长！");
					return ;
				}

				if(!formData.url) {
					publicWin.open("请为片尾上传"+(0===Number(formData.tailType)?"图片":"视频")+"！");
					return ;
				}

				dataService.addMovieHeadOrTail({type:formData.tailType, name:formData.tailName, time:formData.tailTime, url:formData.tailUrl, style:1}, function(d) {
					recordTails.push(d);
				});
			}
		});

		var record = {
			name: "RecordController",
			init: function(params) {
				select.init({
					wrap: doc.getElementById("record_mode_wrap"),
					data: [{name: "电影", id: 1}, {name: "资源", id: 2}, {name: "电影+资源", id: 3}],
					showParam: "name",
					valParam: "id",
					defaultShow: "请选择",
					value: 1,
					name: "recordMode",
					select: function(d) {
						recordMode = d.id;
					}
				});

				dataService.getMovieHeadOrTailList({style: 0}, function(data) {
					select.init({
						wrap: doc.getElementById("movie_header_wrap"),
						data: data,
						showParam: "name",
						valParam: "id",
						defaultShow: "请选择",
						name: "movieHeader",
						select: function(d) {

						}
					});

					
					recordHeads = data;
				});

				dataService.getMovieHeadOrTailList({style: 1}, function(data) {
					select.init({
						wrap: doc.getElementById("movie_tail_wrap"),
						data: data,
						showParam: "name",
						valParam: "id",
						defaultShow: "请选择",
						name: "movieTail",
						select: function(d) {

						}
					});

					recordTails = data;
				});

				dataService.getCameraList(null, function(data) {
					var i = 0, len = data.length;
					if(i>=len) return ;
					do {
						(function(index) {
							var camera = data[index],
								_tpl = tpl.replace(/\$CAMERANAME\$/g, camera.name).replace(/\$NAME\$/g, "camera"+index),
								ele = tool.createElement(_tpl);

							tool.addEvent(ele.getElementsByClassName("checkbox"), "click", function() {
								var e = arguments[0] || window.event;

								if(canSetCameras) {
									if(this.checked) {
										recordCameras[camera.id] = 1;
									} else {
										delete recordCameras[camera.id];
									}
								} else {
									e.preventDefault();
									e.stopPropagation();
								}
							});

							tool.addEvent(ele.getElementsByClassName("radio"), "click", function() {
								if(canSetCameras) {
									recordCameras[camera.id] = this.value;
								} else {
									e.preventDefault();
									e.stopPropagation();
								}
							});
						}(i));
					} while(++i<len)
				});
				
				if(remote) {
					remote.send();
				} else {
					//本地导播不访问远程课堂
				}
			}
		};

		return record;
	};

    /**
	 * 特效等功能控制模块
     * @param tool	工具模块对象，文件：public/webpc/js/tool.js
     * @param remote	通讯模块，此模块用于与课堂交互
     * @param select	下拉框组件对象，文件：public/webpc/onlineClass/inside/v5.6/director/js/select.js
     * @param dataService	数据模块对象，用于与后端交互，获取数据
     * @returns {{name: string, init: init}}
     * @constructor
     */
	var SpecialController = function(tool, remote, select, dataService) {
		var directorBtn = null,
			directorMode = 1,
			mainSpeaker = "";

		var special = {
			name: "SpecialController",
			init: function(params) {
				//mainSpeaker = params.mainId;

				tool.addEvent(".director-mode-btn", "click", function() {
					if(this===directorBtn) return ;
					tool.removeClass(directorBtn, "selected");
					tool.addClass(this, "selected");
					directorBtn = this;
					directorMode = tool.attr(this, "mode");
					remote.send(mainSpeaker, "setDirectorMode", directorMode);
				});
			}
		};

		return special;
	};

    /**
	 * 公共模块，定义一些公共接口，方便各个模块调用
     * @param tool
     * @returns {{name: string, fn: fn}}
     * @constructor
     */
	var CommonController = function(tool) {
		var toString = Object.prototype.toString;

		var common = {
			name: "CommonController",
			fn: function() {
				var self = this,
					args = [].slice.call(arguments, 0);
				if(!args[0] || "[object Function]"===toString.call(args[0])) return ;
				self[args.shift()] = function() {
					var fn = args.shift();
					if(fn && "[object Function]"===toString.call(fn)) {
						return fn.apply(self, [].slice.apply(arguments, 0));
					}
				};
			}
		};

		return common;
	};

	duang.module("OnlineClass", ["Tool", "Component"])
		.service("dataService", DataService)
		.controller("common", ["tool"], CommonController)
		.controller("recordController", ["tool", "remote", "select", "win", "dataService", "tab"], RecordController)
		.controller("specialController", ["tool", "remote", "select", "dataService"], SpecialController)
		.controller("indexController", ["tool", "dataService", "recordController", "specialController"], IndexController);
}(function() {
	return window.duang || null;
}, jQuery));