var drag = (function() {

	var _dragBox = function() {
		var _area = $$("dragBox");

		if(!_area) return ;

		var _boxs = $$(".dragItem");

		if(_boxs.length==0) return false;

		var itemInfo = {};

		_boxs.on("mousedown", function(e) {
			var self = this;
			var itemInfo = {
				"w": self.offsetWidth,
				"h": self.offSetHeight,
				"t": self.offsetTop,
				"l": self.offsetLeft
			};
			self.style.position = "absolute";
			self.style.zIndex = 9000;
			self.style.width = itemInfo.w + "px";
			self.style.height = itemInfo.h + "px";
			var mouse = mouseCoords(e);
			self.style.left = mouse.x + 20 + "px";
			self.style.top = mouse.y + "px";
		});

		_area.on("mousemove", function(e) {
			var mouse = mouseCoords(e);
		});

		_boxs.on("mouseup", function(e) {
			var mouse = mouseCoords(e);
		});
	};

	var dragEvent = function() {
		
	};

	return _dragBox;
})();

var dragBox = {
	"init": function() {
		return new drag(arguments);
	}
};