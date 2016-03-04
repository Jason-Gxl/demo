!function(win) {
	var options = {
		showParam: "name",
		checkbox: false,
		isPid: false,
		key: "id"
	};

	var ELE = {
		create: function(type) {
			return document.createElement(type);
		},
		addClass: function(target, className) {
			target.className = (target.className.replace(/(^\s*)|(\s*$)/g, "") + " " + className).replace(/(^\s*)|(\s*$)/g, "");
		},
		addEvent: function(target, type, fn, useCapture) {
			if(win.addEventListener) {
				target.addEventListener(type, function(e) {
					fn.call(this, e);
				}, useCapture||false);
			} else {
				target.attachEvent("on"+type, function(e) {
					fn.call(this, e);
				});
			}
		}
	};

	function copy(oldVal, newVal) {
		for(var key in oldVal) {
			if(Object.prototype.toString.call(oldVal[key])=="[object Array]") {
				newVal[key] = [];
				copy(oldVal[key], newVal[key]);
			} else if(Object.prototype.toString.call(oldVal[key])=="[object Object]") {
				newVal[key] = {};
				copy(oldVal[key], newVal[key]);
			} else {
				newVal[key] = newVal[key] || oldVal[key];
			}
		}
	};

	function buildData(oldData, newData) {
		var len = newData.length;
		while(len--) {
			var p = newData[len];
			for(var i=0; i<oldData.length; ) {
				if(oldData[i].pid==p.id) {
					if("undefined"==typeof p.children) p.children = [];
					copy(oldData[i], p.children);
					oldData.splice(i, 1);
					buildData(oldData, p.children);
				} else {
					i++;
				}
			}
		}
	}

	function checkSelected(data, selectedData, checkbox, key, level, selected) {
		var len = data.length;
		while(len--) {
			var d = data[len];
			d.level = level;
			var i = selectedData.length;
			if(checkbox && selected) {
				d.selected = true;
			} else {
				while(i--) {
					d.selected = false;
					if(d[key]==selectedData[i][key]) d.selected = true;
				}
			}
			if(d.children) checkSelected(d.children, selectedData, checkbox, key, level+1, checkbox?d.selected:false);
		}
	}

	var treeBuilder = (function() {
		var selected = [], selDataTemp = [], selLiTemp=[];
		var checkboxList = [];

		var build = function(data, parent, checkbox, showParam, opts) {
			var len = data.length;
			while(len--) {
				var d = data[len];
				var li = ELE.create("LI");
				var arrow = ELE.create("A");
				ELE.addClass(arrow, "arrow arrow-down");
				li.appendChild(arrow);
				if(d.selected) {
					var _d = {};
					for(var key in d) {
						if("selected"!=key && "children"!=key && "level"!=key) _d[key] = d[key];
					}
					selected.push(_d);
					selDataTemp.push(d);
				}
				if(checkbox) {
					var chbox = ELE.create("INPUT");
					chbox.type = "checkbox";
					if(d.selected) chbox.checked = "checked";
					(function(d, chbox) {
						
					})(d, chbox);
					li.appendChild(chbox);
				}
				var leaf = ELE.create("A");
				leaf.href="javascript:void(0)";
				leaf.innerHTML = d[showParam] || "";
				if(!checkbox) {
					if(d.selected) {
						leaf.className = "selected";
						selLiTemp.push(leaf);
					}

					(function(d, leaf) {
						leaf.onclick = function() {
							var selectedLiLen = selLiTemp.length;
							while(selectedLiLen--) {
								selLiTemp[selectedLiLen].className = selLiTemp[selectedLiLen].className.replace("selected", "").replace(/(^\s*)|(\s*$)/g, "");
							}
							selLiTemp.splice(0, selectedLiLen);
							var selectedDataLen = selDataTemp.length;
							while(selectedDataLen--) {
								selDataTemp[selectedDataLen].selected = false;
							}
							selDataTemp.splice(0, selectedDataLen);
							if(!d.selected) {
								var _d = {};
								d.selected = true;
								for(var key in d) {
									if("selected"!=key && "children"!=key && "level"!=key) _d[key] = d[key];
								}
								selected.splice(0, selected.length);
								selected.push(_d);
								selDataTemp.push(d);
								this.className = "selected";
								selLiTemp.push(this);
								opts.select.call(this, _d);
							} else {
								d.selected = false;
								selected.splice(selected.indexOf(_d), 1);
								this.className = this.className.replace("selected", "").replace(/(^\s*)|(\s*$)/g, "");
							}
						};
					})(d, leaf);
				}

				li.appendChild(leaf); 
				li.className = (li.className + " level-" + d.level).replace(/(^\s*)|(\s*$)/g, "");
				parent.appendChild(li);
				if(d.children) build(d.children, parent, checkbox, showParam, opts);
			}
		};

		var _treeBuilder = function(opts) {
			var wrap = document.querySelector("#"+opts.id) || document.getElementById(opts.id);
			if("undefined"==typeof wrap) return ;
			var ul = document.createElement("ul");
			ul.id = "eTree";
			build(opts.data, ul, opts.checkbox, opts.showParam, opts);
			wrap.appendChild(ul);
		};

		_treeBuilder.prototype = {
			constructor: this,
			getSelected: function() {
				return selected;
			}
		};

		return _treeBuilder;
	})();


	win.eTree = {
		"init": function(opts) {
			if(!opts || !opts.id || !opts.data) return ;
			copy(options, opts);
			if(opts.isPid) {
				var newData = [];
				var len = opts.data.length;
				while(len--) {
					if("undefined"==typeof opts.data[len].pid) {
						copy(opts.data[len], newData);
						opts.data.splice(len, 1);
					}
				}
				buildData(opts.data, newData);
				opts.data = newData;
			}
			checkSelected(opts.data, opts.selected, opts.checkbox, opts.key, 0, false);
			return new treeBuilder(opts);
		}
	};
}(window);