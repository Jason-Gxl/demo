;(function(fn) {
	"use strict";
	var win = window,
		doc = document,
		duang = fn.call(Object.create(null)),
		toString = Object.prototype.toString,
		configs = {},
		uuid = 0,
		selectTpl = '<div class="select-wrap"><span class="show-selected">$SHOW$</span><span class="select-btn"><i class="iconfont icon-arrow-down"></i></span></div>',
		optionTpl = '<li class="option-item">$SHOW$</li>',
		defaultConfig = {
			showParam: "name",
			disabled: false
		},
		results = {},
		nodeTab = {
			li: "ul",
			ul: "div",
			td: "tr",
			tr: "tbody",
			tbody: "table",
			table: "div"
		};

	function getParentNode(nodeName, level) {
		var level = level || 0,
			parentNode = null,
			pNodeName = nodeTab[nodeName];
		if(!pNodeName) return {dom:doc.createElement("DIV"), level:++level};
		while(nodeTab[nodeName]) {
			var node = doc.createElement(nodeTab[nodeName]);
			parentNode && node.appendChild(parentNode);
			parentNode = node;
			nodeName = nodeTab[nodeName];
			level++;
		}
		return {dom:parentNode, level:level};
	}

	function Select(tool) {
		return {
			init: function() {
				var args = [].slice.call(arguments, 0),
					params = args.shift(),
					showWrap = null,
					showStr = params.defaultShow || "请选择",
					tpl = selectTpl,
					selectedEle = null,
					isShow = false;

				if(!params || !params.wrap || !tool.isDom(params.wrap)) return ;
				params = tool.deepCopy(defaultConfig, params, true);
				params.name = params.name || uuid++;

				var data = params.data,
					wrap = params.wrap,
					outer = doc.createElement("DIV"),
					parent = doc.createElement("UL");
				outer.appendChild(parent);

				if(params.itemTpl) {
					var reg = new RegExp("(^ |<?)([a-zA-Z]+)\\b"),
						reg1 = new RegExp("\\{\\{(.*?)\\}\\}", "i");
					params.itemTpl.match(reg);
					var nodeName = RegExp.$2,
						outerInfo = getParentNode(nodeName, 0),
						outer = outerInfo.dom,
						parent = outer,
						level = outerInfo.level;
					for (;--level>0;parent=parent.firstChild);
				}

				var data = "[object Array]"!==toString.call(data)?[data]:[].concat.apply([], data);
				var i = 0, len = data.length;

				if(len>i) {
					do {
						var d = data[i];
						if("[object Array]"===toString.call(d)) continue;

						(function(d) {
							if("[object Object]"===toString.call(d)) {
								if(params.itemTpl) {
									var str = params.itemTpl;
									while(reg1.test(str)) {
										str = str.replace(reg1, d[RegExp.$1]);
									}
								} else {
									var str = optionTpl.replace("$SHOW$", d[params.showParam]);
								}

								tool.insertHTML(parent, "beforeend", str);

								tool.addEvent(parent.lastChild, "click", function() {
									params.select && params.select.call(this, d[params.valParam], d);
									results[params.name] = d;
									showWrap.innerHTML = d[params.showParam];
									tool.addClass(outer, "select-hidden");
									tool.removeAttr(outer, "style");
									selectedEle && tool.removeClass(selectedEle, "selected");
									tool.addClass(this, "selected");
									isShow = false;
									selectedEle = this;
								});

								if(d[params.valParam]==params.value) {
									results[params.name] = d;
									showStr = d[params.showParam];
									selectedEle = parent.lastChild;
									tool.addClass(selectedEle, "selected");
								}
							} else {
								var str = params.itemTpl?params.itemTpl.replace(reg1, d):optionTpl.replace("$SHOW$", d);
								tool.insertHTML(parent, "beforeend", str);

								tool.addEvent(parent.lastChild, "click", function() {
									params.select && params.select.call(this, d);
									results[params.name] = d;
									showWrap.innerHTML = d;
									tool.addClass(outer, "select-hidden");
									tool.removeAttr(outer, "style");
									selectedEle && tool.removeClass(selectedEle, "selected");
									tool.addClass(this, "selected");
									isShow = false;
									selectedEle = this;
								});

								if(d==params.value) {
									results[params.name] = d;
									showStr = d[params.showParam];
									selectedEle = parent.lastChild;
									tool.addClass(selectedEle, "selected");
								}
							}
						}(d));
					} while(++i<len)
				}
		
				configs[params.name] = params;
				tpl = tpl.replace("$SHOW$", showStr);
				wrap.innerHTML = tpl;
				showWrap = wrap.lastChild.getElementsByClassName("show-selected")[0];
				params.disabled && tool.addClass(wrap.lastChild, "disabled");

				tool.addEvent(wrap.lastChild, "click", function() {
					if(params.disabled) {
						params.open && params.open.call(this, false);
						return ;
					}
					isShow = !isShow;
					if(isShow) {
						var outerRect = wrap.lastChild.getBoundingClientRect();
						tool.removeClass(outer, "select-hidden");
						outer.style.top = outerRect.top+win.scrollY+outerRect.height-1 + "px";
						outer.style.left = outerRect.left+win.scrollX+ "px";
						params.open && params.open(this, results[params.name]);
					} else {
						tool.addClass(outer, "select-hidden");
						tool.removeAttr(outer, "style");
					}
				});

				tool.addEvent(wrap.lastChild, "mouseout", function() {
					var e = [].slice.call(arguments, 0).shift() || win.event;
					if(!isShow) return ;
					if(e.relatedTarget.offsetParent!==outer) {
						tool.addClass(outer, "select-hidden");
						isShow = false;
					}
				});

				tool.addEvent(outer, "mouseleave", function() {
					var e = [].slice.call(arguments, 0).shift() || win.event;
					if(!isShow) return ;
					tool.addClass(outer, "select-hidden");
					isShow = false;
				});

				tool.addClass(outer, "select-option-wrap");
				tool.addClass(outer, "select-hidden");
				doc.body.appendChild(outer);
				params.finish && params.finish.call(this);
			},
			getSelectedByName: function(name) {
				return results[name];
			},
			disable: function(name) {
				if(void(0)===name || !configs[name]) return ;
				configs[name].disabled = true;
			},
			enable: function(name) {
				if(void(0)===name || !configs[name]) return ;
				configs[name].disabled = false;
			}
		};

	}

	/*var params = {
		wrap: dom,
		value: 1,
		data: data,
		showParam: "name",
		valParam: "value",
		default: "请选择",
		name: "aaa",
		disabled: false,
		itemTpl: "<li value='{{value}}'></li>",
		open: function() {},
		select: function() {},
		finish: function(val) {}
	};*/

	duang?duang.module("Component", ["Tool"]).directive("select", ["tool"], Select):win.select=Select.call(Object.create(null));
}(function() {
	return window.duang || null;
}, void(0)));