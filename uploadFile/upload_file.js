/**
*
*@Author Jason
*@Date 2016-12-28
*@Describe file uploader
*
**/
;(function() {
	"use strict"
	var win = window,
		doc = document,
		uploaderList = [],
		uploaderMap = {},
		toString = Object.prototype.toString,
		reader = new FileReader(),
		tpl1 = "<li><span>FILENAME</span><span><span class='progress-wrap'><span class='progress'></span></span></span><span>STATE</span></li>",
		acceptTypes = {
			"*.3gpp": "audio/3gpp,video/3gpp",
			"*.ac3": "audio/ac3",
			"*.asf": "allpication/vnd.ms-asf",
			"*.au": "audio/basic",
			"*.css": "text/css",
			"*.csv": "text/csv",
			"*.doc": "application/msword",
			"*.dot": "application/msword",
			"*.dtd": "application/xml-dtd",
			"*.dwg": "image/vnd.dwg",
			"*.dxf": "image/vnd.dxf",
			"*.gif": "image/gif",
			"*.htm": "text/html",
			"*.html": "text/html",
			"*.jp2": "image/jp2",
			"*.jpe": "image/jpeg",
			"*.jpeg": "image/jpeg",
			"*.jpg": "image/jpeg",
			"*.js": "text/javascript,application/javascript",
			"*.json": "application/json",
			"*.mp2": "audio/mpeg,video/mpeg",
			"*.mp3": "audio/mpeg",
			"*.mp4": "audio/mp4,video/mp4",
			"*.mpeg": "video/mpeg",
			"*.mpg": "video/mpeg",
			"*.mpp": "application/vnd.ms-project",
			"*.ogg": "application/ogg,audio/ogg",
			"*.pdf": "application/pdf",
			"*.png": "image/png",
			"*.pot": "application/vnd.ms-powerpoint",
			"*.pps": "application/vnd.ms-powerpoint",
			"*.ppt": "application/vnd.ms-powerpoint",
			"*.rtf": "application/rtf,text/rtf",
			"*.svf": "image/vnd.svf",
			"*.tif": "image/tiff",
			"*.tiff": "image/tiff",
			"*.txt": "text/plain",
			"*.wdb": "application/vnd.ms-works",
			"*.wps": "application/vnd.ms-works",
			"*.xhtml": "application/xhtml+xml",
			"*.xlc": "application/vnd.ms-excel",
			"*.xlm": "application/vnd.ms-excel",
			"*.xls": "application/vnd.ms-excel",
			"*.xlt": "application/vnd.ms-excel",
			"*.xlw": "application/vnd.ms-excel",
			"*.xml": "text/xml,application/xml",
			"*.zip": "aplication/zip",
			"*.xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		};

	var ele = {
		addEvent: win.addEventListener?function(target, type, fn, use) {
			target.addEventListener(type, fn, use||false);
		}:function(target, type, fn) {
			target.attachEvent("on"+type, fn);
		},
		getEleById: function(id) {
			return doc.getElementById(id);
		},
		getElesByClass: function() {
			var args = [].slice.call(arguments, 0),
				firstArg = args.shift();
			return "[object String]"===toString.call(firstArg)?doc.getElementsByClassName(firstArg):firstArg.getElementsByClassName(args.shift()||"");
		},
		attr: function(ele, attrName, attrVal) {
			ele.setAttribute(attrName, attrVal);
		},
		createEle: function(type) {
			return doc.createElement(type);
		}
	};

	/*var tool = {
		checkSize: function(files, box, maxSize) {
			var i = 0, len = files.length, flag = false;

			if(len>i) {
				do {
					var file = files[i];
					file.size>maxSize && box.push(file);
				} while(++i<len)
			}

			box.length>0 && (flag = true);
			return flag;
		},
		readFile: function(files) {
			var i = 0,
				len = files.length,
				filesData = [];

			if(len<=i) return ;

			do {
				(function(file) {
					var reader = new FileReader();
					reader.readAsBinaryString(file);
					ele.addEvent(reader, "load", function() {
						//console.log(this.result);
					});

					ele.addEvent(reader, "loadend", function() {
						//console.log(this.result);
					});

					ele.addEvent(reader, "progress", function() {
						//console.log(this.result);
					});
				}(files[i]))
			} while(++i<len)

			this.send();
		},
		send: function(file, opts) {
			var xhr = new XMLHttpRequest();
			xhr.sendData = function() {

			};

			xhr.onreadstatechange = function() {

			};

			xhr.open("post", opts.url+"?fileName="encodeURIComponent(file.name)+"&fileSize="+file.size+"&lastModifyTime="+file.lastModifyTime, true);
			xhr.overrideMimeType("application/octet-stream;charset=utf-8");
		}
	};*/

	function init(fileUploader) {
		var opts = fileUploader.option,
			ul = ele.createEle("UL"),
			uploaderBox = opts.uploaderBox;

		opts.multi && ele.attr(uploaderBox, "multiple", "multiple");
			
		if(opts.accept.trim()) {
			var acceptList = opts.accept.split(",");
			acceptList.unique();
			acceptList.map(function() {
				var args = [].slice.call(arguments, 0);
				args.pop()[args.pop()] = acceptTypes[args.pop()];
			});
			ele.attr(uploaderBox, "accept", acceptList.join(","));
		}

		ele.addEvent(opts.uploaderBox, "change", function() {
			var fileList = [].slice.call(opts.uploaderBox.files, 0),
				len = fileList.length,
				i = 0;

			if(len<=i) return ;

			do {
				(function(data) {
					var file = {
						size: data.size,
						lastModifyTime: data.lastModifiedDate,
						data: "",
						name: data.name,
						type: data.type
					};
					var li = ele.createEle("LI");

					fileUploader.files.push(file);
				}(fileList[i]))
			} while(++i<len)

			/*if(opts.maxSize && !isNaN(opts.maxSize)) {
				fileUploader.overSizeFiles = [];
				fileUploader.hasOverSizeFile = tool.checkSize(files, fileUploader.overSizeFiles, +opts.maxSize);
			}

			if(self.hasOverSizeFile) return ;
			tool.readFile(files);*/
		});
	}

	function FileUploader(opts) {
		this.name = "FileUploader";
		if(!this instanceof FileUploader) {
			return new FileUploader(opts);
		}
		this.option = opts;
		this.files = [];
		this.overSizeFiles = [];
		this.hasOverSizeFile = false;
		init(this);
	}

	FileUploader.prototype = {
		constructor: FileUploader,
		pause: function() {},
		stop: function() {},
		start: function() {}
	};

	win.fileUploader = {
		init: function(opts) {
			if(!opts.uploaderBox) return ;
			var uploader = new FileUploader(opts);
			opts.name!==void 0 && (uploaderMap[opts.name] = uploader);
			uploaderList.push(uploader);
			return uploader;
		},
		getUploaderByIndex: function(index) {
			if(index===void 0) return ;
			return uploaderList[index];
		},
		getUploaderByName: function(name) {
			if(name===void 0) return ;
			return uploaderMap[name];
		}
	};

	/*{
		uploaderBox: "",
		maxSize: 2000,
		allowType: "",
		progressWrap: ""
		multi: false,
		sizeOver: function() {},
		success: function() {},
		error: function() {}
	}*/
}(undefined))