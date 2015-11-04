(function(win) {
	var bindEvent = {

	};

	var build = function(wrap, opts) {
		this.wrap = wrap;
		this.opts = opts;
		this.data = opts.data||[];
		this.selected=opts.selected||[];
		this.tempLiList=[];
		this.tempDataList=[];
		this.isLeft;
	};

	build.prototype = {
		constructor: this, 
		start: function() {
			this.buildLeftBox();
			this.buildCtrl();
			this.buildRightBox();
		},
		buildLeftBox: function() {
			var wrap = this.wrap;
			var opts = this.opts;
			var data = opts.data||[];
			var leftBox = document.createElement("DIV");
			leftBox.className = "box leftBox";
			wrap.appendChild(leftBox);
			var ul = document.createElement("UL");
			leftBox.appendChild(ul);
			for(var i=0,len=data.length; i<len; i++) {
				var d = data[i];
				var li = document.createElement("LI");
				var a = document.createElement("A");
				a.innerHTML = d[opts.showParam];
				a.onclick = (function(data){
					
				})(d);
				li.appendChild(a);
				for(var key in d) {
					a.setAttribute(key, d[key]);
				}
				ul.appendChild(li);
			}
		},
		buildCtrl: function() {
			var wrap = this.wrap;
			var opts = this.opts;
			var ctrlWrap = document.createElement("DIV");
			ctrlWrap.className = "ctrlWrap";
			wrap.appendChild(ctrlWrap);
			var btn1 = document.createElement("A");
			btn1.innerHTML = "全部移入";
			btn1.href = "javascript:void(0);";
			btn1.className = "btn btn1";

			var btn2 = document.createElement("A");
			btn2.innerHTML = "移入";
			btn2.href = "javascript:void(0);";
			btn2.className = "btn btn2";

			var btn3 = document.createElement("A");
			btn3.innerHTML = "移出";
			btn3.href = "javascript:void(0);";
			btn3.className = "btn btn3";

			var btn4 = document.createElement("A");
			btn4.innerHTML = "全部移出";
			btn4.href = "javascript:void(0);";
			btn4.className = "btn btn4";

			ctrlWrap.appendChild(btn1);
			ctrlWrap.appendChild(btn2);
			ctrlWrap.appendChild(btn3);
			ctrlWrap.appendChild(btn4);
		},
		buildRightBox: function() {
			var wrap = this.wrap;
			var opts = this.opts;
			var data = opts.selected||[];
			var rightBox = document.createElement("DIV");
			rightBox.className = "box rightBox";
			wrap.appendChild(rightBox);
			var ul = document.createElement("UL");
			rightBox.appendChild(ul);
			for(var i=0,len=data.length; i<len; i++) {
				var d = data[i];
				var li = document.createElement("LI");
				var a = document.createElement("A");
				a.innerHTML = d[opts.showParam];
				li.appendChild(a);
				for(var key in d) {
					a.setAttribute(key, d[key]);
				}
				ul.appendChild(li);
			}
		}
	};

	var ms = function(opts) {
		var userWrap = document.getElementById(opts.id);
		if(!userWrap) return ;
		this._opts = opts;
		var myWrap = document.createElement("DIV");
		userWrap.appendChild(myWrap);
		myWrap.className = "multiselect";
		var builder = new build(myWrap, opts);
		builder.start();
	};

	ms.prototype = {
		constructor: this,
		getSelected: function() {
			return this.selected || [];
		}
	};

	win.multiselect = {
		init: function(opts) {
			if(!opts || !opts.id) return ;
			return new ms(opts);
		}
	};
})(window);