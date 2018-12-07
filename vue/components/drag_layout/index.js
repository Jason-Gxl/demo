;(function(vm) {

	window.vm = vm;

	// 添加事件接口，兼容
	var addEvent = window.addEventListener?function(ele, type, fn, use) {
		ele.addEventListener(type, fn, use||false);
	}:function(ele, type, fn) {
		ele.attachEvent("on"+type, fn);
	};

	// 容器对象构造函数
	function ContainerBuilder(params) {
		if(!(this instanceof ContainerBuilder)) {
			return new ContainerBuilder(params);
		}

		var start = null, // 鼠标移动的起始点
			active = ""; // 表示鼠标移动事件是否生效

		// 保证容器是相对定位
		params.container.style.setProperty("position", "relative");

		// 为容器添加代理事件mousedown
		addEvent(params.container, "mousedown", function() {
			var self = this, e = arguments[0] || window.event;

			// 遍历事件在冒泡过程中的路径
			e.path.some(function(item) {
				// 准备移动块
				if(/\bitem-inside\b/ig.test(item.className)) {
					var parentNode = item.parentElement || item.parentNode;
					self.dispatchEvent(new CustomEvent("premove", {detail: parentNode}));
					var rect = parentNode.getBoundingClientRect();
					active = "move";
					start = {
						x: e.clientX - rect.left,
						y: e.clientY - rect.top
					};

					return true;
				}

				// 准备缩放
				if(/\bdrag-btn\b/ig.test(item.className)) {
					var parentNode = item.parentElement || item.parentNode;
					self.dispatchEvent(new CustomEvent("prezoom", {detail: parentNode}));
					active = "zoom";
					start = {
						x: rect.left,
						y: rect.top
					};

					return true;
				}
			});
		});

		// 为容器添加代理事件mouseup
		addEvent(document, "mouseup", function() {
			start = null;
			active = false;
			params.container.dispatchEvent(new CustomEvent("custmouseup"));
		});

		// 为容器添加代理事件mousemove
		addEvent(params.container, "mousemove", function() {
			if(!active) return ;
			var e = arguments[0] || window.event;

			var param = {
				x: e.clientX - start.x,
				y: e.clientY - start.y,
				event: e
			};

			params.container.dispatchEvent(new CustomEvent(active, {detail: param}));
		});
	}

	// 容器内部可移动块构造函数
	function ItemBuilder(params, parent) {
		if(!(this instanceof ItemBuilder)) {
			return new ItemBuilder(params, parent);
		}

		var container = params.container, // 容器
			containerRect = container.getBoundingClientRect(), // 获取容器的位置信息
			cloneItem = null, // 即将被移动块的克隆
			activeItem = null,	// 即将被操作对象
			realStyle = null;	// 即将被移动的块的真实样式

		// 注册premove事件
		addEvent(container, "premove", function() {
			var e = arguments[0] || window.event;
			activeItem = e.detail || null;
			if(!activeItem) return ;

			cloneItem = activeItem.cloneNode(true);
			realStyle = window.getComputedStyle(activeItem);

			var itemRect = activeItem.getBoundingClientRect();
			var	style = cloneItem.style;

			style.setProperty("position", "absolute");
			style.setProperty("top", (itemRect.top - (containerRect.top + (+realStyle.marginTop.match(/^\d+/)) + activeItem.clientTop)) + "px");
			style.setProperty("left", (itemRect.left - (containerRect.left + (+realStyle.marginLeft.match(/^\d+/)) + activeItem.clientLeft)) + "px");
			container.appendChild(cloneItem);
			activeItem.style.setProperty("visibility", "hidden");
		});

		// 注册prezoom事件
		addEvent(container, "prezoom", function() {
			var e = arguments[0] || window.event;
			activeItem = e.detail || null;
		});

		// 注册custmouseup事件
		addEvent(container, "custmouseup", function() {
			if(!cloneItem) return ;
			activeItem.style.left = cloneItem.offsetLeft - realStyle.marginTop.match(/^\d+/) + "px";
			activeItem.style.top = cloneItem.offsetTop - realStyle.marginLeft.match(/^\d+/) + "px";
			activeItem.style.setProperty("visibility", "visible");
			container.removeChild(cloneItem);
			cloneItem = null;
			activeItem = null;
		});

		// 注册块移动事件
		addEvent(container, "move", function() {
			var e = arguments[0] || window.event,
				style = cloneItem.style,
				data = e.detail;

			style.left = data.x - (realStyle.marginLeft.match(/^\d+/) * 2) + "px";
			style.top = data.y - (realStyle.marginTop.match(/^\d+/) * 2) + "px";

			console.log(data.event);
		});

		// 注册缩放事件
		addEvent(container, "zoom", function() {
			var e = arguments[0] || window.event,
				style = activeItem.style,
				data = e.detail;

			style.width = data.x + "px";
			style.height = data.y + "px";
			console.log("zoom");
		});
	}

	vm.dragLayout = {
		init: function(params) {
			if(!params.container || void(0)===params.itemClass) return ;
			new ItemBuilder(params, new ContainerBuilder(params));
		}
	}

}(window.vm || {}));