;(function(fn) {
	var uuid = 0,
		win = window,
		doc = document,
		scheduleMap = {},
		toString = Object.prototype.toString,
		reg1 = /\{\{.+?\}\}/g,
		reg2 = /(?:\b|\[)[\w\*]+(?:\]|\b)/g,
		table = doc.createElement("TABLE"),
		thead = doc.createElement("THEAD"),
		tbody = doc.createElement("TBODY"),
		tr = doc.createElement("TR"),
		td = doc.createElement("TD"),
		duang = void(0)!==fn?fn.call(null):null;

	function ClassSchedule(params) {
		if(!this instanceof ClassSchedule) {
			return new ClassSchedule(params);
		}

		var self = this,
			cloneData = [],
			data = params.data,
			headTexts = params.headTexts||[],
			headTpl = params.headTpl,
			hasHeader = params.hasHeader,
			hasTimeLine = params.hasTimeLine,
			hasTimeCount = params.hasTimeCount,
			myTable = table.clone(1),
			myThead = thead.clone(1),
			myTbody = tbody.clone(1),
			headTds = [],
			columnCount = Math.max.apply(Math, [headTexts.length, data.length]);

		self._name = params.name||"ClassSchedule";

		function render() {
			if(!params) return ;

			if(false!==hasHeader) {
				var i = 0;
				var headTr = tr.clone(1);
				myTable.appendChild(myThead);
				myThead.appendChild(headTr);

				if(false!==hasTimeLine) {
					var timeLineTd = td.clone(1),
					timeLineTd.innerHTML = "午别";
					headTr.appendChild(timeLineTd);
				}

				if(false!==hasTimeCount) {
					var timeCountTd = td.clone(1),
					timeCountTd.innerHTML = "节次";
					headTr.appendChild(timeCountTd);
				}

				while(i<columnCount) {
					var theadTd = td.clone(1);
					(function() {
						
					}());
				}
			} 
		}

		self.getData = function() {
			return data;
		};

		self.setData = function(d) {
			data = d || data;
			render();
		};

		self.addData = function(d) {
			if(!d) return ;
			cloneData.unshift({type:"insert", data:d});
		};

		self.cleanClone = function() {
			cloneData.length = 0;
		};

		self.deleteClone = function() {
			var args = [].slice.call(arguments, 0),
				num = shift();

			void(0)!==num?cloneData.splice(0, num):cloneData.unshift();
		};

		self.cleanSchedule = function() {
			data = [];
			render();
		};

		self.render = function() {
			render.call(self);
		};
	}

	ClassSchedule.prototype = {
		constructor: ClassSchedule,
		getScheduleName: function() {
			return this._name;
		}
	};

	var classSchedule = {
		init: function(params) {
			if(!params || !params.wrap) return ;
			var schedule = new ClassSchedule(params);
			scheduleMap[params.name||("ClassSchedule"+uuid++)] = schedule;
			return schedule;
		},
		getScheduleByName: function(name) {
			if(!name) return ;
			return scheduleMap[name] || null;
		}
	};

	/*var params = {
		wrap: dom,
		value: 1,
		data: data,
		hasTimeLine: true,
		hasTimeCount: true,
		hasHeader: true,
		showParam: "name",
		headTexts: [],
		headTpl: "<span>{{@headText[*]}}</span><span>{{@data[*].day}}</span>"
		name: "aaa",
		disabled: false,
		finish: function(val) {}
	};*/

	null!==duang?duang.module("ex-component", ["Tool"]).controller("classSchedule", ["tool"], function() {return classSchedule}):win.classSchedule=classSchedule;
}(function() {
	return window.duang || null;
}, void(0)));