(function(win){
	var selected=[];
	var ms = function(opts) {
		var leftBox, rightBox, leftUl, rightUl;
		var el = document.getElementById(opts.id);
		var list = JSON.parse(el.getAttribute("list") || []);
		var data = JSON.parse(el.getAttribute("data") || []);

		var _mkbox = function() {
			var div = document.createElement("DIV");
			if(arguments[0]=="left")
				leftBox = div;
			else 
				rightBox = div;
			var ul = document.createElement("UL");
			div.appendChild(ul);
			for(var i=0,len=arguments[1].length; i<len; i++) {
				var li = document.createElement("LI");
				li.onclick = function() {

				};
				ul.appendChild(li);
			}
		};
	};

	ms.prototype = {
		"getSelected": function() {

		};
	};

	win.multiselect = {
		"init": function(opts) {
			if(!opts.id) return ;
			return new ms(opts);
		};
	}
})(window)