(function(win) {
	var et = {};

	et.init = function(opts) {
		if(!opts.id || !opts.data) return ;
		if(opts.data.constructor===Array && 0==opts.data.length) return ;

		// //创建树
		// var makeTree = function(obj, wrap) {
		// 	//配置信息
		// 	var opts = obj.opts;

		// 	var checkChilds = function(parent, flag) {
		// 		var selected = obj.getSelected();
		// 		var _childs = [];
		// 		var chks = [];
		// 		var getChilds = function(p) {
		// 			var childs = p.children;
		// 			for(var i=0,len=childs.length; i<len; i++) {
		// 				_childs.push(childs[i]);
		// 				if(childs[i].children) {
		// 					getChilds(childs[i]);
		// 				}
		// 			}
		// 		};
		// 		getChilds(parent);
		// 		for(var i=0,len=_childs.length; i<len; i++) {
		// 			if(_childs[i].nodeType==1 && _childs[i].type=="checkbox") {
		// 				chks.push(_childs[i]);
		// 			}
		// 		}
		// 		if(flag) {
		// 			for(var i=1,len=chks.length; i<len; i++) {
		// 				chks[i].checked = true;
		// 				var id = chks[i].getAttribute("did");
		// 				for(var j=0,l=opts.__list.length; j<l; j++) {
		// 					if(opts.__list[j].id==id) {
		// 						selected.push(opts.__list[j]);
		// 					}
		// 				}
		// 			}
		// 		} else {
		// 			for(var i=1,len=chks.length; i<len; i++) {
		// 				chks[i].checked = false;
		// 				var id = chks[i].getAttribute("did");
		// 				for(var j=0; j<selected.length; ) {
		// 					if(selected[j].id==id) {
		// 						selected.splice(j, 1);
		// 					} else {
		// 						j++;
		// 					}
		// 				}
		// 			}
		// 		}
		// 	};

		// 	//获取所有子元素
		// 	var getChilds = function(childs, p) {
		// 		var _cs = p.children;
		// 		for(var i=0, len=_cs.length; i<len; i++) {
		// 			childs.push(_cs[i]);
		// 			if(_cs[i].children) getChilds(childs, _cs[i]);
		// 		}
		// 	};

		// 	//父元素监控，如果所有子节点都被选中，父节点也标为选中状态
		// 	var checkParents = function(child) {
		// 		if(child.parentNode.id=="eTree") return;
		// 		var selected = obj.getSelected();
		// 		var _childs = [];  //装载当前树节点的父节点下的所有子元素
		// 		var chks = [];  //装载当前树节点的父节点下的所有checkbox
		// 		var count = 0;
		// 		var _p = child.parentNode.parentNode;

		// 		//获取当前树节点的父节点下的所有子元素
		// 		getChilds(_childs, _p);

		// 		//获取当前树节点的父节点下的所有checkbox
		// 		for(var i=0, len = _childs.length; i<len; i++) {
		// 			if(_childs[i].nodeType==1 && _childs[i].type=="checkbox") chks.push(_childs[i]);
		// 		}

		// 		//遍历当前树节点的父节点下的所有checkbox，并统计为选中状态的checkbox个数
		// 		for(var i=1, len=chks.length; i<len; i++) {
		// 			if(chks[i].checked) count ++;
		// 		}

		// 		//判断当前节点的父节点下的所有checkbox是否全部为选中状态；
		// 		//如果全部为选中状态，将父节点的checkbox设为选中状态；
		// 		//如果不是全部为选中状态，将父节点的checkbox设为未选中状态；
		// 		var id = chks[0].getAttribute("did");
		// 		if(count==chks.length-1) {
		// 			chks[0].checked = true;
		// 			for(var i=0, len=opts.__list.length; i<len; i++) {
		// 				if(opts.__list[i].id==id) selected.push(opts.__list[i]);
		// 			}
		// 		}else {
		// 			chks[0].checked = false;
		// 			for(var i=0; len=selected.length,i<len; ) {
		// 				if(id==selected[i].id) {
		// 					selected.splice(i, 1);
		// 				} else {
		// 					i++;
		// 				}
		// 			}
		// 		}

		// 		checkParents(_p);
		// 	};

		// 	//创建树
		// 	var _mt = function(parent, cData, id) {
		// 		//创建树节点
		// 		var createBough = function(data) {
		// 			var li = document.createElement("LI");
		// 			var arrow = document.createElement("SPAN");
		// 			arrow.className = "arrow arrow-up";
		// 			if(!data.children) arrow.className = arrow.className + " hide";
		// 			li.appendChild(arrow);

		// 			arrow.onclick = function() {
		// 				var _cn = this.className;
		// 				_cn = _cn.replace(/(^\s*)|(\s*$)/g, "");
		// 				var _cns = _cn.split(/\s/g);

		// 				var flag = false;
		// 				for(var i=0, len=_cns.length; i<len; i++) {
		// 					if("arrow-up"==_cns[i]) flag = true;
		// 					if("arrow-up"==_cns[i] || "arrow-down"==_cns[i]) {
		// 						_cns.splice(i, 1);
		// 						break;
		// 					}
		// 				}

		// 				var _cu = null;
		// 				var childs = li.children;
		// 				for(var i=0, len=childs.length; i<len; i++) {
		// 					if("UL"==childs[i].tagName) {
		// 						_cu = childs[i];
		// 						break;
		// 					}
		// 				}

		// 				if(flag) {
		// 					_cns.push("arrow-down");
		// 					_cu.className = (_cu.className.replace(/(^\s*)|(\s*$)/, "") + " hidden").replace(/(^\s*)|(\s*$)/, "");
		// 				} else {
		// 					_cns.push("arrow-up");
		// 					_cu.className = _cu.className.replace("hidden", "").replace(/(^\s*)|(\s*$)/, "");
		// 				}

		// 				this.className = _cns.join(" ");
		// 			};

		// 			if(opts.checkbox) {
		// 				var selected = opts.selected;
		// 				var _selected = obj.getSelected();
		// 				var chk = document.createElement("INPUT");
		// 				chk.type = "checkbox";
		// 				chk.className = "chk";
		// 				chk.setAttribute("did", data.id);
		// 				li.appendChild(chk);

		// 				chk.onclick = function() {
		// 					if(this.checked) {
		// 						var d = {};
		// 						for(var key in data) {
		// 							if("children"!=key) {
		// 								d[key] = data[key];
		// 							}
		// 						}
		// 						_selected.push(d);
		// 					} else {
		// 						for(var i=0; i<_selected.length; ) {
		// 							if(_selected[i].id==data.id) {
		// 								_selected.splice(i, 1);
		// 							} else {
		// 								i++;
		// 							}
		// 						}
		// 					}
		// 					checkChilds(this.parentNode, this.checked);
		// 					//父元素监控
		// 					checkParents(this.parentNode);
		// 				};

		// 				if(Object.prototype.toString.call(selected) === "[object Array]") {
		// 					for(var i=0, len=selected.length; i<len; i++) {
		// 						if(selected[i].id==data.id) {
		// 							var d = {};
		// 							for(var key in data) {
		// 								if("children"!=key) {
		// 									d[key] = data[key];
		// 								}
		// 							}
		// 							_selected.push(d);
		// 							chk.checked = true;
		// 							break;
		// 						}
		// 					}
		// 				} else {
		// 					if(selected.id==data.id) {
		// 						var d = {};
		// 						for(var key in data) {
		// 							if("children"!=key) {
		// 								d[key] = data[key];
		// 							}
		// 						}
		// 						_selected.push(d);
		// 						chk.checked = true;
		// 					}
		// 				}

		// 				var span = document.createElement("SPAN");
		// 				for(key in data) {
		// 					if("children"!=key && opts.showParam!=key) span.setAttribute(key, data[key]);
		// 				}
		// 				span.setAttribute("title", data[opts.showParam]);
		// 				span.appendChild(document.createTextNode(data[opts.showParam]));
		// 				li.appendChild(span);
		// 			} else {
		// 				var selected = opts.selected;
		// 				if(opts.selected.constructor===Array) selected = opts.selected[0];
		// 				var a = document.createElement("A");
		// 				a.className = "tree_bough";

		// 				if(selected.id==data.id) {
		// 					var d = {};
		// 					a.className = a.className + " selected";
		// 					for(var key in data) {
		// 						if("children"!=key) {
		// 							d[key] = data[key];
		// 						}
		// 					}
		// 					obj.__selected.push(d);
		// 				}

		// 				a.setAttribute("href", "javascript:void(0);");

		// 				for(key in data) {
		// 					if("children"!=key && opts.showParam!=key) {
		// 						a.setAttribute(key, data[key]);
		// 					}
		// 				}

		// 				var _span = document.createElement("SPAN");
		// 				_span.appendChild(document.createTextNode(data[opts.showParam]));
		// 				a.setAttribute("title", data[opts.showParam]);
		// 				a.appendChild(_span);

		// 				a.onclick = function() {
		// 					var selected = obj.getSelected();
		// 					var d = null;

		// 					var _as = document.getElementsByClassName("tree_bough");
		// 					for(var i=0, len=_as.length; i<len; i++) {
		// 						_as[i].className = _as[i].className.replace(/(^\s*)|(\s*$)/g, "").replace("selected", "").replace(/(^\s*)|(\s*$)/g, "");
		// 					}

		// 					if(!selected || selected.id != this.id) {
		// 						d = {};
		// 						for(var key in data) {
		// 							if("children"!=key) d[key] = data[key];
		// 						}

		// 						this.className = this.className.replace(/(^\s*)|(\s*$)/g, "") + " selected";
		// 						opts.select.call(this, d);
		// 					}
							
		// 					obj.cleanSelected();
		// 					obj.__selected.push(d);
		// 				};

		// 				li.appendChild(a);
		// 			}

		// 			if(data.children) {
		// 				_mt(li, data.children);
		// 			}

		// 			return li;
		// 		};

		// 		var ul = document.createElement("UL");
		// 		if(id) ul.id = id;
		// 		if(cData.constructor===Array) {
		// 			for(var i=0, len=cData.length; i<len; i++) {
		// 				ul.appendChild(createBough(cData[i]));
		// 			}
		// 		} else {
		// 			ul.appendChild(createBough(cData));
		// 		}

		// 		parent.appendChild(ul);
		// 	};

		// 	_mt(wrap, opts.data, "eTree");

		// 	if(opts.checkbox) {
		// 		var childs = [];
		// 		var checkboxs = [];
		// 		getChilds(childs, wrap);

		// 		for(var i=0, len = childs.length; i<len; i++) {
		// 			if(childs[i].nodeType==1 && childs[i].type=="checkbox") checkboxs.push(childs[i]);
		// 		}

		// 		for(var i=0, len=checkboxs.length; i<len; i++) {
		// 			if(checkboxs[i].checked) {
		// 				var chs = [];
		// 				getChilds(chs, checkboxs[i].parentNode);
		// 				var checkboxList = [];
		// 				for(var j=0,l=chs.length; j<l; j++) {
		// 					if(chs[j].nodeType==1 && chs[j].type=="checkbox") checkboxList.push(chs[j]);
		// 				}
		// 				for(var j=0,l=checkboxList.length; j<l; j++) {
		// 					checkboxList[j].checked = true;
		// 				}
		// 				checkParents(checkboxs[i].parentNode);
		// 			}
		// 		}
		// 	}
		// };

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
					}
				} else {
					var _d = {};
					for(var key in d) {
						if("children"!=key) {
							_d[key] = d[key];
						}
					}
					datas.push(_d);
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
					if(!has(datas[i], obj.__selected)) {
						obj.__selected.push(datas[i]);
					}
				}
			} else {
				for(var i=0,len=chks.length; i<len; i++) {
					chks[i].checked = false;
				}
				for(var i=0,len=datas.length; i<len; i++) {
					for(var j=0; j<obj.__selected.length; ) {
						if(datas[i].id==obj.__selected[j].id) {
							obj.__selected.splice(j, 1);
						} else {
							j++;
						}
					}
				}
			}
		};

		var checkParents = function(ul, obj, flag) {
			if(ul.className.indexOf("level-0")!=-1) return;
			var childs = [];
			var chks = [];
			var count = 0;
			var _getChilds = function(p) {
				var childrens = p.children;
				for(var i=0,len=childrens.length; i<len; i++) {
					childs.push(childrens[i]);
					if(childrens[i].children) {
						_getChilds(childrens[i]);
					}
				}
			};
			if(flag) {
				_getChilds(ul);
				for(var i=0,len=childs.length; i<len; i++) {
					if(1==childs[i].nodeType && "checkbox"==childs[i].type) {
						chks.push(childs[i]);
					}
				}
				var len = chks.length;
				for(var i=0; i<len; i++) {
					if(chks[i].checked) {
						count++;
					}
				}
				if(count==len) {
					var childrens = ul.parentNode.children;
					for(var i=0,len=childrens.length; i<len; i++) {
						if(childrens[i].nodeType==1 && childrens[i].type=="checkbox") {
							childrens[i].checked = true;
							var id = childrens[i].id;
							for(var j=0,l=obj.opts.__list.length; j<l; j++) {
								if(obj.opts.__list[j].id==id && !has(obj.opts.__list[j], obj.__selected)) {
									obj.__selected.push(obj.opts.__list[j]);								
								}
							}
						}
					}
				}
			} else {
				var childrens = ul.parentNode.children;
				for(var i=0,len=childrens.length; i<len; i++) {
					
				}
			}
		};

		var makeTreeWithCheckbox = function(_p, data, obj, level) {
			var makeLeaf = function(d) {
				var children = d.children;
				var ul = children?document.createElement("UL"):null;
				if(ul) {
					ul.setAttribute("show", true);
					ul.className = "level-"+level;
				}
				var li = document.createElement("LI");
				var arrow = document.createElement("span");
				arrow.className = "arrow arrow-up" + (!children?" hide":"");
				if(children) {
					arrow.onclick = function() {
						if("true"==ul.getAttribute("show")) {
							ul.className = ul.className + " hidden";
							ul.setAttribute("show", false);
						} else {
							ul.className = ul.className.replace("hidden", "").replace(/(^\s*)|(\s*$)/g, "");
							ul.setAttribute("show", true);
						}
					};
					makeTreeWithCheckbox(ul, children, obj, level++);
				}
				var input = document.createElement("INPUT");
				input.type = "checkbox";
				input.id = d.id;
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
					makeLeaf(d);
				}
			} else {
				makeLeaf(data);
			}
		};

		var makeTreeWithoutCheckbox = function(_p, data, obj, level) {
			var makeLeaf = function(d) {
				var children = d.children;
				var ul = children?document.createElement("UL"):null;
				if(ul) {
					ul.setAttribute("show", true);
					ul.className = "level-"+level;
				}
				var li = document.createElement("LI");
				var arrow = document.createElement("span");
				arrow.className = "arrow arrow-up" + (!children?" hide":"");
				if(children) {
					arrow.onclick = function() {
						if("true"==ul.getAttribute("show")) {
							ul.className = ul.className + " hidden";
							ul.setAttribute("show", false);
						} else {
							ul.className = ul.className.replace("hidden", "").replace(/(^\s*)|(\s*$)/g, "");
							ul.setAttribute("show", true);
						}
					};
					makeTreeWithoutCheckbox(ul, children, obj, level++);
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
					}
					obj.cleanSelected();
					obj.__selected.push(_d);
					this.className = (this.className.replace(/(^\s*)|(\s*$)/g, "") + " selected").replace(/(^\s*)|(\s*$)/g, "");
				};
				for(var i=0,len=obj.opts.selected.length; i<len; i++) {
					if(obj.opts.selected[i].id==d.id) {
						a.className = (a.className.replace(/(^\s*)|(\s*$)/g, "") + " selected").replace(/(^\s*)|(\s*$)/g, "");
						var _d = {};
						for(var key in d) {
							_d[key] = d[key];
						}
						obj.__selected.push(_d);
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

			if(Array===data.constructor) {
				for(var i=0,len=data.length; i<len; i++) {
					var d = data[i];
					makeLeaf(d);
				}
			} else {
				makeLeaf(data);
			}
		};

		var _makeTree = function(_p, data, obj, level) {
			if(obj.opts.checkbox) {
				makeTreeWithCheckbox(_p, data, obj, level);
			} else {
				makeTreeWithoutCheckbox(_p, data, obj, level);
			}
		};

		var makeTree = function(obj) {
			console.log(obj);
			var wrap = document.getElementById(obj.opts.id);
			var ul = document.createElement("UL");
			ul.className = "level-0";
			ul.id = "eTree";
			_makeTree(ul, obj.opts.data, obj, 1);
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
			if(opts.data.constructor===Array) {
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

			var self = this;
			self.opts = opts;
			makeTree(self);
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