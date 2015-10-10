(function(win) {
	var et = {};

	et.init = function(opts) {
		if(!opts.id || !opts.data) return ;
		if(opts.data.constructor===Array && 0==opts.data.length) return ;

		//创建树
		var makeTree = function(obj) {
			//配置信息
			var opts = obj.opts;
			//包裹器
			var wrap = document.getElementById(opts.id);

			//获取所有子元素
			var getChilds = function(childs, p) {
				var _cs = p.children;
				for(var i=0, len=_cs.length; i<len; i++) {
					childs.push(_cs[i]);
					if(_cs[i].children) getChilds(childs, _cs[i]);
				}
			};

			//父元素监控，如果所有子节点都被选中，父节点也标为选中状态
			var checkParents = function(child) {
				var selected = obj.getSelected();
				var _childs = [];  //装载当前树节点的父节点下的所有子元素
				var chks = [];  //装载当前树节点的父节点下的所有checkbox
				var count = 0;
				var _p = child.parentNode.parentNode;

				//获取当前树节点的父节点下的所有子元素
				getChilds(_childs, _p);

				//获取当前树节点的父节点下的所有checkbox
				for(var i=0, len = _childs.length; i<len; i++) {
					if(_childs[i].nodeType==1 && _childs[i].type=="checkbox") chks.push(_childs[i]);
				}

				//遍历当前树节点的父节点下的所有checkbox，并统计为选中状态的checkbox个数
				for(var i=1, len=chks.length; i<len; i++) {
					if(chks[i].checked) count ++;
				}

				//判断当前节点的父节点下的所有checkbox是否全部为选中状态；
				//如果全部为选中状态，将父节点的checkbox设为选中状态；
				//如果不是全部为选中状态，将父节点的checkbox设为未选中状态；
				var id = chks[0].getAttribute("did");
				if(count==chks.length-1) {
					chks[0].checked = true;
					for(var i=0, len=opts.__list.length; i<len; i++) {
						if(opts.__list[i].id==id) selected.push(opts.__list[i]);
					}
				}else {
					chks[0].checked = false;
					for(var i=0; len=selected.length,i<len; ) {
						if(id==selected[i].id) {
							selected.splice(i, 1);
						} else {
							i++;
						}
					}
				}

				if(child.parentNode.id!="eTree") checkParents(_p);
			};

			var has = function(obj, list) {
				var flag = false;
				for(var i=0, len=list.length; i<len; i++) {
					if(list[i].id==obj.id) {
						flag = true;
						break;
					}
				}
				return flag;
			};

			//创建树
			var _mt = function(parent, cData, id) {
				//创建树节点
				var createBough = function(data) {
					var li = document.createElement("LI");
					var arrow = document.createElement("SPAN");
					arrow.className = "arrow arrow-up";
					if(!data.children) arrow.className = arrow.className + " hide";
					li.appendChild(arrow);

					arrow.onclick = function() {
						var _cn = this.className;
						_cn = _cn.replace(/(^\s*)|(\s*$)/g, "");
						var _cns = _cn.split(/\s/g);

						var flag = false;
						for(var i=0, len=_cns.length; i<len; i++) {
							if("arrow-up"==_cns[i]) flag = true;
							if("arrow-up"==_cns[i] || "arrow-down"==_cns[i]) {
								_cns.splice(i, 1);
								break;
							}
						}

						var _cu = null;
						var childs = li.children;
						for(var i=0, len=childs.length; i<len; i++) {
							if("UL"==childs[i].tagName) {
								_cu = childs[i];
								break;
							}
						}

						if(flag) {
							_cns.push("arrow-down");
							_cu.className = (_cu.className.replace(/(^\s*)|(\s*$)/, "") + " hidden").replace(/(^\s*)|(\s*$)/, "");
						} else {
							_cns.push("arrow-up");
							_cu.className = _cu.className.replace("hidden", "").replace(/(^\s*)|(\s*$)/, "");
						}

						this.className = _cns.join(" ");
					};

					if(opts.checkbox) {
						var selected = opts.selected;
						var _selected = obj.getSelected();
						var chk = document.createElement("INPUT");
						chk.type = "checkbox";
						chk.className = "chk";
						chk.setAttribute("did", data.id);
						li.appendChild(chk);

						chk.onclick = function() {
							var selected = obj.getSelected();
							var __childs = [];  //装载当前树节点下的所有子元素
							var chks = [];

							if(!this.checked) {
								if(Array===selected.constructor) {
									for(var i=0; len=selected.length,i<len; ) {
										if(selected[i].id==data.id)
											selected.splice(i, 1);
										else i++
									}
								} else {
									if(data.id==selected.id) obj.cleanSelected();
								}
							} else {
								var d = {};
								for(var key in data) {
									if("children"!=key) d[key] = data[key];
								}
								selected.push(d);
							}

							//获取当前树节点下的所有子元素
							getChilds(__childs, this.parentNode);

							//获取当前树节点下的所有checkbox
							for(var i=0, len = __childs.length; i<len; i++) {
								if(__childs[i].nodeType==1 && __childs[i].type=="checkbox") chks.push(__childs[i]);
							}

							//遍历当前树节点下的所有checkbox；
							//如果当前树节点为选中状态，那么当前树节点下的所有checkbox标为选中状态；
							//如果当前树节点为未选中状态，那么去掉当前树节点下的所有checkbox的选中状态；
							for(var i=1; len=chks.length,i<len; i++) {
								var id = chks[i].getAttribute("did");
								if(this.checked) {
									if(!chks[i].checked) {
										chks[i].checked = true;
										for(var j=0, len=opts.__list.length; j<len; j++) {
											if(id==opts.__list[j].id) {
												selected.push(opts.__list[j]);
											}
										}
									}
								} else {
									if(chks[i].checked) {
										chks[i].checked = false;
										for(var j=0, len=obj.__selected.length; j<len; j++) {
											if(id==obj.__selected[j].id) {
												selected.splice(j, 1);
												break;
											}
										}
									}
								}
							}

							//父元素监控
							checkParents(this.parentNode);
						};

						if(Array===selected.constructor) {
							for(var i=0, len=selected.length; i<len; i++) {
								if(selected[i].id==data.id) {
									var d = {};
									for(var key in data) {
										if("children"!=key) {
											d[key] = data[key];
										}
									}
									_selected.push(d);
									chk.checked = true;
									break;
								}
							}
						} else {
							if(selected.id==data.id) {
								var d = {};
								for(var key in data) {
									if("children"!=key) {
										d[key] = data[key];
									}
								}
								_selected.push(d);
								chk.checked = true;
							}
						}

						var span = document.createElement("SPAN");
						for(key in data) {
							if("children"!=key && opts.showParam!=key) span.setAttribute(key, data[key]);
						}
						span.setAttribute("title", data[opts.showParam]);
						span.appendChild(document.createTextNode(data[opts.showParam]));
						li.appendChild(span);
					} else {
						var selected = opts.selected;
						if(opts.selected.constructor===Array) selected = opts.selected[0];
						var a = document.createElement("A");
						a.className = "tree_bough";

						if(selected.id==data.id) {
							var d = {};
							a.className = a.className + " selected";
							for(var key in data) {
								if("children"!=key) {
									d[key] = data[key];
								}
							}
							obj.__selected.push(d);
						}

						a.setAttribute("href", "javascript:void(0);");

						for(key in data) {
							if("children"!=key && opts.showParam!=key) {
								a.setAttribute(key, data[key]);
							}
						}

						var _span = document.createElement("SPAN");
						_span.appendChild(document.createTextNode(data[opts.showParam]));
						a.setAttribute("title", data[opts.showParam]);
						a.appendChild(_span);

						a.onclick = function() {
							var selected = obj.getSelected();
							var d = null;

							var _as = document.getElementsByClassName("tree_bough");
							for(var i=0, len=_as.length; i<len; i++) {
								_as[i].className = _as[i].className.replace(/(^\s*)|(\s*$)/g, "").replace("selected", "").replace(/(^\s*)|(\s*$)/g, "");
							}

							if(!selected || selected.id != this.id) {
								d = {};
								for(var key in data) {
									if("children"!=key) d[key] = data[key];
								}

								this.className = this.className.replace(/(^\s*)|(\s*$)/g, "") + " selected";
								opts.select.call(this, d);
							}
							
							obj.cleanSelected();
							obj.__selected.push(d);
						};

						li.appendChild(a);
					}

					if(data.children) {
						_mt(li, data.children);
					}

					return li;
				};

				var ul = document.createElement("UL");
				if(id) ul.id = id;
				if(cData.constructor===Array) {
					for(var i=0, len=cData.length; i<len; i++) {
						ul.appendChild(createBough(cData[i]));
					}
				} else {
					ul.appendChild(createBough(cData));
				}

				parent.appendChild(ul);
			};

			_mt(wrap, opts.data, "eTree");

			if(opts.checkbox) {
				var childs = [];
				var checkboxs = [];
				getChilds(childs, wrap);

				for(var i=0, len = childs.length; i<len; i++) {
					if(childs[i].nodeType==1 && childs[i].type=="checkbox") checkboxs.push(childs[i]);
				}

				for(var i=0, len=checkboxs.length; i<len; i++) {
					if(checkboxs[i].checked) checkParents(checkboxs[i].parentNode);
				}
			}
		};

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

		var _init = function(opts) {
			if(opts.data.constructor===Array) {
				if(!opts.data[0].id) return ;
			} else {
				if(!opts.data.id) return ;
			}

			var self = this;
			self.opts = opts;

			if(self.opts.isPid) {
				self.opts.__list = self.opts.data;
				self.opts.data = [];
				groupData(self.opts.isPid, self.opts.data, self.opts.__list);
			} else {
				self.opts.__list = [];
				groupData(self.opts.isPid, self.opts.__list, self.opts.data);
			}

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