(function(win) {
	var et = {};

	et.init = function(opts) {
		if(!opts.id || !opts.data) return ;
		if(opts.data.constructor===Array && 0==opts.data.length) return ;

		var has = function(d, list) {
			var flag = false;
			for(var i=0,len=list.length; i<len; i++) {
				if(list[i].id==d.id) {
					flag = true;
					break;
				}
			}
			return flag;
		};

		var checkChilds = function(ul, data, obj, flag) {
			var childs = [];
			var chks = [];
			var datas = [];
			var selected = obj.getSelected();
			var _getChilds = function(p) {
				var childrens = p.children;
				for(var i=0,len=childrens.length; i<len; i++) {
					childs.push(childrens[i]);
					if(childrens[i].children) {
						_getChilds(childrens[i]);
					}
				}
			};
			var _getDatas = function(d) {
				if(Array===d.constructor) {
					for(var i=0,len=d.length; i<len; i++) {
						var _d = {};
						for(var key in d[i]) {
							if("children"!=key) {
								_d[key] = d[i][key];
							}
						}
						datas.push(_d);
						if(d[i].children) _getDatas(d[i].children);
					}
				} else {
					var _d = {};
					for(var key in d) {
						if("children"!=key) {
							_d[key] = d[key];
						}
					}
					datas.push(_d);
					if(d.children) _getDatas(d.children);
				}
				if(d.children) {
					_getDatas(d.children);
				}
			};
			_getChilds(ul);
			for(var i=0,len=childs.length; i<len; i++) {
				if(1==childs[i].nodeType && "checkbox"==childs[i].type) {
					chks.push(childs[i]);
				}
			}
			_getDatas(data);
			if(flag) {
				for(var i=0,len=chks.length; i<len; i++) {
					chks[i].checked = true;
				}
				for(var i=0,len=datas.length; i<len; i++) {
					if(!has(datas[i], selected)) {
						selected.push(datas[i]);
					}
				}
			} else {
				for(var i=0,len=chks.length; i<len; i++) {
					chks[i].checked = false;
				}
				for(var i=0,len=datas.length; i<len; i++) {
					for(var j=0; j<selected.length; ) {
						if(datas[i].id==selected[j].id) {
							selected.splice(j, 1);
						} else {
							j++;
						}
					}
				}
			}
		};

		var checkParents = function(ul, obj, flag) {
			if(ul.className.indexOf("level-0")!=-1) return;
			var p = ul.parentNode;
			var childs = [];
			var chks = [];
			var count = 0;
			var selected = obj.getSelected();
			var _getChilds = function(p) {
				var childrens = p.children;
				for(var i=0,len=childrens.length; i<len; i++) {
					childs.push(childrens[i]);
					if(childrens[i].children) {
						_getChilds(childrens[i]);
					}
				}
			};
			_getChilds(p);
			for(var i=0,len=childs.length; i<len; i++) {
				if(1==childs[i].nodeType && "checkbox"==childs[i].type) {
					chks.push(childs[i]);
				}
			}
			if(flag) {
				var len = chks.length;
				for(var i=1; i<len; i++) {
					if(chks[i].checked) {
						count++;
					}
				}
				if(count==len-1) {
					chks[0].checked = true;
					var id = chks[0].id;
					for(var j=0,l=obj.opts.__list.length; j<l; j++) {
						if(obj.opts.__list[j].id==id && !has(obj.opts.__list[j], selected)) {
							selected.push(obj.opts.__list[j]);								
						}
					}
				}

			} else {
				chks[0].checked = false;
				var id = chks[0].id;
				for(var i=0; i<selected.length; ) {
					if(selected[i].id==id) {
						selected.splice(i, 1);
					} else {
						i++;
					}
				}
			}
			checkParents(p.parentNode, obj, flag);
		};

		var makeTreeWithCheckbox = function(_p, data, obj, level, _ff) {
			var flag = false;
			var f = false;
			var count = 0;
			var selected = obj.opts.selected;
			var _n = false;
			var dataLen = (data.constructor || Object.prototype.toString.call(data)=="[object Array]")?data.length:1;

			var checkChecked = function(d, selected) {
				var flag = false;
				for(var i=0,len=selected.length; i<len; i++) {
					if(d.id = selected[i].id) {
						flag = true;
						break;
					}
				}
				return flag;
			};

			var makeLeaf = function(d, num) {
				var children = d.children;
				var selectedList = obj.getSelected();
				var ul = children?document.createElement("UL"):null;
				if(ul) {
					ul.setAttribute("show", true);
					ul.className = "level-"+(level+1);
				}
				var li = document.createElement("LI");
				li.className = "level" + "-" + level + "-" + (num?num:1);
				var arrow = document.createElement("span");
				arrow.className = "arrow arrow-up" + (!children?" hide":"");
				if(_ff || checkChecked(d, selected)) _n = true;
				if(children) {
					arrow.onclick = function() {
						if("true"==ul.getAttribute("show")) {
							ul.className = ul.className + " hidden";
							ul.setAttribute("show", false);
							this.className = this.className.replace("arrow-up", "arrow-down");
						} else {
							ul.className = ul.className.replace("hidden", "").replace(/(^\s*)|(\s*$)/g, "");
							ul.setAttribute("show", true);
							this.className = this.className.replace("arrow-down", "arrow-up");
						}
					};
					f = makeTreeWithCheckbox(ul, children, obj, level+1, _n);
				}
				var input = document.createElement("INPUT");
				input.type = "checkbox";
				input.id = d.id;
				if(_ff) {
					input.checked = true;
					var _d = {};
					for(var key in d) {
						_d[key] = d[key];
					}
					if(!has(_d, selectedList)) selectedList.push(_d);
					count++;
				} else {
					if(f || checkChecked(d, selected)) {
						input.checked = true;
						var _d = {};
						for(var key in d) {
							_d[key] = d[key];
						}
						selectedList.push(_d);
						count++;
					}
				}
				
				input.onclick = function() {
					var selectedList = obj.getSelected();
					if(!this.checked) {
						for(var i=0,len=selectedList.length; i<len; i++) {
							if(selectedList[i].id==d.id) {
								selectedList.splice(i, 1);
								break;
							}
						}
					} else {
						if(!has(d, selectedList)) {
							var _d={};
							for(var key in d) {
								if("children"!=key) {
									_d[key] = d[key];
								}
							}
							selectedList.push(_d);
						}
					}
					checkChilds(this.parentNode.lastChild, d, obj, this.checked);
					checkParents(this.parentNode.parentNode, obj, this.checked);
				};
				var span = document.createElement("SPAN");
				span.appendChild(document.createTextNode(d[obj.opts.showParam]));
				for(var key in d) {
					if("children"!=key && obj.opts.showParam!=key) {
						span.setAttribute(key, d[key]);
					}
				}
				span.setAttribute("title", d[obj.opts.showParam]);
				li.appendChild(arrow);
				li.appendChild(input);
				li.appendChild(span);
				if(ul) li.appendChild(ul);
				_p.appendChild(li);
			};

			if(Array===data.constructor) {
				for(var i=0,len=data.length; i<len; i++) {
					var d = data[i];
					makeLeaf(d, i+1);
				}
			} else {
				makeLeaf(data);
			}

			if(count==dataLen) flag = true;
			return flag;
		};

		var makeTreeWithoutCheckbox = function(_p, data, obj, level) {
			var selected = obj.getSelected();
			var makeLeaf = function(d, num) {
				var children = d.children;
				var ul = children?document.createElement("UL"):null;
				if(ul) {
					ul.setAttribute("show", true);
					ul.className = "level" + "-" + (level + 1);
				}
				var li = document.createElement("LI");
				li.className = "level" + "-" + level + "-" + (num?num:1);
				var arrow = document.createElement("span");
				arrow.className = "arrow arrow-up" + (!children?" hide":"");
				if(children) {
					arrow.onclick = function() {
						if("true"==ul.getAttribute("show")) {
							ul.className = ul.className + " hidden";
							ul.setAttribute("show", false);
							this.className = this.className.replace("arrow-up", "arrow-down");
						} else {
							ul.className = ul.className.replace("hidden", "").replace(/(^\s*)|(\s*$)/g, "");
							ul.setAttribute("show", true);
							this.className = this.className.replace("arrow-down", "arrow-up");
						}
					};
					makeTreeWithoutCheckbox(ul, children, obj, level+1);
				}
				var a = document.createElement("A");
				for(var key in d) {
					if("children"!=key && obj.opts.showParam!=key) {
						a.setAttribute(key, d[key]);
					}
				}
				a.title = d[obj.opts.showParam];
				a.onclick = function() {
					var _d = {};
					for(var key in d) {
						if("children"!=key) {
							_d[key] = d[key];
						}
					}
					obj.opts.select.call(this, _d);
					var oldVal = obj.getSelected();
					if(oldVal.length>0) {
						var o_a = document.getElementById(oldVal[0].id);
						o_a.className = o_a.className.replace("selected", "").replace(/(^\s*)|(\s*$)/g, "");
						obj.cleanSelected();
					}
					var selected = obj.getSelected();
					selected.push(_d);
					this.className = (this.className.replace(/(^\s*)|(\s*$)/g, "") + " selected").replace(/(^\s*)|(\s*$)/g, "");
				};
				for(var i=0,len=obj.opts.selected.length; i<len; i++) {
					if(obj.opts.selected[i].id==d.id) {
						a.className = (a.className.replace(/(^\s*)|(\s*$)/g, "") + " selected").replace(/(^\s*)|(\s*$)/g, "");
						var _d = {};
						for(var key in d) {
							if("children"!=key) _d[key] = d[key];
						}
						selected.push(_d);
					}
				}
				var span = document.createElement("SPAN");
				span.appendChild(document.createTextNode(d[obj.opts.showParam]));
				a.appendChild(span);
				li.appendChild(arrow);
				li.appendChild(a);
				if(ul) li.appendChild(ul);
				_p.appendChild(li);
			};

			if(Array===data.constructor || Object.prototype.toString.call(data)=="[object Array]") {
				for(var i=0,len=data.length; i<len; i++) {
					var d = data[i];
					makeLeaf(d, i+1);
				}
			} else {
				makeLeaf(data);
			}
		};

		var _makeTree = function(_p, data, obj, level) {
			if(obj.opts.checkbox) {
				makeTreeWithCheckbox(_p, data, obj, level, false);
			} else {
				makeTreeWithoutCheckbox(_p, data, obj, level);
			}
		};

		var makeTree = function(obj) {
			var level = "level-0";
			var wrap = document.getElementById(obj.opts.id);
			var data = obj.opts.data;
			var ul = document.createElement("UL");
			ul.className = level;
			ul.id = "eTree";
			_makeTree(ul, data, obj, 0);
			wrap.appendChild(ul);
		};

		//数据组织
		var groupData = function(isPid, dataList, _d) {
			if(!isPid) {
				if(Array===_d.constructor) {
					for(var i=0, len=_d.length; i<len; i++) {
						var data = {};
						for(var key in _d[i]) {
							if("children"!=key) data[key]=_d[i][key];
						}
						dataList.push(data);
						if(_d[i].children) groupData(isPid, dataList, _d[i].children);
					}
				} else {
					var data = {};
					for(var key in _d) {
						if("children"!=key) data[key]=_d[key];
					}
					dataList.push(data);
					if(_d.children) groupData(isPid, dataList, _d.children);
				}
			}
		};

		//初始化
		var _init = function(opts) {
			if(opts.data.constructor===Array || Object.prototype.toString.call(opts.data)=="[object Array]") {
				if(!opts.data[0].id) return ;
			} else {
				if(!opts.data.id) return ;
			}

			if(opts.isPid) {
				opts.__list = opts.data;
				opts.data = [];
				groupData(opts.isPid, opts.data, opts.__list);
			} else {
				opts.__list = [];
				groupData(opts.isPid, opts.__list, opts.data);
			}

			this.opts = opts;
			makeTree(this);
		};

		_init.prototype = {
			"constructor": this,
			"__selected": [],
			"getSelected": function() {
				var self = this;
				var json = {};
				for(var i=0; len=self.__selected.length,i<len; ) {
					if(1==json[self.__selected[i].id]) {
						self.__selected.splice(i, 1);
					} else {
						json[self.__selected[i].id] = 1;
						i++;
					}
				}
				return self.__selected;
			},
			"cleanSelected": function() {
				this.__selected = [];
			},
			"setOptions": function(objs) {

			}
		};

		return new _init(opts);
	};

	win.eTree = et;
})(window);