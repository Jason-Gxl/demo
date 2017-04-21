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
		duang = void(0)!==fn?fn.call(null):null,
		weeks = ["星期-", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];

	function ClassSchedule(params) {
		if(!this instanceof ClassSchedule) {
			return new ClassSchedule(params);
		}

		var self = this,
			cloneData = [],
			classData = formatData(params.data),
			data = classData.data,
			headTexts = params.headTexts||[],
			headTpl = params.headTpl,
			hasHeader = params.hasHeader,
			hasTimeLine = params.hasTimeLine,
			hasTimeCount = params.hasTimeCount,
			myTable = table.cloneNode(true),
			myThead = thead.cloneNode(true),
			myTbody = tbody.cloneNode(true),
			headTds = [],
			columnCount = Math.max.apply(Math, [headTexts.length||weeks.length, classData.lastDay, params.dayCount||0]),
			rowCount = Math.max.apply(Math, [classData.lastClass, params.classCount||0]);

		self._name = params.name||"ClassSchedule";

		function render() {
			if(!params) return ;

			if(false!==hasHeader) {
				var i = 0, headTr = tr.cloneNode(true);
				myTable.appendChild(myThead);
				myThead.appendChild(headTr);

				if(false!==hasTimeLine) {
					var timeLineTd = td.cloneNode(true);
					timeLineTd.innerHTML = "午别";
					headTr.appendChild(timeLineTd); 
				}

				if(false!==hasTimeCount) {
					var timeCountTd = td.cloneNode(true);
					timeCountTd.innerHTML = "节次";
					headTr.appendChild(timeCountTd);
				}

				do {
					var theadTd = td.cloneNode(true);
					theadTd.innerHTML = !!headTpl?formatHeadTpl(headTpl, params, i):(headTexts[i]||weeks[i]);
					headTr.appendChild(theadTd);
				} while(++i<columnCount)
			}

			var i = 0;
			if(rowCount>i) {
				do {

				} while(++i<rowCount)
			}

			params.wrap.innerHTML = "";
			params.wrap.appendChild(myTable);
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
			var args = [].slice.call(arguments, 0), num = shift();
			void(0)!==num?cloneData.splice(0, num):cloneData.unshift();
		};

		self.cleanSchedule = function() {
			data = [];
			render();
		};

		self.render = function() {
			render.call(self);
		};

		render();
	}

	ClassSchedule.prototype = {
		constructor: ClassSchedule,
		getScheduleName: function() {
			return this._name;
		}
	};

	function formatData(d, type) {
		var daySeqs = [], classSeqs = [], len = d.length, i=0, data = [];

		if(0===type) {
			do {
				var j = 0, _d = d[i], l = _d.length;

				if(l>j) {
					do {
						if(null!==_d[j]) data.push(_d);
					} while(++j<l)
				}
			} while(++i<len)

			return data;
		}

		if(len>i) {
			do {
				var _d = d[i];
				if(!!_d) {
					!isNaN(_d.daySeq) && daySeqs.push(_d.daySeq);
					!isNaN(_d.classSeq) && classSeqs.push(_d.classSeq);
				}
			} while(++i<len)
		}

		var lastDay = Math.max.apply(Math, daySeqs),
			lastClass = Math.max.apply(Math, classSeqs),
			i = 1;

		do {
			var _data = new Array(lastClass), j = 0;

			do {
				var _d = d[j];

				if(_d.daySeq===i) {
					_data.splice(_d.classSeq-1, 1, _d);
					if(_data.length>=lastClass) break;
				}
			} while(++j<len)

			data.push(_data);
		} while(++i<=lastDay)

		return {
			lastDay: lastDay,
			lastClass: lastClass,
			data: data
		};
	}

	function formatHeadTpl(tpl, params, index) {
		if(!tpl || !params) reutrn ;

		tpl = tpl.replace(reg1, function() {
			var args = [].slice.call(arguments, 0),
				arr = args[0].match(reg2),
				len = arr.length,
				val = "",
				i = 0;

			if(len>i) {
				do {
					var p = arr[i];
					val = !!val?("[*]"===p.replace(/^\s*$/g, "")?val[index]:val[p]):("[*]"===p.replace(/^\s*$/g, "")?params[index]:params[p]);
					if(!val) return params.headTexts[index]||weeks[index];
				} while(++i<len)
			}

			return val;
		});

		return tpl;
	}

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