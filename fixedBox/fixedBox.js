(function(win) {
	var fixedBox = {};

	fixedBox.init = function(options) {
		if(!options.id) return ;

		var _fb = function(options) {
			this.obj = options.obj;
			var objOpt = options.obj.getBoundingClientRect();
			this.initOpt = {
				"x": options.obj.offsetLeft,
				"y": options.obj.offsetTop
			};
			this.wheelEvent();
		};

		_fb.prototype = {
			"constructor": this,
			"wheelEvent": function() {
				var self = this;

				var so = function() {
					var e = arguments[0] || window.event;
					var _bs = self.BS();
					if(_bs.top>=self.initOpt.y) {
						if(self.obj.className.indexOf("fixedBox")==-1) self.obj.className = self.obj.className.replace(/(^\s*)|(\s*$)/g, "") +  " fixedBox";
					} else {
						self.obj.className = self.obj.className.replace("fixedBox", "").replace(/(^\s*)|(\s*$)/g, "");
					}
				};

				if(window.addEventListener) {
					document.addEventListener("scroll", so);
				} else {
					document.attachEvent("onScroll", so);
				}
			},
			"BS":function(){
				var db=document.body,
					dd=document.documentElement,
					top = db.scrollTop+dd.scrollTop;
					left = db.scrollLeft+dd.scrollLeft;
				return { 'top':top , 'left':left };
			}
		};

		var obj = document.getElementById(options.id) || options.id;

		if(!obj) return ;

		options.obj = obj;

		return new _fb(options);
	};

	win.fixedBox = fixedBox;
})(window)