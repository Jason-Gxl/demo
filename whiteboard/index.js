var pad = (function() {
	"use strict"
	var win = window,
		doc = document,
		count = 0,
		pads = {},
		toolDiv = doc.createElement("DIV"),
		itemTpl = '<span class="tool-item $CLASS$"><i class="iconfont $FONT$"></i></span>',
		tools = ["pen", "rubber", "rectangle", "circular", "text", "line", "arrow", "color", "save"];

	var addEvent = (function() {
		return win.addEventListener?function(ele, type, fn, use) {
			ele.addEventListener(type, fn, use||false);
		}:function(ele, type, fn) {
			ele.attachEvent("on"+type, fn);
		}
	}())

	function Base(opts) {
		var self = this;
		this.name = "Base";
		this.canvas = opts && opts.canvas;
		this.toolBar = opts && opts.toolBar;
		this.ctx = this.canvas && this.canvas.getContext("2d");

		this.init = function(obj) {
			toolDiv.innerHTML = "";
			var _itemTpl = itemTpl.replace(/\$CLASS\$/g, "tool-item-"+this.name.toLowerCase()).replace("$FONT$", "");
			toolDiv.innerHTML = _itemTpl;
			var itemDom = toolDiv.firstChild;
			this.toolBar.appendChild(itemDom);
			this.dom = itemDom;

			addEvent(itemDom, "click", function() {
				obj.currentTool = self;
				self.choose(obj);
			});

			this.choose = function(obj) {
				var toolItems = obj.toolItems;
				for(var key in toolItems) {
					var classname = toolItems[key].dom.className;
					toolItems[key].dom.className = classname.replace(/selected/g, "").replace(/(^\s*)|(\s*$)/g, "");
				}
				itemDom.className = itemDom.className + " selected";
				this.setOption();
			};
		};

		this.setOption = function() {
			alert(this.name);
		};
	}

	Base.prototype = {
		draw: function(option) {
		},
		clean: function(option) {
		}
	};

	//笔
	function Pen(obj, opts) {
		Base.call(this, opts);
		this.name = "Pen";
		this.lineWidth = 1;
		this.init(obj);

		this.setOption = function() {
			alert(this.lineWidth);
		};
	}

	Pen.prototype = new Base();

	//橡皮擦
	function Rubber(obj, opts) {
		Base.call(this, opts);
		this.name = "Rubber";
		this.init(obj);
	}

	//矩形
	function Rectangle(obj, opts) {
		Base.call(this, opts);
		this.name = "Rectangle";
		this.init(obj);
	}

	//圆形
	function Circular(obj, opts) {
		Base.call(this, opts);
		this.name = "Circular";
		this.init(obj);
	}

	//文本
	function Text(obj, opts) {
		Base.call(this, opts);
		this.name = "Text";
		this.init(obj);
	}

	//直线
	function Line(obj, opts) {
		Base.call(this, opts);
		this.name = "Line";
		this.init(obj);
	}

	//箭头
	function Arrow(obj, opts) {
		Base.call(this, opts);
		this.name = "Arrow";
		this.init(obj);
	}

	//颜色
	function Color(obj, opts) {
		Base.call(this, opts);
		this.name = "Color";
		this.init(obj);
	}

	function Save(obj, opts) {
		Base.call(this, opts);
		this.name = "Save";
		this.init(obj);
	}

	function buildPad(opts) {
		var layout = opts.toolbarLayout,
			padWrap = doc.createElement("DIV"),
			toolBar = doc.createElement("DIV"),
			canvasWrap = doc.createElement("DIV"),
			canvas = doc.createElement("CANVAS");

		padWrap.className = "pad-wrap layout-"+layout;
		toolBar.className = "pad-tool-bar";
		canvasWrap.className = "canvas-wrap";
		canvas.className = "main-canvas";

		if("right"===opts.toolbarLayout || "bottom"===opts.toolbarLayout) {
			padWrap.appendChild(canvasWrap);
			padWrap.appendChild(toolBar);
		} else {
			padWrap.appendChild(toolBar);
			padWrap.appendChild(canvasWrap);
		}

		canvas.innerHTML = "Your broswer is unsupport canvas";
		canvasWrap.appendChild(canvas);
		opts.wrap.appendChild(padWrap);
		canvas.width = canvasWrap.clientWidth;
		canvas.height = canvasWrap.clientHeight;
		opts.toolBar = toolBar;
		opts.canvas = canvas;

		addEvent(win, "resize", function() {
			canvas.width = canvasWrap.clientWidth;
			canvas.height = canvasWrap.clientHeight;
		});
	}

	function buildTool(obj, opts) {
		var _tools = (opts && opts.tools) || tools,
			toolItems = obj.toolItems,
			len = _tools.length,
			i = 0;

		if(len>i) {
			do {
				switch(_tools[i].toLowerCase()) {
					case "pen":
					toolItems["pen"] = new Pen(obj, opts);
					break;
					case "rubber":
					toolItems["rubber"] = new Rubber(obj, opts);
					break;
					case "rectangle":
					toolItems["rectangle"] = new Rectangle(obj, opts);
					break;
					case "circular":
					toolItems["circular"] = new Circular(obj, opts);
					break;
					case "text":
					toolItems["text"] = new Text(obj, opts);
					break;
					case "line":
					toolItems["line"] = new Line(obj, opts);
					break;
					case "arrow":
					toolItems["arrow"] = new Arrow(obj, opts);
					break;
					case "color":
					toolItems["color"] = new Color(obj, opts);
					break;
					case "save":
					toolItems["save"] = new Save(obj, opts);
					break;
				}
			} while(++i<len)
		}
	}

	var builder = {
		init: function(opts) {
			if(!opts.wrap) return;
			buildPad(opts);
			var obj = {
				toolItems: {},
				currentTool: null,
				canvas: opts.canvas,
				toolBar: opts.toolBar,
				draw: function(option) {
					try {
						if(!this.currentTool.draw) throw new Error("function draw is undefined");
						this.currentTool.draw(option);
					} catch(e) {
						console.error(e.message);
					}
				}
			};
			pads[opts.name || count] = obj;
			buildTool(obj, opts);
			!opts.name && ++count;
			return obj;
		},
		getPad: function(name) {
			if(name===void 0) return ;
			return pads[name];
		}
	};

	return builder;
}(undefined))