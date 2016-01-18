(function(win) {
	var selectData = [], selectedData = [], wrap = {}, leftTemp = {data:[], node:[]}, rightTemp = {data:[], node:[]};
	var temp = "<div class='multiSelect2Side_wrap'> \
					<div class='left_wrap'><span class='title' title='&LEFTTITLE&'>&LEFTTITLE&</span><div class='list_wrap'><ul class='list_ul' id='leftList'></ul></div></div> \
					<div class='ctrl_wrap'> \
						<input type='button' action='selectAll' class='selectBtn' value='选择全部'/> \
						<input type='button' action='select' class='selectBtn' value='选择'/> \
						<input type='button' action='cancel' class='selectBtn' value='取消'> \
						<input type='button' action='cancelAll' class='selectBtn' value='取消全部'/> \
					</div> \
					<div class='right_wrap'><span class='title' title='&RIGHTTITLE&'>&RIGHTTITLE&</span><div class='list_wrap'><ul class='list_ul' id='rightList'></ul></div></div> \
				</div>";

	var DE = {
		"CE": function(type) {
			return document.createElement(type);
		},
		"GE": function(selector) {
			var el = null;
			el = document.querySelector("#"+selector);
			if(!el) {
				el = document.querySelectorAll("."+selector);
			}
			if(!el) {
				el = document.getElementById(selector);
			}
			if(!el) {
				el = document.getElementsByClassName(selector);
			}
			return el;
		},
		"AC": function(el, classname) {
			if(-1==el.className.indexOf(classname))
				el.className = el.className.replace(/(^\s)|(\s$)/g, "") + " " + classname;
		},
		"RC": function(el, classname) {
			el.className = el.className.replace(classname, "").replace(/(^\s)|(\s$)/g, "");
			if(""==el.className) el.removeAttribute("class");
		},
		"build": function(data, opts, key) {
			var that = this;
			var frag = document.createDocumentFragment();

			var createLi = function(data) {
				var li = that.CE("li");
				var show = data[opts.show];
				li.innerHTML = show;
				li.title = show;

				(function(data, li, temp, key) {
					var isdb = false;

					var clickHandle = function(data, li, temp, key) {
						isdb = false;
						setTimeout(function() {
							if(!isdb) {
								var datas = temp.data;
								var nodes = temp.node;
								if(-1==li.className.indexOf("selected")) {
									if("left"==key && 0==datas.length) {
										var len = rightTemp.node.length;
										while(len--) {
											var node = rightTemp.node.splice(len, 1)[0];
											DE.RC(node, "selected");
											rightTemp.data.splice(len, 1);
										}
									}
									if("right"==key && 0==datas.length) {
										var len = leftTemp.node.length;
										while(len--) {
											var node = leftTemp.node.splice(len, 1)[0];
											DE.RC(node, "selected");
											leftTemp.data.splice(len, 1);
										}
									}
									DE.AC(li, "selected");
									datas.push(data);
									nodes.push(li);
								} else {
									DE.RC(li, "selected");
									nodes.splice(nodes.indexOf(li), 1);
									datas.splice(datas.indexOf(data), 1);
								}
								opts.select.call(li, data);
							}
						}, 300);
					};

					EV.bind(li, "click", function() {
						clickHandle(data, li, temp, key);
					});

					var dbHandle = function(data, li, temp, key) {
						isdb = true;
						DE.RC(li, "selected");
						var cloneLi = li.cloneNode(true);

						cloneLi.ondblclick = (function(data, cloneLi, temp, key){
							return function() {
								dbHandle(data, cloneLi, "left"==key?rightTemp:leftTemp, "left"==key?"right":"left");
							};
						})(data, cloneLi, temp, key);

						EV.bind(cloneLi, "click", function() {
							clickHandle(data, cloneLi, "left"==key?rightTemp:leftTemp, "left"==key?"right":"left");
						});
						
						li.parentNode.removeChild(li);
						if("left"==key) {
							selectedData.push(data);
							selectData.splice(selectData.indexOf(data), 1);
						} else {
							selectData.push(data);
							selectedData.splice(selectedData.indexOf(data), 1);
						}
						DE.GE("left"==key?"rightList":"leftList").appendChild(cloneLi);
					};

					li.ondblclick = function() {
						dbHandle(data, li, temp, key);
					};
				})(data, li, "left"==key?leftTemp:rightTemp, key);

				frag.appendChild(li);
			};

			if(Object.prototype.toString.call(data)=="[object Array]") {
				for(var i=0,len=data.length; i<len; i++) {
					var d = data[i];
					createLi(d)
				}
			}

			if(Object.prototype.toString.call(data)=="[object Object]") {
				createLi(data);
			}
			return frag;
		}
	};

	var EV = {
		"bind": function(target, type, fn, useCapture) {
			var slice = Array.prototype.slice;
			var box = slice.call(target);
			if(box.length>0) target = box;
			if(document.addEventListener) {
				if(Object.prototype.toString.call(target)=="[object Array]") {
					var len = target.length;
					while(len--) {
						target[len].addEventListener(type, fn, useCapture||false);
					}
				} else {
					target.addEventListener(type, fn, useCapture||false);
				}
			} else {
				if(Object.prototype.toString.call(target)=="[object Array]") {
					var len = target.length;
					while(len--) {
						target[len].attachEvent("on"+type, fn);
					}
				} else {
					target.attachEvent("on"+type, fn);
				}
			}
		}
	};

	var DATA = {
		"copy": function(data, box) {
			var _copy = function(data, box) {
				for(var i in data) {
					var _data = data[i];
					var _box = null;
					if(Object.prototype.toString.call(_data)=="[object Array]") {
						_box = [];
						_copy(_data, _box);
					} else if(Object.prototype.toString.call(_data)=="[object Object]") {
						_box = {};
						_copy(_data, _box);
					} else {
						_box = _data;
					}
					box[i] = _data;
				}
			};
			_copy(data, box);
		}
	};

	var multiSelect2Side = function(opts) {
		wrap = DE.GE(opts.selector);
		DATA.copy(opts.data, selectData);
		delete opts.data;
		DATA.copy(opts.selectedData, selectedData);
		delete opts.selectedData;
		var tpl = temp;
		tpl = tpl.replace(/&LEFTTITLE&/g, opts.leftTitle);
		tpl = tpl.replace(/&RIGHTTITLE&/g, opts.rightTitle);
		var leftList = DE.build(selectData, opts, "left");
		var rightList = DE.build(selectedData, opts, "right");
		wrap.innerHTML = tpl;
		DE.GE("leftList").appendChild(leftList);
		DE.GE("rightList").appendChild(rightList);
		EV.bind(DE.GE("selectBtn"), "click", function() {
			var action = this.getAttribute("action");
			switch(action) {
				case "selectAll":
				var allLi = [];
				var frag = document.createDocumentFragment();
				var leftAllChilds = DE.GE("leftList").childNodes;
				var len = leftAllChilds.length;
				var i = 0;
				while(i<len) {
					var node = leftAllChilds[i];
					if(node.nodeType==1 && node.tagName.toLowerCase()=="li") {
						allLi.push(node);
					}
					i++;
				}
				len = allLi.length;
				while(len--) {
					var node = allLi[len];
					DE.RC(node, "selected");
					var d = selectData.splice(len, 1)[0];
					selectedData.push(d);
					var cloneLi = node.cloneNode(true);
					node.parentNode.removeChild(node);
					frag.appendChild(cloneLi);
					(function(data, li, temp) {
						EV.bind(li, "click", function() {
							if(-1==this.className.indexOf("selected")) {
								if(0==temp.data.length) {
									var len = leftTemp.node.length;
									while(len--) {
										var node = leftTemp.node.splice(len, 1)[0];
										that.RC(node, "selected");
										leftTemp.data.splice(len, 1);
									}
								}
								DE.AC(this, "selected");
								temp.data.push(data);
								temp.node.push(this);
							} else {
								DE.RC(this, "selected");
								var len = temp.node.length;
								while(len--) {
									if(temp.node[len]==this) {
										temp.node.splice(len, 1);
										temp.data.splice(len, 1);
									}
								}
							}
							opts.select.call(this, data);
						});
					})(d, cloneLi, rightTemp);
				}
				DE.GE("rightList").appendChild(frag);
				rightTemp.node.splice(0, rightTemp.node.length);
				rightTemp.data.splice(0, rightTemp.data.length);
				leftTemp.node.splice(0, leftTemp.node.length);
				leftTemp.data.splice(0, leftTemp.data.length);
				break;
				case "select":
				var datas = leftTemp.data;
				var nodes = leftTemp.node;
				if(datas.length<=0) return ;
				var len = nodes.length;
				var frag = document.createDocumentFragment();
				while(len--) {
					var li = nodes.splice(len, 1)[0];
					var d = datas.splice(len, 1)[0];
					selectedData.push(d);
					selectData.splice(selectData.indexOf(d), 1);
					DE.RC(li, "selected");
					var cloneLi = li.cloneNode(true);
					frag.appendChild(cloneLi);
					li.parentNode.removeChild(li);
					(function(data, li, temp) {
						EV.bind(li, "click", function() {
							if(-1==this.className.indexOf("selected")) {
								if(0==temp.data.length) {
									var len = leftTemp.node.length;
									while(len--) {
										var node = leftTemp.node.splice(len, 1)[0];
										that.RC(node, "selected");
										leftTemp.data.splice(len, 1);
									}
								}
								DE.AC(this, "selected");
								temp.data.push(data);
								temp.node.push(this);
							} else {
								DE.RC(this, "selected");
								var len = temp.node.length;
								while(len--) {
									if(temp.node[len]==this) {
										temp.node.splice(len, 1);
										temp.data.splice(len, 1);
									}
								}
							}
							opts.select.call(this, data);
						});
					})(d, cloneLi, rightTemp);
				}
				DE.GE("rightList").appendChild(frag);
				break;
				case "cancel":
				var datas = rightTemp.data;
				var nodes = rightTemp.node;
				if(datas.length<=0) return ;
				var len = nodes.length;
				var frag = document.createDocumentFragment();
				while(len--) {
					var li = nodes.splice(len, 1)[0];
					var d = datas.splice(len, 1)[0];
					selectData.push(d);
					selectedData.splice(selectedData.indexOf(d), 1);
					DE.RC(li, "selected");
					var cloneLi = li.cloneNode(true);
					frag.appendChild(cloneLi);
					li.parentNode.removeChild(li);
					(function(data, li, temp) {
						EV.bind(li, "click", function() {
							if(-1==this.className.indexOf("selected")) {
								if(0==temp.data.length) {
									var len = rightTemp.node.length;
									while(len--) {
										var node = rightTemp.node.splice(len, 1)[0];
										that.RC(node, "selected");
										rightTemp.data.splice(len, 1);
									}
								}
								DE.AC(this, "selected");
								temp.data.push(data);
								temp.node.push(this);
							} else {
								DE.RC(this, "selected");
								var len = temp.node.length;
								while(len--) {
									if(temp.node[len]==this) {
										temp.node.splice(len, 1);
										temp.data.splice(len, 1);
									}
								}
							}
							opts.select.call(this, data);
						});
					})(d, cloneLi, leftTemp);
				}
				DE.GE("leftList").appendChild(frag);
				break;
				case "cancelAll":
				var allLi = [];
				var frag = document.createDocumentFragment();
				var rightAllChilds = DE.GE("rightList").childNodes;
				var len = rightAllChilds.length;
				var i = 0;
				while(i<len) {
					var node = rightAllChilds[i];
					if(node.nodeType==1 && node.tagName.toLowerCase()=="li") {
						allLi.push(node);
					}
					i++;
				}
				len = allLi.length;
				while(len--) {
					var node = allLi[len];
					DE.RC(node, "selected");
					var d = selectedData.splice(len, 1)[0];
					selectData.push(d);
					var cloneLi = node.cloneNode(true);
					node.parentNode.removeChild(node);
					frag.appendChild(cloneLi);
					(function(data, li, temp) {
						EV.bind(li, "click", function() {
							if(-1==this.className.indexOf("selected")) {
								if(0==temp.data.length) {
									var len = rightTemp.node.length;
									while(len--) {
										var node = rightTemp.node.splice(len, 1)[0];
										that.RC(node, "selected");
										rightTemp.data.splice(len, 1);
									}
								}
								DE.AC(this, "selected");
								temp.data.push(data);
								temp.node.push(this);
							} else {
								DE.RC(this, "selected");
								var len = temp.node.length;
								while(len--) {
									if(temp.node[len]==this) {
										temp.node.splice(len, 1);
										temp.data.splice(len, 1);
									}
								}
							}
							opts.select.call(this, data);
						});
					})(d, cloneLi, leftTemp);
				}
				DE.GE("leftList").appendChild(frag);
				rightTemp.node.splice(0, rightTemp.node.length);
				rightTemp.data.splice(0, rightTemp.data.length);
				leftTemp.node.splice(0, leftTemp.node.length);
				leftTemp.data.splice(0, leftTemp.data.length);
				break;
			}
		});
	};

	multiSelect2Side.prototype = {
		"constructor": this,
		"getSelected": function() {
			return selectedData;
		}
	};

	var ms2s = {};
	ms2s.init = function(opts) {
		if(!opts.selector || !DE.GE(opts.selector)) return ;
		return new multiSelect2Side(opts);
	};
	win.multiSelect2Side = ms2s;
})(window)